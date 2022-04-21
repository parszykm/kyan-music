import React from 'react'
import './home.css'
import Track from '../../components/Track/Track'
const Home = (props) => {
  return (
    <div className="home" >
      {props.tracks.map((item,index) => (
        
        <Track isActive={props.changeActive} isActiveId={props.changeActiveId} state={props.activeTrack === item.uri?1:0} key={index} id={index} name={item.track_name} artist={item.artist} time='1:28' album={item.album_name} uri={item.uri} track_id={item.key}/>
        
      ))}
      {/* <div className="home__player">
         <Player accessToken={props.accessToken} uri={activeTrack}/>
      </div>
      */}
    </div>
  )
}

export default Home