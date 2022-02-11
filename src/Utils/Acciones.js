import { firebaseapp } from "./Firebase";
import * as firebase from 'firebase';
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import 'firebase/firestore'
import uuid from 'random-uuid-v4'
import { map } from 'lodash'
import { convertFileBlob } from './Utils'
import { FireSQL } from 'firesql';

const db = firebase.firestore(firebaseapp);
const fireSQL = new FireSQL(firebase.firestore(), {includeId: "id"});
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
});

//metodo para agregar un usuario (Colleciont, BD)
export const addRegister = async (collection, doc, data) => {
  const result = { error: "", statusResponse: false }
  await db.collection(collection).doc(doc).set(data, { merge: true })
    .then(response => {
      result.statusResponse = true;
    }).catch(err => {
      result.error = err;
    })
  return result;
}


export const validateSession = (setuser) => {
  firebase.auth().onAuthStateChanged((user) => {
    if (user) {
      setuser(true);
    } else {
      setuser(false);
    }
  });
}


export const closeSession = () => {
  firebase.auth().signOut();
}

export const validatePhone = (setPhoneAuth) => {
  db.collection("Usuarios").doc(getUser().uid).onSnapshot((snapshot) => {
    setPhoneAuth(snapshot.exists);
  });
}

export const sendAuthPhone = async (phone, recaptcha) => {
  let verificationid = '';
  await firebase.auth().currentUser.reauthenticateWithPhoneNumber(phone, recaptcha.current)
    .then((response) => {
      verificationid = response.verificationId;
    }).catch((err) => console.log(err));
  return verificationid;
}

export const confirmationCode = async (verificationId, code) => {
  let result = false;
  const credentials = await firebase.auth.PhoneAuthProvider.credential(verificationId, code);
  await firebase.auth().currentUser.linkWithCredential((credentials))
    .then((response) => result = true)
    .catch((err) => console.log(err));

  return result;
}

export const getToken = async () => {
  let token = "";
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
};

export const getUser = () => firebase.auth().currentUser;

export const uploadImages = async (images, route) => {
  const imagenesUrl = [];
  await Promise.all(
    map(images, async (image) => {
      const blob = await convertFileBlob(image);
      const ref = await firebase.storage().ref(route).child(uuid());
      await ref.put(blob).then(async (response) => {
        await firebase.storage().ref(`${route}/${response.metadata.name}`).getDownloadURL()
          .then(url => {
            imagenesUrl.push(url);
          })
      })
    }))
  return imagenesUrl;
}

//metodo para actualizar el objeto perfil de firebase
export const updateProfile = async (data) => {
  let respuesta = false;
  await firebase.auth().currentUser.updateProfile(data).then(response => {
    respuesta = true;
  })
  return respuesta;
}

export const reauthenticate = async (verificationId, code) => {
  let response = { statusResponse: false }

  const credenciales = new firebase.auth.PhoneAuthProvider.credential(verificationId, code);

  await firebase.auth().currentUser.reauthenticateWithCredential(credenciales).then((response.statusResponse = true)).catch(err => console.log(err));

  return response;
}

export const updateemail = async (email) => {
  let response = { statusResponse: false };
  await firebase.auth().currentUser.updateEmail(email).then(() => response.statusResponse = true).catch(() => response.statusResponse = false);
  return response;
}

export const actualizarTelefono = async (verificationId, code) => {
  let response = { statusResponse: false };
  const credenciales = new firebase.auth.PhoneAuthProvider.credential(verificationId, code);
  await firebase.auth().currentUser.updatePhoneNumber(credenciales).then(() => response.statusResponse = true).catch(() => response.statusResponse = false);
  return response;
}

export const agregarRegistro = async (collection, data) => {

  const result = { error: "", statusResponse: false }
  await db.collection(collection).add(data)
    .then(() => {
      result.statusResponse = true;
    }).catch(err => {
      result.error = err;
    })
  return result;

}

export const listarProducto = async () => {
  let productos = [];
  await db.collection("Productos").where("usuario", "==", getUser().uid).where("status", "==", 1).get()
    .then(response => {
      response.forEach(doc => {
        const producto = doc.data();
        producto.id = doc.id;
        productos.push(producto);
      });
    }).catch(() => console.log("error"));
  return productos;
}

export const actualizarRegistro = async (collection, doc, data) => {
  let response = { statusResponse: false };
  await db.collection(collection).doc(doc).update(data).then(() => response.statusResponse = true).catch(() => response.statusResponse = false);
  return response;
}

export const deleteRegistro = async (collection, doc) => {
  let response = { statusResponse: false };
  await db.collection(collection).doc(doc).delete().then(() => {
    response.statusResponse = true;
  }).catch((err) => {
    console.log("Error al eliminar => ", err);
    response.statusResponse = false;
  });
  return response;
}

export const getRegisterById = async (collection, doc) => {
  let response = { statusResponse: false, data: null };
  await db
    .collection(collection).doc(doc)
    .get()
    .then((product) => {
      response.statusResponse = true;
      const producto = product.data();
      producto.id = product.id;
      response.data = producto;
    })
    .catch((error) => {
      console.log("error al cargar productos ", error);
      response.statusResponse = false;
    })
  return response;
}

//!Listar todos los productos disponibles
export const listProducts = async () => {
  let index = 0;
  const products = [];
  await db.collection('Productos').where("status", "==", 1).get().then((response) => {
    response.forEach(doc => {
      const productos = doc.data();
      productos.id = doc.id;
      products.push(productos);
    })
  }).catch((err) => {
    console.log("Error al listar los productos ", err)
  });

  for (const registro of products) {
    const usuario = await getRegisterById("Usuarios", registro.usuario);
    usuario.data.id = registro.usuario;
    products[index].usuario = usuario.data;
    index++;
  }

  return products;
}

export const listProductsByCategory = async (category) => {
  let index = 0;
  const products = [];
  await db.collection('Productos').where("status", "==", 1).where('categoria', '==', category).get().then((response) => {
    response.forEach(doc => {
      const productos = doc.data();
      productos.id = doc.id;
      products.push(productos);
    })
  }).catch((err) => {
    console.log("Error al listar los productos ", err)
  });

  for (const registro of products) {
    const usuario = await getRegisterById("Usuarios", registro.usuario);
    usuario.data.id = registro.usuario;
    products[index].usuario = usuario.data;
    index++;
  }
  return products;
}

export const Search = async (search)=>{
  let products = [];
  await fireSQL.query(`SELECT * FROM Productos WHERE titulo LIKE '${search}%'`).then( response =>{
    products = response;
  });
  return products;
}