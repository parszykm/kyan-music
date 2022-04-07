import React from 'react'
import './home.css'
const Home = (props) => {
  props.tracks.forEach(track =>{
    console.log(track.artist)
  })
  return (
    <div className="home">
      {props.tracks.map(item => (
        <>
        <div className="track"><p>{item.track_name}</p><p>{item.artist}</p></div>
        </>
      ))}
    </div>
  )
}

export default Home