import axios from "axios";

export class EmbeddingsService {
    getEmbeddings(term) {
        const endpoint = 'compute_embeddings';
        const api = "/seta-api/api/v1/";
        return axios.post(`${api}${endpoint}`, term)
        .then(d => d.data.documents)
          .catch((error) => {
            if (error.response) {
              console.log(error.response)
              }
          })
    }
    retrieveEmbeddings(type: string, body: {"fileToUpload": File, "text": string}) {
        const endpoint = 'compute_embeddings';
        const api = "/seta-api/api/v1/";
        if (type === "file") {
          const formData = new FormData();
          formData.append("file", body.fileToUpload);
          return axios.post(`${api}${endpoint}`, formData)
        } else {
          return axios.post(`${api}${endpoint}`, {text: body.text})
        }
      } 
}