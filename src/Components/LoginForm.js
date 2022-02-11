import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import { Icon, Input, Button, Divider } from 'react-native-elements';
import { validateEmail } from '../Utils/Utils';
import { isEmpty } from 'lodash';
//import { validateSession, closeSession } from '../Utils/Acciones'
import * as firebase from 'firebase';
import Loading from './Loading';

export default function LoginForm(props) {

  const { toastRef } = props;
  const [show, setshow] = useState(true)
  const [email, setEmail] = useState("");
  const [loading, setloading] = useState(false)
  const [password, setPassword] = useState("")
  const navigation = useNavigation();



  const initSession = () => {
    if (isEmpty(email) || isEmpty(password)) {
      toastRef.current.show("Debe ingresar los valores de Email y Password");
    } else if (!validateEmail(email)) {
      toastRef.current.show("Ingrese un correo válido");
    } else {
      setloading(true);
      firebase.auth().signInWithEmailAndPassword(email, password)
        .then(function (response) {
          setloading(false);
          toastRef.current.show("Ha iniciado sesion exitosamente");
          console.log(firebase.auth().currentUser);
        })
        .catch(function (error) {
          setloading(false);
          toastRef.current.show("correo o contraseña incorrecta");
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
          name: show ? 'eye-outline':'eye-off-outline',
          color: '#128C7E',
          onPress: () => { setshow(!show) }
        }}
        onChangeText={(text) => {
          setPassword(text);
        }}
        secureTextEntry={show}
        value={password}
      />
      <Button title='ENTRAR'
        containerStyle={styles.btnEntrar}
        buttonStyle={{
          backgroundColor: '#25D366'
        }}
        onPress={() => {
          initSession();
        }}
      />
      <Text style={styles.txtCrearCuenta}>¿No tienes cuenta?
        <Text style={styles.cuenta}
          onPress={() => {
            navigation.navigate('register');
          }}
        > Crea una</Text>
      </Text>
      <Divider style={{
        backgroundColor: '#128C7E',
        height: 1,
        width: '90%',
        marginTop: 20
      }} />
      <Text style={styles.txtO}>O</Text>
      <View style={styles.btnLogin}>
        <TouchableOpacity style={styles.btnLoginSocial} >
          <Icon
            name='google'
            type='material-community'
            size={24}
            color='#fff'
            backgroundColor='transparent'
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnLoginSocial}>
          <Icon
            name='facebook'
            type='material-community'
            size={24}
            color='#fff'
            backgroundColor='transparent'
          />
        </TouchableOpacity>
      </View>
      <Loading isVisible={loading} text="Por favor espere"></Loading>
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
  txtCrearCuenta: {
    marginTop: 20
  },
  cuenta: {
    fontFamily: 'Roboto',
    color: '#128C7E',
    fontSize: 15
  },
  txtO: {
    marginTop: 20,
    color: '#128C7E',
    fontWeight: 'bold',
    fontSize: 20
  },
  btnLogin: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: "100%"
  },
  btnLoginSocial: {
    backgroundColor: '#25D366',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 10
  }
})
