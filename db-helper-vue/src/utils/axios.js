import axios from 'axios'
import store from '@/store'

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Do something before request is sent

  const token = window.localStorage.getItem('token')

  if (token) {
    config.headers['Authorization'] = 'Bearer ' + token
  }

  return config

}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  // Do something with response data
  if (response.data.code === 401) {
    store.dispatch('logout')
    throw new Error()
  }
  return response.data
}, function (error) {

  // Do something with response error
  return Promise.reject(error)
})

export default axios
