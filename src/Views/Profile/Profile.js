import React, { useState, useRef, useEffect } from 'react'
import { View, Text, StyleSheet, StatusBar, TouchableHighlight, TextInput } from 'react-native'
import { Icon, Avatar, Input } from 'react-native-elements';
import Loading from '../../Components/Loading';
import { updatePhoto, validateEmail } from '../../Utils/Utils';
import { uploadImages, updateProfile, addRegister, getUser, sendAuthPhone, reauthenticate, updateemail, actualizarTelefono } from '../../Utils/Acciones'
import Toast from 'react-native-easy-toast';
import InputEdit from '../../Components/InputEdit';
import Modal from '../../Components/Modal';
import CodeInput from 'react-native-code-input';
import FirebaseRecapcha from '../../Utils/FirebaseRecapcha';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import ImageView from "react-native-image-viewing";



export default function Profile() {
  const user = getUser();
  const toastRef = useRef();
  const [loading, setloading] = useState(false);

  const [image, setimage] = useState('');
  const [displayName, setdisplayName] = useState("");
  const [email, setemail] = useState("");
  const [phoneNumber, setphoneNumber] = useState("");
  const [editableDisplayName, seteditableDisplayName] = useState(false);
  const [editablePhoneNumer, seteditablePhoneNumer] = useState(false);
  const [editableEmail, seteditableEmail] = useState(false)
  const [verificationId, setverificationId] = useState("")
  const [isVisibleModal, setisVisibleModal] = useState(false);
  const [updatePhone, setupdatePhone] = useState(false);
  const [visibleProfile, setvisibleProfile] = useState(false);

  const recapcha = useRef();

  useEffect(() => {
    const { phoneNumber, email, displayName } = user;
    setimage(user.photoURL);
    setphoneNumber(phoneNumber);
    setemail(email);
    setdisplayName(displayName);
  }, [])

  const onChangeInput = (input, value) => {
    switch (input) {
      case "displayName":
        setdisplayName(value);
        break;
      case "email":
        setemail(value);
        break;
      case "phoneNumber":
        setphoneNumber(value);
        break;
    }
  }

  const getValue = (input) => {
    switch (input) {
      case "displayName":
        return displayName;
        break;
      case "email":
        return email;
        break;
      case "phoneNumber":
        return phoneNumber;
        break;
    }
  }

  const updateValue = async (input, value) => {
    switch (input) {
      case "displayName":
        await updateProfile({ displayName: value })
        await addRegister("Usuarios", user.uid, { displayName: value })
        console.log("usuario ", user)
        break;
      case "email":
        if (user.email !== value) {

          if (validateEmail(value)) {
            const verification = await sendAuthPhone(phoneNumber, recapcha);
            if (verification) {
              setverificationId(verification);
              setisVisibleModal(true);
            } else {
              alert("Ocurrio un error en la verificacion");
              setemail(user.email)
            }
          }
        }
        break;
      case "phoneNumber":
        if (user.phoneNumber !== value) {
          console.log("phoneNumber !!!! ")
          const verification = await sendAuthPhone(phoneNumber, recapcha);
          if (verification) {
            setverificationId(verification);
            setupdatePhone(true);
            setisVisibleModal(true);
          } else {
            alert("Ocurrio un error en la verificacion");
            setphoneNumber(user.phoneNumber)
          }
        }
        break;
    }
  }

  const confirmCode = async (verificationId, code) => {
    setloading(true);

    if (updatePhone) {
      const telefono = await actualizarTelefono(verificationId, code);
      const updateRegister = await addRegister("Usuarios", user.uid, { phoneNumber: phoneNumber });
      setisVisibleModal(false);
      setloading(false);
      setupdatePhone(false);
    } else {
      const result = await reauthenticate(verificationId, code);
      if (result.statusResponse) {
        const responseEmail = await updateemail(email);
        const updateEmail = await addRegister("Usuarios", user.uid, { email: email })
        setisVisibleModal(false);
        setloading(false);
        console.log("responseEmail ", responseEmail)
        console.log("update ", updateEmail)
      } else {
        alert("Ha ocurrido un error al actualizar el Correo")
      }

    }
  }

  const images = [
    {
      uri: image,
    }
  ];



  return (
    <KeyboardAwareScrollView>
      <StatusBar backgroundColor='#128C73'></StatusBar>
      <CabeceraBG displayName={displayName} />
      <HeaderAvatar
        user={user}
        toastRef={toastRef}
        setloading={setloading}
        setimage={setimage}
        image={image}
        setvisibleProfile={setvisibleProfile}
      ></HeaderAvatar>
      <FormData
        editableDisplayName={editableDisplayName}
        editableEmail={editableEmail}
        editablePhoneNumer={editablePhoneNumer}
        seteditableDisplayName={seteditableDisplayName}
        seteditableEmail={seteditableEmail}
        seteditablePhoneNumer={seteditablePhoneNumer}
        onChangeInput={onChangeInput}
        getValue={getValue}
        updateValue={updateValue}
      ></FormData>
      <ModalVerification
        isVisibleModal={isVisibleModal}
        setisVisibleModal={setisVisibleModal}
        confirmCode={confirmCode}
        verificationId={verificationId}
      ></ModalVerification>
      <FirebaseRecapcha referencia={recapcha}></FirebaseRecapcha>
      <Loading isVisible={loading} text="Por favor espere..."></Loading>
      <Toast ref={toastRef} position='center' opacity={0.9} />
      <ImageView
        images={images}
        imageIndex={0}
        visible={visibleProfile}
        onRequestClose={() => setvisibleProfile(false)}
      />
    </KeyboardAwareScrollView>
  )
}

const CabeceraBG = (props) => {
  const { displayName } = props
  return (
    <View>
      <View style={styles.bg}>
        <Text style={styles.nombre}>{displayName}</Text>
      </View>
    </View>
  );
}

const HeaderAvatar = (props) => {
  const { user, toastRef, setloading, setimage, image, setvisibleProfile } = props;
  const { uid } = user;

  const cambiarfoto = async () => {
    const result = await updatePhoto([1, 1]);
    if (result.status) {
      setloading(true);
      const url = await uploadImages([result.image], 'Perfil');
      const update = await updateProfile({ photoURL: url[0] });
      const response = await addRegister("Usuarios", uid, { photoURL: url[0], })
      if (response.statusResponse) {
        setloading(false)
        setimage(url[0])
        toastRef.current.show("Se subio correctamente la imagen")
      } else {
        setloading(false)
        alert("Ocurrio un error al subir la foto de perfil")
      }
    }
  }



  return (
    <View style={styles.avartarinline}>
      <Avatar
        source={image != '' ? { uri: image } : require('../../../assets/avatar.jpg')}
        rounded
        size='xlarge'
        onPress={() => {
          setvisibleProfile(true);
        }}
      >
      </Avatar>
      <TouchableHighlight
        style={styles.accessory}
        onPress={cambiarfoto}
      >
        <Icon name='camera' type='material-community' color='#fff' style={styles.imgLogo}></Icon>
      </TouchableHighlight>
    </View>
  )
}

const FormData = (props) => {
  const { onChangeInput, getValue, editablePhoneNumer, editableDisplayName, editableEmail, seteditableEmail, seteditablePhoneNumer, seteditableDisplayName, updateValue } = props;
  return (
    <View>
      <InputEdit
        id="displayName"
        label="Nombre"
        placeholder='Nombre'
        getValue={getValue}
        onChangeInput={onChangeInput}
        editable={editableDisplayName}
        seteditable={seteditableDisplayName}
        updateValue={updateValue}
      />
      <InputEdit
        id="email"
        label="Correo"
        placeholder='ejemplo@ejemplo.com'
        getValue={getValue}
        onChangeInput={onChangeInput}
        editable={editableEmail}
        seteditable={seteditableEmail}
        updateValue={updateValue}
      />
      <InputEdit
        id="phoneNumber"
        label="Teléfono"
        placeholder='+00000'
        getValue={getValue}
        onChangeInput={onChangeInput}
        editable={editablePhoneNumer}
        seteditable={seteditablePhoneNumer}
        updateValue={updateValue}
      />
    </View>
  );
}

const ModalVerification = (props) => {
  const { isVisibleModal, setisVisibleModal, confirmCode, verificationId } = props;

  return (
    <Modal
      isVisible={isVisibleModal}
      setisVisible={setisVisibleModal}
    >
      <View style={styles.confirmacion}>
        <Text style={styles.tituloModal}>Confirmar código</Text>
        <Text style={styles.detalle}>Se ha enviado un código de confirmación</Text>
        <CodeInput
          secureTextEntry
          activeColor="#128C73"
          inactiveColor="#128C73"
          autoFocus={false}
          inputPosition='center'
          size={40}
          containerStyle={{ marginTop: 30 }}
          codeInputStyle={{ borderWidth: 1.5 }}
          codeLength={6}
          onFulfill={(code) => {
            confirmCode(verificationId, code);
          }}
        />
      </View>
    </Modal>
  )

}


const styles = StyleSheet.create({
  bg: {
    backgroundColor: '#128C73',
    width: '100%',
    height: 200,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avartarinline: {
    flexDirection: 'row',
    marginTop: -120,
    justifyContent: 'space-around'
  },
  avatar: {
    width: 80,
    height: 80
  },
  accessory: {
    backgroundColor: '#25D366',
    width: 50,
    height: 50,
    position: 'absolute',
    borderRadius: 30,
    marginTop: 100,
    marginLeft: 90,
    shadowRadius: 5,
    shadowOffset: { height: 10 },
    shadowOpacity: 0.3,
  },
  imgLogo: {
    alignContent: 'center',
    marginTop: 12
  },
  confirmacion: {
    height: 200,
    width: "100%",
    alignItems: 'center'
  },
  tituloModal: {
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20
  },
  detalle: {
    marginTop: 20,
    fontSize: 14,
    textAlign: 'center'
  },
  nombre: {
    color: "white",
    marginTop: -140,
    fontSize: 24,
    fontWeight: 'bold'
  }
})