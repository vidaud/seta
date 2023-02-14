import axios from "axios";

export class SuggestionsService {
    retrieveSuggestions(characters: any) {
        const endpoint = 'suggestions';
        const api = "/seta-api/api/v1/";
          return axios.get(`${api}${endpoint}`, { params: { chars: characters } })
          .then((response: any) => {
            return response.data.words;
          })
          .catch((error) => {
            if (error.response) {
              console.log(error);
            }
          }) as any
      } 
}