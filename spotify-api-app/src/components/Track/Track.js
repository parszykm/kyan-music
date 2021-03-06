import React from 'react'
import './track.css'
import {useState, useEffect} from 'react'
import {BiVolumeFull} from 'react-icons/bi'
const Track = (props) => {
  const [state,setState]=useState(props.state)
  const handlePlay = (e) =>{
    props.isActive({
      track_name: props.name,
      artist: props.artist,
      uri: props.uri,
      image: props.image,
      id: props.track_id,
      offset: props.id,
      time: props.time,
    })
    props.isActiveId(props.track_id)
    
  }
  // const [time, setTime] = useState(0)
  // useEffect(() =>{
  //   if(!props.time) return
  //   setTime(new Date(parseInt(props.time)).toISOString().slice(11,19))},[props.time])

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