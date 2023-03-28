import axios from 'axios'

export class OntologyListService {
  retrieveOntologyList(characters: any) {
    const endpoint = 'ontology-list'
    const api = '/seta-api/api/v1/'

    return axios
      .get(`${api}${endpoint}`, { params: { term: characters } })
      .then((response: any) => {
        return response.data.nodes
      })
      .catch(error => {
        if (error.response) {
          console.log(error)
        }
      }) as any
  }
}
