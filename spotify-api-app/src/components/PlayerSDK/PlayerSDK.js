import React from 'react'
import './playersdk.css'
import {useState,useEffect,useRef} from 'react'
import axios from 'axios'
import {BsPauseFill,BsFillSkipBackwardFill} from 'react-icons/bs'
import {RiHeart2Line} from 'react-icons/ri'
import {TiArrowRepeat,TiArrowShuffle} from 'react-icons/ti'
import {BiVolumeFull} from 'react-icons/bi'
import {MdOutlineOpenInFull} from 'react-icons/md'
import {VscDebugStart} from 'react-icons/vsc'
const PlayerSDK = (props) => {
    let myInterval = 0
    // const [player, setPlayer] = useState(undefined);
    // const [deviceID, setDeviceID] = useState(undefined);
    const player = props.player
    const deviceID = props.device_id
    const [isPaused,setIsPaused] = useState(true);
    let position = 0
    let isDragging = false
    const progressBar = document.querySelector('.progress_bar')
    const accessToken = props.token

    function myStopFunction() {
        clearInterval(myInterval);
      }
    useEffect(() =>{
        if(!player) return
        player.addListener('player_state_changed',(e) => {
        setIsPaused(e.paused)
    })
    
    },[player])
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
        axios.post('http://localhost:3001/play',{uri: props.uri, device_id:deviceID, accessToken:accessToken})
    },[props.uri])
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
    const refHead = useRef()
    const refBody = useRef()
    const refBar = useRef()
    let barLength = 1,
    animationID = 0
    let padding = 0
    let startPosition = 0,
    currentPosition = 0,
    endPosition=0
   
    let progressBar2 = document.querySelector('.progress_bar')
    let rect = {left: 0}
    const getPosition = (e) => {
        var offsetX = e.clientX - rect.left
    
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
    useEffect(() => {
        if(!refBody.current || !refHead.current || !player) return
        refHead.current.addEventListener('mousedown',touchStart)
        refBody.current.addEventListener('mouseup',touchEnd)
        refBody.current.addEventListener('mousemove',touchMove)
    },[refHead,refBody,player])
    
    // refBody.current.addEventListener('mousemove',touchMove)
    // playerCont.addEventListener('mouseleave',touchEnd)
    const addToFav = () =>{
        axios.post('http://localhost:3001/add',{accessToken: accessToken, id: props.id})
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
            <TiArrowRepeat size='18' className="scale_on" style={{color:'var(--font-gray)'}}/>
            <BsFillSkipBackwardFill className="next_btn scale_on" size='20'/>
            <button type="button" className="stop_btn scale_on" onClick={isPaused ? resumeTrack :stopTrack }> {isPaused? <VscDebugStart size='25'/> :<BsPauseFill size='25'/> }</button>
            <div id='rotate_icon'><BsFillSkipBackwardFill size='20' className="next_btn scale_on"/> </div>
            <TiArrowShuffle size ='18' className="scale_on" style={{color:'var(--font-gray)'}}/>
            </div>
            <div className="player__buttons-volume">
            <BiVolumeFull size='20' style={{color:'var(--font-gray)'}}/>
            <BiVolumeFull size='20' style={{color:'var(--font-gray)'}}/>
            </div>
        </div>
        
            <div className="whole_bar" 
            >
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