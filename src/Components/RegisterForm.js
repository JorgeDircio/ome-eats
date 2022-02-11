import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Icon, Input, Button } from 'react-native-elements';
import { validateEmail } from '../Utils/Utils';
import { isEmpty, size } from 'lodash';
import * as firebase from 'firebase';
import Loading from './Loading';


export default function RegisterForm(props) {

  const { toastRef } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [show, setshow] = useState(true)
  const [showRepeat, setshowRepeat] = useState(true)
  const [isVisible, setisVisible] = useState(false)
  const navigation = useNavigation();

  const createAccount = ()=>{
    if(isEmpty(email) || isEmpty(password) || isEmpty(repeatPassword)){
      toastRef.current.show("Ingrese todos los datos");
    }else if(!validateEmail(email)){
      toastRef.current.show("Ingrese un correo valido");
    }else if (password !== repeatPassword){
      toastRef.current.show("Las contraseñas deben de ser iguales");
    }else if(size(password) < 6){
      toastRef.current.show("La contraseña debe de tener minimo 6 caracteres");
    }else{
      setisVisible(true);
      firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(function (response) {
            toastRef.current.show("Se ha creado correactamente el usuario");
            setisVisible(false);                  
          })
          .catch(function (error) {
            setisVisible(false);
            toastRef.current.show("Ha ocurrido un error o el correo ya ha sido registrado");      
          });
    }
  }

  return (
    <View style={styles.container}>
      <View style={{
        borderBottomColor: '#25D366',
        width: 100,
        borderBottomWidth: 2
      }} />
      <Input placeholder='Correo'
        containerStyle={styles.input}
        rightIcon={{
          type: 'material-community',
          name: 'at',
          color: '#128C7E',

        }}
        leftIcon={{
          type: 'material-community',
          name: 'account-circle-outline',
          color: '#128C7E'
        }}
        onChangeText={(text) => {
          setEmail(text);
        }}
      />
      <Input placeholder='Contraseña'
        containerStyle={styles.input}
        leftIcon={{
          type: 'material-community',
          name: 'security',
          color: '#128C7E'
        }}
        rightIcon={{
          type: 'material-community',
          name: show ?'eye-outline': 'eye-off-outline',
          color: '#128C7E',
          onPress: () => { setshow(!show) }
        }}
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry={show}
        value={password}
      />
      <Input placeholder='Repetir contraseña'
        containerStyle={styles.input}
        leftIcon={{
          type: 'material-community',
          name: 'security',
          color: '#128C7E'
        }}
        rightIcon={{
          type: 'material-community',
          name: showRepeat ? 'eye-outline' : 'eye-off-outline',
          color: '#128C7E',
          onPress: () => { setshowRepeat(!showRepeat) }
        }}
        onChangeText={(text) => {
          setRepeatPassword(text);
        }}
        secureTextEntry={showRepeat}
        value={repeatPassword}
      />
      <Button title='CREAR CUENTA'
        containerStyle={styles.btnEntrar}
        buttonStyle={{
          backgroundColor: '#25D366'
        }}
        onPress={() => {
          createAccount();
        }}
      />
      <Button title='INICIAR SESION'
        containerStyle={styles.btnEntrar}
        buttonStyle={{
          backgroundColor: '#128C7E'
        }}
        onPress={() => {
          navigation.goBack();
        }}
      />
      <Loading isVisible={isVisible} text="Por favor espere"></Loading>
    </View>
  )
}

const styles = StyleSheet.create({

  container: {
    backgroundColor: '#F5F6F8',
    flex: 1,
    marginTop: 20,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    alignItems: 'center',
    paddingTop: 20
  },
  input: {
    width: "90%",
    height: 50,
    marginTop: 20
  },
  btnEntrar: {
    width: "90%",
    marginTop: 20
  },
})
