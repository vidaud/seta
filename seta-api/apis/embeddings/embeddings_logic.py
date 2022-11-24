from infrastructure.ApiLogicError import ApiLogicError

def compute_embeddings(text, current_app):
    if text is None:
        raise ApiLogicError('No text provided.')
    vector = current_app.sbert_model.encode([text], convert_to_numpy=True)
    emb = {
        "embeddings": {
            "version": "sbert_vector - SentenceTransformer model all-distilroberta-v1",
            "vector": vector[0].tolist()
        }
    }
    return emb