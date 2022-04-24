import React from 'react'
import {useEffect,useState } from 'react'
import axios from 'axios'
const useAuth = (code) => {
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
    useEffect(() => {
      if(!accessToken) return
      const interval = setInterval(() =>{
        console.log('Refreshed\n')
        axios.post('http://localhost:3001/refresh',{refreshToken})
        .then(res => {
          setAccessToken(res.data.accessData)
        })
        .catch(() => {
          window.location = "/"
        })
      },(expiresIn-60)*1000)
      return () => clearInterval(interval)
    },[accessToken])
  return accessToken
}

export default useAuth