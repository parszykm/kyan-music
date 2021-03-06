import React from 'react'
import './playersdk.css'
import {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {BsPauseFill,BsFillSkipBackwardFill} from 'react-icons/bs'
import {RiHeart2Line} from 'react-icons/ri'
import {TiArrowRepeat,TiArrowShuffle} from 'react-icons/ti'
import {BiVolumeFull,BiVolumeLow} from 'react-icons/bi'
import {MdOutlineOpenInFull} from 'react-icons/md'
import {VscDebugStart} from 'react-icons/vsc'
const PlayerSDK = (props) => {
    let myInterval = 0
    // console.log('PLAYER TRACKS', props.tracks)
    // const [player, setPlayer] = useState(undefined);
    // const [deviceID, setDeviceID] = useState(undefined);
    // const [tracks, setTracks] = useState(props.tracks);
    const tracks = useRef(props.tracks)
    // const tracks = props.tracks
    // useEffect(() => {setXtracks(props.tracks);},[])
    // const tracks = props.tracks
    const player = props.player
    const deviceID = props.device_id
    const [isPaused,setIsPaused] = useState(true);
    let position = 0
    let isDragging = false,
    isDraggingVolume = false
    const progressBar = document.querySelector('.progress_bar')
    const accessToken = props.token

    function myStopFunction() {
        clearInterval(myInterval);
      }
    async function LookForActive(current_track){
        // var tracks=props.tracks
        // console.log('TRACKS W FUN',tracks.current)
                if(tracks.current != 0)
                {
                    
                    // var temp_track = await tracks.current.find(track => track.uri == current_track.uri)
                    var temp_track = await tracks.current.find((track) => (track.track_name == current_track.name && track.album_name == current_track.album.name))
                    if (temp_track == null) {console.log('TO JEST TEN ERROR?', tracks.current, current_track, temp_track) 
                    return}
                    // console.log(temp_track, props.uri, props.tracks)
                    if (temp_track.trac_name != props.name){
                
                    props.changeActive(temp_track)
                    }
                }
                else{
                    console.log('cos innego')
                }

    }
    // useEffect(() => {console.log('new tracks')
    //     setTracks(props.tracks)},[props.tracks])
    useEffect(() => {tracks.current = props.tracks},[props.tracks])
    useEffect(() =>{
        if(!player) return
        player.addListener('player_state_changed', ({
            paused,
          }) => {
              setIsPaused(paused)
          }
          );
    
    },[player])
    useEffect(() =>{
        if (!player) return
        // console.log('TRACKS CHange', tracks.current)
        player.addListener('player_state_changed', ({

            track_window: { current_track },
          }) => {
            //   console.log('TRACKS W EVENCIE', tracks.current)
              LookForActive(current_track)
          }
          );

    },[tracks.current])
    useEffect(() => {

        if(!player || player == null) return
        if(isPaused) {
        myStopFunction()
 
        return
        }
        
        myInterval = setInterval(() =>{
        player.getCurrentState().then(state => {
            if (!state) {
            console.error('User is not playing music through the Web Playback SDK');
            return;
            }
          
            
            if(!isDragging)
            {
                position = state.position   
                const positionPercentage = position/state.duration*100
                progressBar.style.width = `${positionPercentage}%`
            }
           
            
        
            
        })
        },300)
    
    },[isPaused])
    

    useEffect(() => {
        axios.post('http://localhost:3001/play',{uri: props.tracksUris, activeOffset: props.activeOffset, device_id:deviceID, accessToken:accessToken}).then(() => {
            player.getVolume().then(volume => {
                let volume_percentage = volume * 100;
                console.log(`The volume of the player is ${volume_percentage}%`);
                refVolumeBar.current.style.width= `${volume_percentage}%`
    
              })
        })
    },[props.uri])
    const [activeOffset,setActiveOffset] = useState(props.activeOffset)
    
    const stopTrack = () =>{
        player.pause().then(() => {
            console.log('Paused!');
        });
        clearInterval(myInterval)
    }
    const resumeTrack = () =>{
        player.resume().then(() => {
            console.log('Resumed!');
          });
    }
    const nextSong = () =>{
        console.log('NEXT event fired', activeOffset, props.tracks[activeOffset +1])
        player.nextTrack().then(() => {
            //props.nextSong()
            console.log('Skipped to next track!');
          });

    }
    const previousSong = () =>{ 	
        player.previousTrack().then(() => {
            //props.prevSong();
            console.log('Set to previous track!');
        });
    }
    const [shuffleActive, setShuffleActive] = useState(false)
    const ShuffleOn = () =>{
        console.log('Set to shuffle track!')
        player.getCurrentState().then(state => {
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
              return;
            }
            console.log('Shuffle', state.shuffle);
          });
        axios.post('http://localhost:3001/shuffle',{accessToken: accessToken, state: true, device: deviceID }).then(()=>{
            console.log('Shuffle turned on')
            setShuffleActive(true)
            player.getCurrentState().then(state => {
                if (!state) {
                  console.error('User is not playing music through the Web Playback SDK');
                  return;
                }
              
                var current_track = state.track_window.current_track;
                var next_track = state.track_window.next_tracks[0];
              
                console.log('Currently Playing', current_track);
                console.log('Playing Next', next_track);
                console.log('Shuffle', state.shuffle);
              });
        })
    }
    const ShuffleOff = () =>{
        axios.post('http://localhost:3001/shuffle',{accessToken: accessToken, state: false, device: deviceID }).then(()=>{
            console.log('Shuffle turned off')
            setShuffleActive(false)
            player.getCurrentState().then(state => {
                if (!state) {
                  console.error('User is not playing music through the Web Playback SDK');
                  return;
                }
              
                var current_track = state.track_window.current_track;
                var next_track = state.track_window.next_tracks[0];
              
                console.log('Currently Playing', current_track);
                console.log('Playing Next', next_track);
                console.log('Shuffle', state.shuffle);
              });
        })
    } 
    const refHead = useRef()
    const refBody = useRef()
    const refBar = useRef()
    const refVolumeBody = useRef()
    const refVolumeHead = useRef()
    const refVolumeBar = useRef()
    let barLength = 1, barLengthVolume = 1,
    animationID = 0, animationIDVolume = 0
    let padding = 0
    let startPosition = 0,
    currentPosition = 0,
    endPosition=0, currentPositionVolume =0
   
    let progressBar2 = document.querySelector('.progress_bar')
    let rect = {left: 0}, rectVolume = {left:0}
    const getPosition = (e) => {
        var offsetX = e.clientX - rect.left
    
        return offsetX
    }
    const getPositionVolume = (e) => {
        var offsetX = e.clientX - rectVolume.left
        return offsetX
    }

    const touchStart =  (e) =>{
        barLength = document.querySelector('.whole_bar').offsetWidth
        progressBar2 = document.querySelector('.progress_bar')
        rect = document.querySelector('.whole_bar').getBoundingClientRect()
        isDragging = true
        progressBar2.style= 'height: 5px; transform: translateY(-50%);';
        refHead.current.style= 'width: 10px; height: 10px; transform: translateY(-50%);'
        refBody.current.classList.toggle('grabbing');
        refHead.current.classList.toggle('grabbing');
      
        startPosition =  getPosition(e)
        animationID = requestAnimationFrame(animation)
    }
    const touchMove = (e) =>{
        if(!isDragging) return
        currentPosition =  getPosition(e)
    }
    const touchEnd = (e) =>{
        if(!isDragging) return
        progressBar2.style= 'height: 3px;';
        refHead.current.style= 'width: 8px; height: 8px;'
        refBody.current.classList.toggle('grabbing');
        refHead.current.classList.toggle('grabbing');
        cancelAnimationFrame(animationID)
        endPosition = currentPosition
       
        player.getCurrentState().then(state => {
                    if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                    }
                   
                    player.seek(currentPosition/barLength*state.duration) 
                    // progressBar2.style.width= `${currentPosition/barLength*100}%`
                    setIsPaused(true) 
                    
                    
                })
        isDragging = false
    }
    function animation() {
        changeWidth()
        if (isDragging) requestAnimationFrame(animation)
      }
    function changeWidth() {
        progressBar2.style.width= `${(currentPosition)/barLength*100}%`
    }

    
    const touchStartVolume =  (e) =>{
        barLengthVolume = document.querySelector('.volume-whole_bar').offsetWidth
        rectVolume = document.querySelector('.volume-whole_bar').getBoundingClientRect()
        isDraggingVolume = true
        refVolumeBar.current.style= 'height: 5px;';
        refVolumeHead.current.style= 'width: 10px; height: 10px;'
        refVolumeBody.current.classList.toggle('grabbing');
        refVolumeHead.current.classList.toggle('grabbing');
        animationIDVolume = requestAnimationFrame(animationVolume)
    }
    const touchMoveVolume = (e) =>{
        if(!isDraggingVolume) return
        currentPositionVolume =  getPositionVolume(e)
    }
    const touchEndVolume = (e) =>{
        if(!isDraggingVolume) return
        isDraggingVolume = false
        refVolumeBar.current.style= 'height: 3px;';
        refVolumeHead.current.style= 'width: 8px; height: 8px;'
        refVolumeBody.current.classList.toggle('grabbing');
        refVolumeHead.current.classList.toggle('grabbing');
        console.log('event fired', isDraggingVolume)
        cancelAnimationFrame(animationIDVolume)
        console.log(Math.min(1,Math.max(0,(currentPositionVolume)/barLengthVolume)))
        player.setVolume(Math.min(0.999,Math.max(0.1,(currentPositionVolume)/barLengthVolume)))
    }
    function animationVolume() {
        changeWidthVolume()
        if (isDraggingVolume) {
           requestAnimationFrame(animationVolume)
        }
      }
    function changeWidthVolume() {
        refVolumeBar.current.style.width= `${(currentPositionVolume)/barLengthVolume*100}%`
    }
    useEffect(() => {
        if(!refBody.current || !refHead.current || !player) return
        refHead.current.addEventListener('mousedown',touchStart)
        refBody.current.addEventListener('mouseup',touchEnd)
        refBody.current.addEventListener('mousemove',touchMove)
        refBody.current.addEventListener('mouseleave',touchEnd)
        refBody.current.addEventListener('dragstart',(e) => {
            e.preventDefault()
        })
    },[refHead,refBody,player])
    useEffect(() => {
        if(!refVolumeBody.current || !refVolumeHead.current || !player) return
        refVolumeHead.current.addEventListener('mousedown',touchStartVolume)
        refVolumeBody.current.addEventListener('mouseup',touchEndVolume)
        refVolumeBody.current.addEventListener('mousemove',touchMoveVolume)
        refVolumeBody.current.addEventListener('mouseleave',touchEndVolume)
        refVolumeBody.current.addEventListener('dragstart',(e) => {
            e.preventDefault()
        })
        
    },[ refVolumeBody, refVolumeHead,player])
    // refBody.current.addEventListener('mousemove',touchMove)
    // playerCont.addEventListener('mouseleave',touchEnd)
    const addToFav = () =>{
        
        player.getCurrentState().then(state => {
            if (!state) {
              console.error('User is not playing music through the Web Playback SDK');
              return;
            }  
            var current_track = state.track_window.current_track;
            console.log(current_track.id)
            axios.post('http://localhost:3001/add',{accessToken: accessToken, id: current_track.id})
          });

    }
  
  return (
    <>
        <div className="player" ref={refBody} >

        {/* <button type="button" className="stop_btn" onClick={stopTrack}>Stop</button>
        <button type="button" className="stop_btn" onClick={resumeTrack}>Resume</button> */}
        <div className="player__buttons">
            <div className="player__buttons-actions">
                <div className="player__buttons-actions-btn">
                    <MdOutlineOpenInFull size='20' className="scale_on" style={{color:'var(--font-gray)'}}/>
                </div>
                <div className="player__buttons-actions-btn">
                    <RiHeart2Line size='20' className="scale_on" style={{color:'var(--font-gray)'}} onClick={addToFav}/>
                </div>

            </div>
            <div className="player__buttons-main">
            <TiArrowRepeat size={!shuffleActive ? '22':'18'} className="scale_on" onClick={ShuffleOff} style={{color: shuffleActive ? 'var(--font-gray)':'var(--purple-color)'}}/>
            <BsFillSkipBackwardFill className="next_btn scale_on" size='20' onClick ={previousSong}/>
            <button type="button" className="stop_btn scale_on" onClick={isPaused ? resumeTrack :stopTrack }> {isPaused? <VscDebugStart size='25'/> :<BsPauseFill size='25'/> }</button>
            <div id='rotate_icon'><BsFillSkipBackwardFill size='20' className="next_btn scale_on" onClick={nextSong}/> </div>
            <TiArrowShuffle size = {shuffleActive ? '22':'18'} className="scale_on" onClick = {ShuffleOn} style={{color: !shuffleActive ? 'var(--font-gray)':'var(--purple-color)'}}/>
            </div>
            <div className="player__buttons-volume" ref={refVolumeBody}>
            <BiVolumeLow size='20' style={{color:'var(--font-gray)'}}/>
            <div className="volume-whole_bar" >
            <div className="volume_bar" ref ={ refVolumeBar}>
                <div className="volume_bar-head" ref={ refVolumeHead}/>
                </div>
            </div>
            <BiVolumeFull size='20' style={{color:'var(--font-gray)'}}/>
            </div>
        </div>
        
            <div className="whole_bar">
            <div className="progress_bar" ref ={refBar}>
                <div className="progress_bar-head" ref={refHead}/>
                </div>
            </div>
               
        {/* <div className="player__bar" ref={refBody}/> */}
        </div>
        
     </>
  )
}

export default PlayerSDK