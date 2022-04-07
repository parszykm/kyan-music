import React from 'react'
import background from '../../assets/background-main.svg'
import logo from '../../assets/logo-icon.svg'
import logo_text from '../../assets/logo-white-text.svg'
import section_image from '../../assets/undraw_accept_terms_re_lj38.svg'
import './logger.css'
const querystring=require('query-string')
const AUTH_URL = 'https://accounts.spotify.com/authorize?'+querystring.stringify({
    response_type: 'code',
    client_id: '0ff987e086444f8daf9092143b0cd142',
    scope: 'streaming user-read-email user-read-private user-library-read user-library-modify user-read-playback-state user-modify-playback-state',
    redirect_uri: 'http://localhost:3000'
})
const Logger = () => {
  return (
    <div className="logger section-padding">
        {/* <img src={background} className="background-vector"></img> */}
        <div className="logger-logo">
            <img src={logo}></img>
            <img src={logo_text}></img>
        </div>
        <div className="logger-container ">
            <div className="logger-container-slogan">
                <h1>
                    Let music  gets <br/>into Your life
                </h1>
                <div className="logger-container-slogan-btn scale-up-center">

                    <a href={AUTH_URL}>
                        <p>Get Started</p>
                    </a>
                </div>
            </div>
            <div className="logger-container-img">
                
                <img src={section_image}></img>
            </div>
        </div>
    </div>
  )
}

export default Logger