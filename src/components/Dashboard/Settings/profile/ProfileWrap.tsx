import React from 'react'
import UserSidebar from '../common/UserSidebar'
import UserDetailsContainer from '../detailsChange/UserDetailsContainer'

const ProfileWrap = () => {
  return (
    <div className='flex gap-10  '>
        <UserSidebar />
        <UserDetailsContainer />

    </div>
  )
}

export default ProfileWrap