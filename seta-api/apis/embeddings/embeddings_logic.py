from infrastructure.ApiLogicError import ApiLogicError
from infrastructure.utils.embeddings import Embeddings


def compute_embeddings(text, current_app):
    if text is None:
        raise ApiLogicError('No text provided.')
    vector = current_app.sbert_model.encode([text], convert_to_numpy=True)
    version, vectors = Embeddings.embeddings_from_text(text)
    emb = {
        "embeddings": {
            "version": version,
            "vector": vector[0].tolist(),
            "vectors": vectors
        }
    }
    return emb