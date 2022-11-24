import requests
import json
api_url = "https://seta.emm4u.eu/seta-api/seta/api/v1/"

#request guest token
guest_token = requests.get(api_url + "get-token")
token_json = json.loads(guest_token.text)

#put guest token in Authorization header
headers = {"Authorization": token_json['access_token']}

payload = {
  "term": "data",
  "n_docs": 10,
  "from_doc": 0
}
#perform your request(in this case corpus api)
r = requests.post(api_url + "corpus", data=json.dumps(payload), headers=headers)
