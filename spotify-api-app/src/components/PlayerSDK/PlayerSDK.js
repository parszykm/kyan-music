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
    // console.log(player)

    // progressBar.addEventListener(click, (e) => {console.log(e)})
    function myStopFunction() {
        clearInterval(myInterval);
      }
    useEffect(() =>{
        if(!player) return
        player.addListener('player_state_changed',(e) => {
        setIsPaused(e.paused)
    })
    },[player])
    const seekToPosition = (e) => {
        if(!player) return
        // console.log('posiiton',e.target.offsetWidth)
        player.getCurrentState().then(state => {
            if (!state) {
            console.error('User is not playing music through the Web Playback SDK');
            return;
            }
            const barLength=document.querySelector('.whole_bar').offsetWidth
            // console.log('percents ',e,e.nativeEvent.offsetX, e.target.offsetWidth, e.clientX/e.target.offsetWidth*state.duration)
            player.seek(e.nativeEvent.offsetX/barLength*state.duration) 
            setIsPaused(true) 
            
            
        })
        

    }
    useEffect(() => {
        // console.log(player,isPaused)
        if(!player || player == null) return
        if(isPaused) {
        myStopFunction()
        // console.log('interval stopped')
        return
        }
        
        myInterval = setInterval(() =>{
        player.getCurrentState().then(state => {
            if (!state) {
            console.error('User is not playing music through the Web Playback SDK');
            return;
            }
            // console.log(state.position)
            
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
        // console.log(props.uri, 'URI CHANGED xddd')
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
    
    let startPosition = 0,
    currentPosition = 0,
    endPosition=0
    let progressBar2 = document.querySelector('.progress_bar')
    console.log(refHead.current)
    console.log(refBody.current)
    const getPosition = (e) => {
        // console.log(e)
        var rect = e.currentTarget.getBoundingClientRect(),
        offsetX = e.clientX - rect.left
        return offsetX
    }
    const touchStart =  (e) =>{
        barLength = document.querySelector('.whole_bar').offsetWidth
        progressBar2 = document.querySelector('.progress_bar')
        isDragging = true
        startPosition =  getPosition(e)
        console.log('start position ',startPosition)
        animationID = requestAnimationFrame(animation)
    }
    const touchMove = (e) =>{
        if(!isDragging) return
        currentPosition =  getPosition(e)
        // console.log(currentPosition)
        // progressBar.style= `width: ${currentPosition/barLength*100}%`
    }
    const touchEnd = (e) =>{
        if(!isDragging) return
        isDragging = false
        cancelAnimationFrame(animationID)
        endPosition = getPosition(e)
        console.log('end ',endPosition)
        player.getCurrentState().then(state => {
                    if (!state) {
                    console.error('User is not playing music through the Web Playback SDK');
                    return;
                    }
                    player.seek(endPosition/barLength*state.duration) 
                    setIsPaused(true) 
                    
                    
                })
    }
    function animation() {
        changeWidth()
        if (isDragging) requestAnimationFrame(animation)
      }
    function changeWidth() {
        progressBar2.style= `width: ${currentPosition/barLength*100}%`
    }
    useEffect(() => {
        if(!refBody.current || !refHead.current || !player) return
        refHead.current.addEventListener('mousedown',touchStart)
        refBody.current.addEventListener('mouseup',touchEnd)
        refBody.current.addEventListener('mousemove',touchMove)
    },[refHead,refBody,player])
    
    // refBody.current.addEventListener('mousemove',touchMove)
    // playerCont.addEventListener('mouseleave',touchEnd)

  return (
    <>
        <div className="player" ref={refBody} >

        {/* <button type="button" className="stop_btn" onClick={stopTrack}>Stop</button>
        <button type="button" className="stop_btn" onClick={resumeTrack}>Resume</button> */}
        <div className="player__buttons">
            <div className="player__buttons-actions">
                <div className="player__buttons-actions-btn">
                    <MdOutlineOpenInFull size='20' style={{color:'var(--font-gray)'}}/>
                </div>
                <div className="player__buttons-actions-btn">
                    <RiHeart2Line size='20' style={{color:'var(--font-gray)'}}/>
                </div>

            </div>
            <div className="player__buttons-main">
            <TiArrowRepeat size='18' style={{color:'var(--font-gray)'}}/>
            <BsFillSkipBackwardFill size='20'/>
            <button type="button" className="stop_btn" onClick={isPaused ? resumeTrack :stopTrack }> {isPaused? <VscDebugStart size='25'/> :<BsPauseFill size='25'/> }</button>
            <div id='rotate_icon'><BsFillSkipBackwardFill size='20'/> </div>
            <TiArrowShuffle size ='18' style={{color:'var(--font-gray)'}}/>
            </div>
            <div className="player__buttons-volume">
            <BiVolumeFull size='20' style={{color:'var(--font-gray)'}}/>
            <BiVolumeFull size='20' style={{color:'var(--font-gray)'}}/>
            </div>
        </div>
        
            <div className="whole_bar" onClick={seekToPosition}>
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