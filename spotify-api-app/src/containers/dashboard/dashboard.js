import React from 'react'
import './dashboard.css'
import useAuth from '../../useAuth'
import Sidebar from '../Sidebar/Sidebar'
import {useState,useEffect} from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import Home from '../home/home'
import Trends from '../trends/Trends'
import {BiArrowBack,BiSearch} from 'react-icons/bi'
import axios from 'axios'
const Dashboard = ({code}) => {
    const accessToken = useAuth(code)
    const [profilePic,setProfilePic] =useState()
    const [profileName,setProfileName] =useState()
    const [tracks, setTracks] =useState([])
    useEffect(() => {
      if(!accessToken) return
      axios.post('http://localhost:3001/profile', {accessToken,})
      .then( data => {
        setProfilePic(data.data.url)
        setProfileName(data.data.name)
        
      }).catch(err => {console.error(err)})
      console.log(profileName)
    },[accessToken])
    const searchTracks = (e) =>{

      axios.post('http://localhost:3001/search',{accessToken,search_value: e})
      .then(data => {
        setTracks(data.data)
        console.log(tracks)
      })
      .catch(err => console.error(err))

    }
  return (
  <Router>
    <div className="dashboard">
    <Sidebar profilePic={profilePic} name={profileName}/>
    <div className="dashboard__content">
      <div className="dashboard__content-input">
        <div className="dashboard__content-input-arrows">
          <BiArrowBack size='22'/>
          <BiArrowBack size ='22' style={{transform: 'rotate(180deg)'}}/>
        </div>
        
        <div className="dashboard__content-input-search_bar">
          <BiSearch/>
          <input type="search" placeholder="Search for tracks..." onKeyUp={e => (e.key === 'Enter' ? searchTracks(e.target.value) : () => {} )}></input>
        </div>
        
      </div>
    
      <Routes>
        <Route path="/" element={<Home tracks={tracks}/>}></Route>
        <Route path="/trends" element={<Trends/>}></Route>
      </Routes>
      
    
    </div>
    {/* <div className="testin">
          <div>{code}<br/></div>
    <div><p>token <br/></p>{accessToken}</div>
    </div> */}

    </div>
    </Router>
  )
}

export default Dashboard