import React from 'react'
import Track from '../../components/Track/Track'
import './favs.css'
const Favs = (props) => {

  return (
    <div className="favs">
      {props.favorites.map((item,index) => (
        
        <Track isActive={props.changeActive} isActiveId={props.changeActiveId} state={props.activeTrack === item.uri?1:0} key={index} id={index} name={item.track_name} artist={item.artist} time='1:28' album={item.album_name} uri={item.uri} track_id={item.key}/>
        
      ))}
    </div>
  )
}

export default Favs