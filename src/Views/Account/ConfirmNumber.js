import React, { useState, useRef } from 'react'
import { View, Text, Image, StyleSheet, Alert, TextInput } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import CodeInput from 'react-native-code-input';
import Loading from '../../Components/Loading'
import { confirmationCode, getToken, getUser, addRegister } from '../../Utils/Acciones'

export default function ConfirmNumber(props) {

    const { route } = props;
    const { verificationId } = route.params;
    const [loading, setloading] = useState(false)

    const confirmCodeSMS = async (code) => {
        setloading(true);
        const result = await confirmationCode(verificationId, code);
        console.log("resultado => ", result)
        if (result) {
            setloading(false);
            const token = await getToken();
            const { uid, displayName, phoneNumber, photoURL, email, } = await getUser();
            await addRegister("Usuarios", uid, {
                token,
                displayName,
                phoneNumber,
                photoURL,
                email,
                fechaCreacion: new Date()
            })
        } else {
            setloading(false)
            Alert.alert("ERROR", "Favor válidar el código introducido", [{
                style: 'default',
                text: 'Entendido'
            }])
        }
    }

    return (
        <View style={styles.container}>
            <Image
                source={require('../../../assets/logo.png')}
                style={styles.imgLogo}
            />
            <Text style={styles.titulo}>Favor revise su SMS  e introduzca el código de confirmación</Text>
            <CodeInput
                focus={true}
                activeTintColor='#fff'
                inactiveTintColor='#fff'
                size={50}
                inputPosition='center'
                codeLength={6}
                containerStyle={{
                    marginTop: 20
                }}
                codeInputStyle={{
                    borderWidth: 1.6
                }}
                onFulfill={(code) => {
                    confirmCodeSMS(code);
                }}
                secureTextEntry
            ></CodeInput>
            <Loading isVisible={loading} text="Por favor espere..."></Loading>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#128C73',
        justifyContent: 'center',
        paddingHorizontal: 20,
        alignItems: 'center'
    },
    imgLogo: {
        width: 106,
        height: 106,
        marginTop: 40,
        alignSelf: 'center'

    },
    titulo: {
        fontSize: 20,
        color: '#fff',
        textAlign: 'center',
        marginVertical: 20
    }
})
