import React from 'react'
import './playersdk.css'
import {useState,useEffect} from 'react'
import axios from 'axios'
const PlayerSDK = (props) => {
    useEffect(() => {
        if(!props.token) return
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        document.body.appendChild(script);
    
        window.onSpotifyWebPlaybackSDKReady = () => {
    
            const player = new window.Spotify.Player({
                name: 'Kyan Music',
                getOAuthToken: cb => { cb(props.token); },
                volume: 0.5
            });
    
            setPlayer(player);
            
            player.addListener('ready', ({ device_id }) => {
                console.log('Ready with Device ID', device_id);
                setDeviceID(device_id);
            });
    
            player.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID has gone offline', device_id);
            });
    
    
            player.connect();
    
        };
    }, [props.token]);


    const [player, setPlayer] = useState(undefined);
    const [deviceID, setDeviceID] = useState(undefined);
    useEffect(() => {
        axios.post('http://localhost:3001/play',{uri: props.uri, device_id:deviceID, accessToken:props.token})
    },[props.uri])
  return (
    <>
        {/* <div className="container">
            <div className="main-wrapper">
                <img src={current_track.album.images[0].url} 
                     className="now-playing__cover" alt="" />

                <div className="now-playing__side">
                    <div className="now-playing__name">{
                                  current_track.name
                                  }</div>

                    <div className="now-playing__artist">{
                                  current_track.artists[0].name
                                  }</div>
                </div>
            </div>
        </div> */}
        <div>PLayerSDK</div>
     </>
  )
}

export default PlayerSDK