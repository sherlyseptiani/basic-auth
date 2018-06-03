import axios from 'axios'

const instance = axios.create({
  baseURL: 'https://sherly-shopee.firebaseio.com'
})

instance.interceptors.request.use((config) => {
  console.log("DB Request: ", config)
  return config
})

instance.interceptors.response.use((config) => {
  console.log("DB Response: ", config)
  return config
})

export default instance