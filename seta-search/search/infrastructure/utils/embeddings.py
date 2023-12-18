import requests


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

    def __init__(self, url: str) -> None:
        self.api_url = url

    def chunks_and_embeddings_from_doc_fields(self, title, abstract, text):
        data = {
            "text": text,
            "title": title,
            "abstract": abstract
        }
        result = requests.post(url=self.api_url + "chunks/document", data=data)
        embeddings = result.json()
        return embeddings

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

    @staticmethod
    def chunks_and_embeddings_from_text(text):
        emb, vec = compute_embeddings(text)
        return version, vec, emb

    @staticmethod
    def embedding_vector_from_text(text):
        emb = model.encode(text, convert_to_numpy=True).tolist()
        return emb
