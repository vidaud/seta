from seta_api.infrastructure.ApiLogicError import ApiLogicError
from seta_api.infrastructure.utils.embeddings import Embeddings


def compute_embeddings(text):
    if text is None:
        raise ApiLogicError('No text provided.')
    version, vectors, emb_wt = Embeddings.chunks_and_embeddings_from_text(text)
    emb = {"emb_with_chunk_text": emb_wt}
    return emb
