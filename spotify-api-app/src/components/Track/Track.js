import React from 'react'
import './track.css'
import {BiVolumeFull} from 'react-icons/bi'
const Track = (props) => {
    
  return (
    <div className="track">
        <div className="track__state">{props.state ? <BiVolumeFull style={{color:'var(--font-gray)'}} size='25'/> : <p>{props.id}</p>}</div>
        <div>{props.name}</div>
        <div>{props.artist}</div>
        <div>{props.time}</div>
        <div>{props.album}</div>

    </div>
  )
}

export default Track