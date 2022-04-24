import React from 'react'
import './aside.css'
const Aside = (props) => {
  return (
    <div className='aside'>
        <div className='aside__player-info'>
            <img src={props.image}/>
            <p className='aside__player-info_name'>{props.name}</p>
            <p className='aside__player-info_artist'>{props.artist}</p>
        </div>
    </div>
  )
}

export default Aside