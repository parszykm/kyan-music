import React from 'react'
import './home.css'
import Track from '../../components/Track/Track'
const Home = (props) => {
  // props.tracks.forEach(track =>{
  //   console.log(track.artist)
  // })
  return (
    <div className="home">
      {props.tracks.map((item,index) => (
        
        <Track state={0} key={index} id={index} name={item.track_name} artist={item.artist} time='1:28' album={item.album_name} uri={item.uri}/>
        
      ))}
    </div>
  )
}

export default Home