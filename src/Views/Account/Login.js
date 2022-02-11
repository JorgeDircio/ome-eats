import React, { useRef } from 'react';
import { View, Text, StyleSheet, Image, StatusBar } from 'react-native';
import LoginForm from '../../Components/LoginForm';
import Toast from 'react-native-easy-toast';

export default function Login() {

  const toastRef = useRef();
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor='#128C73' />
      <Image
        source={require("../../../assets/logo.png")}
        style={styles.imgLogo}
      />
      <Text style={styles.textBanner}>¡Bienvenido! A</Text>
      <Text style={styles.txttitle}>Merx Ome</Text>
      <LoginForm toastRef={toastRef} />
      <Toast ref={toastRef} position='center' opacity={0.9} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#128C73'
  },
  imgLogo: {
    width: 200,
    height: 120,
    marginTop: 40,
    alignSelf: 'center'

  },
  textBanner:{
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 30,
    alignSelf: 'center'
  },
  txttitle:{
    fontFamily: 'Roboto',
    fontWeight: 'bold',
    color: '#fff',
    fontSize: 45,
    alignSelf: 'center'
  }
})