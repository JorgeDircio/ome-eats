import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect} from 'react';
import { StyleSheet } from 'react-native';
import UnauthenticatedRoutes from './src/Router/UnauthenticatedRoutes';
import { closeSession } from './src/Utils/Acciones';
import Loading from './src/Components/Loading';
import SwitchNavigator from './src/Router/SwitchNavigator';
import { validateSession } from './src/Utils/Acciones';
import { decode, encode } from 'base-64'
import { LogBox } from 'react-native';


if(!global.btoa){
  global.btoa = encode;

}
if(!global.atob){
  global.atob = decode;

}

LogBox.ignoreLogs(['Setting a timer', 'It appears', 'expo-permissions', 'Failed prop type'])

export default function App() {

  const [user, setuser] = useState(false);
  const [loading, setloading] = useState(false)
  useEffect(() => {
    setloading(true);
    validateSession(setuser);
    setloading(false);
  }, [])

  if(loading){
    return <Loading isVisible={loading} text="Cargando..."></Loading>
  }
  return user ? <SwitchNavigator></SwitchNavigator> : <UnauthenticatedRoutes></UnauthenticatedRoutes>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
