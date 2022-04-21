import React from 'react'
import {Link} from 'react-router-dom'
import logo from '../../assets/logo-icon.svg'
import logo_text from '../../assets/logo-black-text.svg'
import {RiHome6Line,RiHeart2Line,RiMenuFoldLine} from 'react-icons/ri'
import {HiOutlineTrendingUp, HiOutlineTicket} from 'react-icons/hi'
import {FiCompass} from 'react-icons/fi'
import {BiNews} from 'react-icons/bi'
import {MdOutlineDateRange, MdOutlineSupervisorAccount,MdKeyboardArrowRight} from 'react-icons/md'
import { IconContext } from "react-icons";
import './sidebar.css'
const menuToggle = () =>{
    const sidebar= document.querySelector('.sidebar')
    sidebar.classList.toggle('closed')

}
const Sidebar = (props) => {
  return (
    <div className="sidebar">
        <div className="sidebar__first-part">
         <div className="sidebar__header">
            <div className="sidebar__logo">
            <img src={logo}></img>
            <img src={logo_text}></img>
            </div>
            <MdKeyboardArrowRight size='30' id="menu-toggle2"  onClick={menuToggle}/>
            
        </div>   

        <IconContext.Provider value={{ size: 25 }}>
        <div className="sidebar__main-list">
        
            <ul className="sidebar__ul">
               <Link to="/"><li><span> <RiHome6Line/> <p>Home</p></span> </li></Link>
               <Link to="/trends"><li> <span> <HiOutlineTrendingUp/><p>Trends</p></span></li></Link>
                <li><span> <FiCompass/> <p>Feed</p></span></li>
            </ul>
        </div>
        <div className="sidebar__main-list">
            <p>Discover</p>
            <ul className="sidebar__ul">
                <li><span> <BiNews/> <p>New and Notable</p></span></li>
                <li><span> <MdOutlineDateRange/><p>Calendar</p></span></li>
                <li><span> <HiOutlineTicket/><p>Events</p></span></li>
            </ul>
        </div>
        <div className="sidebar__main-list">
            <p>Your Collection</p>
            <ul className="sidebar__ul">
                <Link to="/favorites"><li><span><RiHeart2Line/> <p>Favorite Songs</p></span></li></Link>
                <li><span><MdOutlineSupervisorAccount/> <p>Artists</p></span></li>

            </ul>
        </div>
        </IconContext.Provider>
        </div>
        <div className="sidebar__second-part">
        <hr/>
        <div className="sidebar__profile">
            <div className="sidebar__profile-content">
            <img src={props.profilePic}/>
            <p>{props.name}</p>
            </div>
            <MdKeyboardArrowRight size='30' id="profile_swipe"/>
        </div>
        </div>
    </div>
  )
}

export default Sidebar