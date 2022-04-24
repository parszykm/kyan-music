import React from 'react'
import './track.css'
import {useState} from 'react'
import {BiVolumeFull} from 'react-icons/bi'
const Track = (props) => {
  const [state,setState]=useState(props.state)
  const handlePlay = (e) =>{
    props.isActive(props.uri)
    props.isActive({
      name: props.name,
      artist: props.artist,
      uri: props.uri,
      image_url: props.image,
      id: props.track_id
    })
    props.isActiveId(props.track_id)
    
  }

  return (
    <div className={props.state?"track active":"track"} tabIndex="0" onFocus={handlePlay}>
        <div className="track__state">{props.state ? <BiVolumeFull style={{color:'var(--font-gray)'}} size='25'/> : <p>{props.id}</p>}</div>
        <div>{props.name}</div>
        <div>{props.artist}</div>
        <div>{props.time}</div>
        <div>{props.album}</div>

    </div>
  )
}

export default Track