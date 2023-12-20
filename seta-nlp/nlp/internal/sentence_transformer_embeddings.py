import asyncio
import logging
import functools
from concurrent.futures import ProcessPoolExecutor

from interface import implements

from sentence_transformers import SentenceTransformer

from nlp import models
from nlp.internal import utils
from nlp.internal.interfaces import embeddings as iemb

logger = logging.getLogger(__name__)

SBERT_MODEL = None


def create_model():
    """Creates global model."""
    global SBERT_MODEL  # pylint: disable=global-statement

    SBERT_MODEL = SentenceTransformer("all-distilroberta-v1")
    SBERT_MODEL.max_seq_length = 512


# if you try to run all predicts concurrently, it will result in CPU trashing.
pool = ProcessPoolExecutor(max_workers=1, initializer=create_model)


def _model_predict(text: str, convert_to_numpy: bool = True):
    vector = SBERT_MODEL.encode(text, convert_to_numpy=convert_to_numpy)
    return vector


async def _execute_predict(text: str, convert_to_numpy: bool = True):
    loop = asyncio.get_event_loop()

    return await loop.run_in_executor(
        pool,
        functools.partial(_model_predict, text=text, convert_to_numpy=convert_to_numpy),
    )


class SentenceTransformerEmbeddings(implements(iemb.IEmbeddingsAsync)):
    CHUNK_SIZE = 300

    def __init__(self):
        self.version = "sbert model all-distilroberta-v1"

    async def chunks_and_embeddings_from_doc_fields(
        self, title: str, abstract: str, text: str
    ) -> list[models.ComputedEmbedding]:
        """Compute embeddings from document fields."""

        text_doc = ""

        if title is not None:
            text_doc = title + "\n"

        if abstract is not None:
            text_doc = text_doc + abstract + "\n"

        if text is not None:
            text_doc = text_doc + text

        embeddings = await self._compute_embeddings(text_doc)
        return embeddings

    async def chunks_and_embeddings_from_text(self, text: str) -> models.Chunks:
        """Compute embeddings from text"""

        embeddings = await self._compute_embeddings(text)
        return models.Chunks(emb_with_chunk_text=embeddings)

    async def embedding_vector_from_text(self, text: str) -> models.Vector:
        """Compute vector from text"""

        vector = await _execute_predict(text)
        vector_list = vector.tolist()

        return models.Vector(vector=vector_list)

    async def _compute_embeddings(self, text: str):
        cleaned_text = utils.sentenced(text)
        words = cleaned_text.split(" ")

        high = self.CHUNK_SIZE - 1
        embeddings = []

        chunk_number = 1
        for index in range(0, len(words), self.CHUNK_SIZE):
            ww = words[index:high]

            sent = " ".join([str(w) for w in ww])

            vector = await _execute_predict(sent)
            vector_list = vector.tolist()

            embeddings.append(
                models.ComputedEmbedding(
                    vector=vector_list,
                    chunk=chunk_number,
                    version=self.version,
                    text=sent,
                )
            )

            chunk_number += 1
            high += self.CHUNK_SIZE

        return embeddings


async def get_embeddings_client():
    """Creates embeddings client using SetaTransformer"""

    return SentenceTransformerEmbeddings()
