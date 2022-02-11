import React, { useState, useRef } from 'react'
import { View, Text, TextInput, Image, StyleSheet, Alert } from 'react-native'
import { Button, Icon } from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal';
import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash';
import { validatePhone } from '../../Utils/Utils';
import Toast from 'react-native-easy-toast';
import FirebaseRecapcha from '../../Utils/FirebaseRecapcha'
import { sendAuthPhone } from '../../Utils/Acciones';

export default function SendConfirmation() {

    const toastRef = useRef();
    const navigation = useNavigation();
    const [country, setcountry] = useState("MX")
    const [callingcode, setcallingcode] = useState("52")
    const [phone, setphone] = useState('')
    const recaptchaVerifier = useRef();
    const inputPhone = useRef();

    const sendConfirmation = async ()=>{

        if (!validatePhone(phone)) {
            toastRef.current.show("Solo se aceptan números")
            setphone("");
        } else if(!isEmpty(phone)) {
            const number  = `+${callingcode}${phone}`
            const verificationId = await sendAuthPhone(number, recaptchaVerifier);

            if(!isEmpty(verificationId)){
                navigation.navigate('confirm-number', {verificationId})
            }else{
                Alert.alert("Verificacion", "Favor introduzca un número valido", [
                    {
                        style: "cancel",
                        text: "Entendido",
                        onPress: ()=>{
                            inputPhone.current.clear()
                            inputPhone.current.focus()
                        }
                    }
                ])
            }
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/logo.png')}
                style={styles.imgLogo}
            />
            <View style={styles.panel}>
                <View style={{
                    borderBottomColor: '#128C73',
                    borderBottomWidth: 2,
                    width: 100
                }}>
                </View>
                <View style={styles.panelInterior}>
                    <Icon
                        name='whatsapp'
                        type='material-community'
                        size={100}
                        color='#25D366'
                    />
                    <Text style={styles.titulo}>Por favor ingrese su número de Whatsapp</Text>
                    <View style={styles.viewtelefono}>
                        <CountryPicker
                            withFlag
                            withFilter
                            withCallingCode
                            withCallingCodeButton
                            countryCode={country}
                            onSelect={(Country) => {
                                setcountry(Country.cca2);
                                setcallingcode(...Country.callingCode)
                            }}
                        />
                        <Text style={{ color: '#fff' }}> | </Text>
                        <TextInput
                            placeholder='Ingrese su numero'
                            placeholderTextColor='#fff'
                            style={styles.inputPhone}
                            onChangeText={(text) => { setphone(text) }}
                            value={phone}
                            keyboardType='numeric'
                            maxLength={10}
                            ref={inputPhone}
                        ></TextInput>
                    </View>
                    <Button title='Confirmar número'
                        buttonStyle={{
                            backgroundColor: '#25D366', marginHorizontal: 20
                        }}
                        containerStyle={{
                            marginVertical: 20
                        }}
                        onPress={() => {
                            sendConfirmation();
                        }}
                    ></Button>
                </View>
            </View>
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <FirebaseRecapcha referencia={recaptchaVerifier}></FirebaseRecapcha>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#128C73'
    },
    imgLogo: {
        width: 106,
        height: 106,
        marginVertical: 40,
        alignSelf: 'center'

    },
    panel: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 20,
        borderTopRightRadius: 50,
        borderTopLeftRadius: 50,
        alignItems: 'center'
    },
    panelInterior: {
        flex: 1,
        justifyContent: 'space-around',
        marginHorizontal: 20
    },
    titulo: {
        color: '#25D366',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: 'bold'
    },
    viewtelefono: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 10,
        marginHorizontal: 20,
        paddingHorizontal: 30,
        height: 50,
        backgroundColor: 'rgba(37, 211, 106, 0.6)'
    },
    inputPhone: {
        width: '80%',
        height: 50,
        marginLeft: 5
    }
})
