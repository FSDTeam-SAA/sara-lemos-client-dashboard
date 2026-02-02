import React from 'react'
import UserSidebar from '../common/UserSidebar'
import ChangePasswordContainer from './ChangePasswordContainer'

const PasswordChangeWrap = () => {
  return (
       <div className='flex gap-10  '>
        <UserSidebar />
        <ChangePasswordContainer />

    </div>
  )
}

export default PasswordChangeWrap