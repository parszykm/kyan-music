import React from 'react'
import './dashboard.css'
import useAuth from '../../useAuth'
import Sidebar from '../Sidebar/Sidebar'
import Aside from '../Aside/Aside'
import {useState,useEffect,useRef} from 'react'
import { BrowserRouter as Router, Route,Routes } from 'react-router-dom'
import Home from '../home/home'
import Trends from '../trends/Trends'
import PlayerSDK from'../../components/PlayerSDK/PlayerSDK'
import Favs from '../../containers/favs/Favs'
import {BiArrowBack,BiSearch} from 'react-icons/bi'
import axios from 'axios'
const Dashboard = ({code}) => {
    const accessToken = useAuth(code)
    const [profilePic,setProfilePic] =useState()
    const [profileName,setProfileName] =useState()
    const [tracks, setTracks] =useState([])
    const [tracksUris, setTracksUris] = useState([])
    // const [favorites, setFavorites] = useState()
    useEffect(() => {
      if(!accessToken) return
      axios.post('http://localhost:3001/profile', {accessToken,})
      .then( data => {
        setProfilePic(data.data.url)
        setProfileName(data.data.name)
        
      }).catch(err => {console.error(err)})
      console.log(profileName)

      
  
    //   axios.post('http://localhost:3001/favorites',{accessToken: accessToken}).then((res) => {
    //   setFavorites(res.data)
    //   console.log('favs init')
    // // console.log(res.data)
    // }) 
    },[accessToken])
  
    console.log('TRACKS',tracks)
    const searchTracks = (e) =>{

      axios.post('http://localhost:3001/search',{accessToken,search_value: e})
      .then(data => {
        setTracks(data.data)
        let uris = JSON.stringify(data.data.map(item => item.uri))
        setTracksUris(uris)
        console.log(data.data)
        console.log("urisy elo",uris)
      })
      .catch(err => console.error(err))

    }
    const [activeTrack, setActiveTrack] = useState({})
    const [activeTrackId, setActiveTrackId] = useState()
      const changeActive = (track) =>{
        setActiveTrack(track)
        
        console.log(track)
      
      }
      let activeOffset = activeTrack.offset
    // const nextSong = () => {
    //   console.log(tracks[activeOffset+1])
    //   setActiveTrack(tracks[activeOffset+1])
    //   activeOffset +=1
      
    // }
    // const prevSong = () => {
    //   console.log(tracks[activeOffset-1])
    //   setActiveTrack(tracks[activeOffset-1])
    //   activeOffset -=1
      
    // }

    const [player, setPlayer] = useState(undefined);
    const [deviceID, setDeviceID] = useState(undefined);
    useEffect(() => {
      if(!accessToken) return
      console.log('ACCESS TOKEN',accessToken)
    
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
  
      window.onSpotifyWebPlaybackSDKReady = () => {
  
          const player = new window.Spotify.Player({
              name: 'Kyan Music',
              getOAuthToken: cb => { cb(accessToken); },
              volume: 0.5
          });
  
          setPlayer(player);
          player.connect();
          player.addListener('ready', ({ device_id }) => {
              console.log('Ready with Device ID', device_id);
              setDeviceID(device_id);
          });
  
          player.addListener('not_ready', ({ device_id }) => {
              console.log('Device ID has gone offline', device_id);
          });
  
      };
  }, [accessToken]);
 
  
    
  return (
  <Router>
    <div className="dashboard">
    <Sidebar profilePic={profilePic} name={profileName}/>
    <div className="dashboard__content">
      <div className="dashboard__content-input">
        <div className="dashboard__content-input-arrows">
          <BiArrowBack size='22'/>
          <BiArrowBack size ='22' style={{transform: 'rotate(180deg)'}}/>
        </div>
        
        <div className="dashboard__content-input-search_bar">
          <BiSearch/>
          <input type="search" placeholder="Search for tracks..." onKeyUp={e => (e.key === 'Enter' ? searchTracks(e.target.value) : () => {} )}></input>
        </div>

      </div>
      <div className="dashboard__dynamic-content">
              <Routes>
        <Route path="/" element={<Home tracks={tracks}  accessToken={accessToken} changeActive={changeActive} changeActiveId={setActiveTrackId} activeTrack={activeTrack.uri}/>}></Route>
        <Route path="/trends" element={<Trends/>}></Route>
        <Route path="/favorites" element={<Favs accessToken={accessToken} setUris={setTracksUris} changeActive={changeActive} changeActiveId={setActiveTrackId} activeTrack={activeTrack.uri}/>}></Route>
      </Routes>
      </div>

      <div className="dashboard__content-player">
        <PlayerSDK token={accessToken} 
        // nextSong = {nextSong} prevSong={prevSong} 
        tracksUris={tracksUris} tracks={tracks} changeActive={changeActive} uri={activeTrack.uri} id={activeTrack.id} activeOffset={activeTrack.offset} player={player} device_id={deviceID} />
      </div>
      
      
      
    
    </div>
    {/* <div className="testin">
          <div>{code}<br/></div>
    <div><p>token <br/></p>{accessToken}</div>
    </div> */}
    <Aside artist={activeTrack.artist} name={activeTrack.track_name} image={activeTrack.image}/>
    </div>
    </Router>
  )
}

export default Dashboard
