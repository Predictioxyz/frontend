import axios from 'axios'

const $host = axios.create({
    baseURL: 'http://localhost:8000/'    
})

export default $host
