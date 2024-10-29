import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import secureLocalStorage from 'react-secure-storage';

function CreatorRoute() {
    const mode = secureLocalStorage.getItem('CreatorMode');
    return(
        mode ? <Outlet/> : <Navigate to="/profile"/>
    )
}

export default CreatorRoute