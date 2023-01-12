import axios from "axios";

export class CorpusService {
    getDocuments(term) {
        return axios({
            method: "GET",
            url:"/seta-api/api/v1/corpus",
            params:{
              aggs: 'date_year',
              term: term
          }
          })
          .then(d => d.data.documents)
          .catch((error) => {
            if (error.response) {
              console.log(error.response)
              }
          })
    }

  getDocumentsFromEmbeddings(embeddings) {
    return fetch("/seta-api/api/v1/corpus", {
        method: "POST",
        body: JSON.stringify({
          n_docs: 10,
          emb_vector: embeddings,
          source: ["cordis"],
          term: ""
        }),
      })
      .then((d) => d.json())
      .catch((error) => {
        if (error.response) {
          console.log(error.response)
          }
      })
}
}