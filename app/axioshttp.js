/* eslist-disasble */

import {getString, setString} from "@nativescript/core/application-settings"
import axios from 'axios/dist/axios'
import urls from '~/urls.js'

export const Http = axios.create({
    baseURL: `${urls.API_URL}api`
})

Http.interceptors.request.use(function (config) {
    let user = getString('user')

    if (user) {
        let pasmo = JSON.parse(user)
        config.headers.Authorization = `Bearer ${pasmo.token}`
    }
  return config
}, function (error) {
  return Promise.reject(error)
})

export const axiosgetApi = function (url, filters) {
  return new Promise((resolve, reject) => {
    Http.get(url, { params: filters })
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response)
      })
  })
}

export const axiosdeleteApi = function (url, payload) {
  return new Promise((resolve, reject) => {
    Http.delete(url, payload)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response)
      })
  })
}

export const axiospostApi = function (url, payload) {
  return new Promise((resolve, reject) => {
    Http.post(url, payload)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response)
      })
  })
}

export const axiospatchApi = function (url, payload) {
  return new Promise((resolve, reject) => {
    Http.patch(url, payload)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => {
        reject(error.response)
      })
  })
}
