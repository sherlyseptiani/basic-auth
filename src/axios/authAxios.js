import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://www.googleapis.com/identitytoolkit/v3/relyingparty'
})

instance.interceptors.request.use((config) => {
  console.log("Auth Request: ", config)
  return config
})

instance.interceptors.response.use((config) => {
  console.log("Auth Response: ", config)
  return config
})

export default instance