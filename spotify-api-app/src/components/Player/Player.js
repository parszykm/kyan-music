import React from 'react'
import SpotifyPlayer from 'react-spotify-web-playback'
import {useState,useEffect} from 'react'
const Player = (props) => {
  //  
   const [play,setPlay]=useState(false)
   useEffect(() => {
    setPlay(true)
   },[props.uri])
  if(!props.accessToken) {return null}
  return (
      <div className="player">
          <SpotifyPlayer 
          token={props.accessToken} 
          uris={props.uri?[props.uri]:[]}
          callback={state => {
            if(!state.isPlaying) setPlay(false)
            
          }}
          play={play}
          />
      </div>
    
  )
}

export default Player