import React, { useState, useEffect, useRef } from 'react'
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView } from 'react-native'
import { Icon, Input, Avatar, Button, Image, AirbnbRating } from 'react-native-elements'
import { map, filter, size, isEmpty } from 'lodash'
import { useNavigation } from '@react-navigation/native'
import Loading from '../../Components/Loading';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { updatePhoto } from '../../Utils/Utils';
import { uploadImages, actualizarRegistro, getUser, getRegisterById } from '../../Utils/Acciones';

export default function EditStore(props) {

    const { route } = props;
    const { id } = route.params;
    const [titulo, settitulo] = useState("");
    const [descripcion, setdescripcion] = useState("");
    const [precio, setprecio] = useState(0.00);
    const [categoria, setcategoria] = useState("");
    const [images, setimages] = useState([]);
    const [errores, seterrores] = useState({});
    const [loading, setloading] = useState(false);
    const [rating, setrating] = useState(5);
    const navigation = useNavigation();

    useEffect(() => {
        (
            async () => {
                const { data } = await getRegisterById('Productos', id);
                settitulo(data.titulo);
                setdescripcion(data.descripcion);
                setprecio(data.precio);
                setcategoria(data.categoria);
                setimages(data.imagenes);
                setrating(data.rating);
            }
        )()
    },[])

    const addProduct = async () => {

        seterrores({});
        if (isEmpty(titulo)) {
            seterrores({ titulo: "El campo titulo es obligatorio" });
        } else if (isEmpty(descripcion)) {
            seterrores({ descripcion: "El campo descripcion es obligatorio" });
        } else if (!(parseFloat(precio) > 0)) {
            seterrores({ precio: "Introduzca un precio para el producto" })
        } else if (isEmpty(categoria)) {
            Alert.alert("Seleccione Categoría", "Favor de seleccionar una categoría", [
                {
                    text: "Entendido",
                    style: "cancel"
                }
            ]);
        } else if (isEmpty(images)) {
            Alert.alert("Seleccione Imagenes", "Favor de seleccionar una Imagen para su Producto o Servicio", [
                {
                    text: "Entendido",
                    style: "cancel"
                }
            ]);
        } else {
            setloading(true);
            const imagesURL = await uploadImages(images, 'ImagenesProducto');
            const producto = {
                titulo,
                descripcion,
                precio,
                usuario: getUser().uid,
                imagenes: imagesURL,
                status: 1,
                fechaCreacion: new Date(),
                rating,
                categoria
            }
            const result = await actualizarRegistro("Productos", id, producto);

            if (result.statusResponse) {
                setloading(false);
                Alert.alert("Actualizacion exitosa", "El producto o servicio se Actualizo correctamente", [
                    {
                        style: "cancel",
                        text: "Entendido",
                        onPress: () => { navigation.navigate('my-store') }
                    }
                ]);
            } else {
                setloading(false);
                Alert.alert("Actualizacion Fallida", "Ha ocurrido un error al Actualizar el producto o servicio", [
                    {
                        style: "cancel",
                        text: "Aceptar",
                    }
                ]);
            }
        }

    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <View style={{
                borderBottomColor: "#25D366",
                borderBottomWidth: 2,
                width: 100,
                marginTop: 20,
                alignSelf: 'center'
            }}></View>
            <Input
                placeholder="Titulo"
                value={titulo}
                onChangeText={(text) => settitulo(text)}
                inputStyle={styles.input}
                errorMessage={errores.titulo}
            ></Input>
            <Input
                placeholder="Descripcion"
                value={descripcion}
                onChangeText={(text) => setdescripcion(text)}
                inputStyle={styles.textarea}
                errorMessage={errores.descripcion}
                multiline={true}
            ></Input>
            <Input
                placeholder="Precio"
                value={precio.toFixed(2)}
                onChangeText={(text) => setprecio(parseFloat(text))}
                inputStyle={styles.input}
                errorMessage={errores.precio}
                keyboardType="number-pad"
            ></Input>
            <Text style={styles.txtlabel}>Calidad del Producto o Servicio</Text>
            <AirbnbRating
                count={5}
                reviews={["Baja", "Deficiente", "Normal", "Muy bueno", "Excelente"]}
                defaultRating={rating}
                size={35}
                onFinishRating={(value) => setrating(value)}
            ></AirbnbRating>
            <Text style={styles.txtlabel}>Cargar Imágenes</Text>
            <UploadImage images={images} setimages={setimages}></UploadImage>
            <Text style={styles.txtlabel}>Asignar Categoría</Text>
            <Botonera categoria={categoria} setcategoria={setcategoria} ></Botonera>
            <Button title="Actualizar Producto" buttonStyle={styles.btnaddnew}
                onPress={addProduct}
            />
            <Loading isVisible={loading} text="Por favor espere..."></Loading>
        </KeyboardAwareScrollView>
    )
}

function UploadImage(props) {
    const { images, setimages } = props;

    const removeImage = (image) => {
        Alert.alert("Eliminar Imagen", "Estas seguro que deseas eliminar la imagen?", [
            {
                text: "Cancelar",
                style: "cancel"
            },
            {
                text: "Eliminar",
                onPress: () => {
                    setimages(filter(images, (imageURL) => imageURL !== image));
                }
            }
        ]);
    }

    return (
        <ScrollView horizontal={true} style={styles.viewImages}>
            {
                size(images) < 5 && (
                    <Icon
                        type="material-community"
                        name="plus"
                        color='#7a7a7a'
                        containerStyle={styles.containerIcon}
                        onPress={async () => {
                            const result = await updatePhoto([1, 1]);
                            if (result.status) {
                                setimages([...images, result.image]);
                            }
                        }}
                    />
                )}
            {
                map(images, (image, index) => (
                    <Avatar
                        key={index}
                        style={styles.miniatura}
                        source={{ uri: image }}
                        onPress={() => {
                            removeImage(image);
                        }}
                    />
                ))}
        </ScrollView>
    );
}

function Botonera(props) {
    const { categoria, setcategoria } = props;
    return (
        <View style={styles.botonera}>
            <TouchableOpacity style={styles.btncategoria} onPress={() => {
                setcategoria("libros")
            }}>
                <Icon
                    type="material-community"
                    name="book-open"
                    size={24}
                    reverse
                    color={categoria === "libros" ? '#128C73' : '#757575'}
                />
                <Text>Libros</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btncategoria} onPress={() => {
                setcategoria("ideas")
            }}>
                <Icon
                    type="material-community"
                    name="lightbulb-on-outline"
                    size={24}
                    reverse
                    color={categoria === "ideas" ? '#128C73' : '#757575'}
                />
                <Text>Ideas</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btncategoria} onPress={() => {
                setcategoria("articulos")
            }}>
                <Icon
                    type="material-community"
                    name="cart-arrow-down"
                    size={24}
                    reverse
                    color={categoria === "articulos" ? '#128C73' : '#757575'}
                />
                <Text>Articulos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btncategoria} onPress={() => {
                setcategoria("servicios")
            }}>
                <Icon
                    type="material-community"
                    name="account"
                    size={24}
                    reverse
                    color={categoria === "servicios" ? '#128C73' : '#757575'}
                />
                <Text>Servicios</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 50,
        margin: 5,
        padding: 5,
        elevation: 3
    },
    input: {
        width: "90%",
        height: 50,
        borderRadius: 10,
        borderColor: '#707070',
        marginTop: 20,
        paddingHorizontal: 20
    },
    textarea: {
        height: 150
    },
    txtlabel: {
        fontSize: 20,
        fontFamily: 'Roboto',
        textAlign: 'center',
        fontWeight: 'bold',
        color: "#075e54"
    },
    btnaddnew: {
        backgroundColor: "#128C73",
        marginTop: 20,
        marginBottom: 40,
        marginHorizontal: 20
    },
    viewImages: {
        flexDirection: 'row',
        marginHorizontal: 20,
        marginTop: 30,
        marginBottom: 10
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 100,
        height: 150,
        marginRight: 10,
        backgroundColor: '#e3e3e3',
        padding: 10
    },
    miniatura: {
        height: 150,
        width: 100,
        marginRight: 10

    },
    botonera: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btncategoria: {
        justifyContent: "center",
        alignItems: 'center',
    }
})
