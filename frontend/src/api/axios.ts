import axios from 'axios'

// all API calls go to Spring Boot on port 8080
const api = axios.create({
    baseURL: 'http://localhost:8080',
})

// automatically attach JWT token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export default api