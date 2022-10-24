import React, {useContext} from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import Context from './Context'
const ProtectedRoute = () => {
    let {user} = useContext(Context)
    let location = useLocation()
  return (
    user?<Outlet/>:<Navigate to={'/login' } state={location.pathname} replace/>
  )
}

export default ProtectedRoute

export const LoginRestrict = () => {
  let {user} = useContext(Context)
return (
  (!user)?<Outlet/>:<Navigate to={'/'}/>
)
}

export const AdminRestrict = () => {
  let {user} = useContext(Context)
  
  return (
    (user.is_admin)?<Outlet/>:<Navigate to={'/'}/>
  )
}