import axios from 'axios'

export default axios.create({
  baseURL: '',
  headers: {
    Authorization: '',
    'Content-Type': 'application/json'
  }
})