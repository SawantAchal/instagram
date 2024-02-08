import React from 'react'
import Home from './Home'
import Notification from './Notification'
import CreatePost from './CreatePost'
import ProfileLink from './ProfileLink'
import Search from './Search'

const SidebarItems = () => {
  return (
    <>
        <Home/>
        <Search/>
        <Notification />
        <CreatePost/>
        <ProfileLink/>
    </>
  )
}

export default SidebarItems