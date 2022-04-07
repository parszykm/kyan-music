import React from 'react'
import {useEffect,useState } from 'react'
import axios from 'axios'
const useAuth = (code) => {
    console.log('siema')
    const [accessToken, setAccessToken] =useState()
    const [refreshToken, setRefreshToken] =useState()
    const [expiresIn, setExpiresIn] =useState()
    useEffect(() => {
      
        axios.post('http://localhost:3001/token',{code,})
        .then(res => {
          setAccessToken(res.data.accessData)
          setRefreshToken(res.data.refreshToken)
          setExpiresIn(res.data.expiresIn)
          window.history.pushState({}, null, "/")
        })
        .catch(() => {
          window.location = "/"
        })
        
        
    },[code])
    console.log(expiresIn)
    useEffect(() => {
      if(!refreshToken) return
      const interval = setInterval(() =>{
        axios.post('http://localhost:3001/refresh',{refreshToken})
        .then(res => {
          setAccessToken(res.data.accessData)
        })
        .catch(() => {
          window.location = "/"
        })
      },(expiresIn-60)*1000)
      return () => clearInterval(interval)
    },[code])
  return accessToken
}

export default useAuth