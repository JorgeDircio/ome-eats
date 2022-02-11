import React, {useState, useEffect} from 'react'
import AuthenticatedRoutes from './AuthenticatedRoutes';
import AccountStack from './AccountStack';
import Loading from '../Components/Loading';
import {validatePhone} from '../Utils/Acciones'

export default function SwitchNavigator() {

  const [phoneAuth, setphoneAuth] = useState(false)
  const [loading, setloading] = useState(true)

  useEffect(()=>{
    validatePhone(setphoneAuth);
    setTimeout(() => {
      setloading(false);
    }, 5000);
  },[]);

    if(loading){
      return <Loading isVisible={loading} text="Cargando configuracion..."></Loading>
    }else{
      return phoneAuth ? <AuthenticatedRoutes></AuthenticatedRoutes> : <AccountStack></AccountStack>
    }
    
}
