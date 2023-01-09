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
}