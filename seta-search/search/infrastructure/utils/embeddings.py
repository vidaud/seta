from sentence_transformers import SentenceTransformer
from .clean import sentenced

model = SentenceTransformer('all-distilroberta-v1')
model.max_seq_length = 512
version = "sbert model all-distilroberta-v1"

CHUNK_SIZE = 300


def compute_embeddings(text):
    cleaned_text = sentenced(text)
    words = cleaned_text.split(" ")
    high = 299
    embeddings = []
    vectors = []
    c = 1
    for w in range(0, len(words), 300):
        ww = words[w:high]
        sent = " ".join([str(x) for x in ww])
        embedding = model.encode(sent, convert_to_numpy=True)
        embeddings.append({"vector": embedding.tolist(), "chunk": c, "version": version, "text": sent})
        vectors.append(embedding.tolist())
        c += 1
        high += 300
    return embeddings, vectors

class Embeddings:
    @staticmethod
    def chunks_and_embeddings_from_doc_fields(title, abstract, text):
        text_doc = ''
        if title is not None:
            text_doc = title + "\n"
        if abstract is not None:
            text_doc = text_doc + abstract + "\n"
        if text is not None:
            text_doc = text_doc + text
        emb, vec = compute_embeddings(text_doc)
        return emb

    @staticmethod
    def chunks_and_embeddings_from_text(text):
        emb, vec = compute_embeddings(text)
        return version, vec, emb

    @staticmethod
    def embedding_vector_from_text(text):
        emb = model.encode(text, convert_to_numpy=True).tolist()
        return emb







