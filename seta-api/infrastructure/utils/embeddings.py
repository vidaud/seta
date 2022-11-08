from sentence_transformers import SentenceTransformer
from .clean import sentenced

model = SentenceTransformer('all-distilroberta-v1')
model.max_seq_length = 512
version = "sbert model all-distilroberta-v1"


class Embeddings:
    @staticmethod
    def get_embeddings(title, abstract, text):
        text_doc = ''
        if title is not None:
            text_doc = title + "\n"
        if abstract is not None:
            text_doc = text_doc + abstract + "\n"
        if text is not None:
            text_doc = text_doc + text
        cleaned_text = sentenced(text_doc)
        words = cleaned_text.split(" ")
        high = 299
        embeddings = []
        c = 1
        for w in range(0, len(words), 300):
            ww = words[w:high]
            sent = " ".join([str(x) for x in ww])
            embedding = model.encode(sent, convert_to_numpy=True)
            embeddings.append({"vector": embedding.tolist(), "chunk": c, "version": version, "text": sent})
            c += 1
            high += 300
        return embeddings

