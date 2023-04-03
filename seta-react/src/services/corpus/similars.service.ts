import axios from 'axios'

export class SimilarsService {
  retrieveSimilars(characters: any) {
    const endpoint = 'similar'
    const api = '/seta-api/api/v1/'

    return axios
      .get(`${api}${endpoint}`, { params: { term: characters } })
      .then((response: any) => {
        return response.data.words
      })
      .catch(error => {
        if (error.response) {
          console.log(error)
        }
      }) as any
  }
}
