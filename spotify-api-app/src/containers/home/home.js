import React from 'react'
import './home.css'
import Track from '../../components/Track/Track'
import Player from '../../components/Player/Player'
import { useState } from 'react'
const Home = (props) => {
  const [activeTrack, setActiveTrack] = useState()
  const changeActive = (track) =>{
    setActiveTrack(track)
    console.log(track)
  
  }
  return (
    <div className="home" >
      {props.tracks.map((item,index) => (
        
        <Track isActive={changeActive} state={activeTrack === item.uri?1:0} key={index} id={index} name={item.track_name} artist={item.artist} time='1:28' album={item.album_name} uri={item.uri}/>
        
      ))}
      <div className="home__player">
         <Player accessToken={props.accessToken} uri={activeTrack}/>
      </div>
     
    </div>
  )
}

export default Home