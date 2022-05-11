import React from 'react'
import Track from '../../components/Track/Track'
import './favs.css'
import {useEffect,useState} from 'react'
import axios from 'axios'
const Favs = (props) => {
  const accessToken = props.accessToken
  const [favorites, setFavorites] = useState([])
  useEffect(() => {
    if(!accessToken) return
    axios.post('http://localhost:3001/favorites',{accessToken: accessToken}).then((res) => {
    setFavorites(res.data)
    props.setTracks(res.data)
    let uris = JSON.stringify(res.data.map(item => item.uri))
    props.setUris(uris)
    console.log('favs init')
  // console.log(res.data)
  }) 
  },[accessToken])
  return (
    <div className="favs">
      <div className="favs__heading">
        <h1>Your Favorite Songs</h1>
      </div>
      
      {!favorites ? () => {} : favorites.map((item,index) => (
        // console.log('siema')
        <Track isActive={props.changeActive} isActiveId={props.changeActiveId} state={props.activeTrack === item.uri?1:0} key={index} id={index} name={item.track_name} artist={item.artist} time={item.time} album={item.album_name} uri={item.uri} track_id={item.key} image={item.image}/>
        
      ))}
      
    </div>
  )
}

export default Favs