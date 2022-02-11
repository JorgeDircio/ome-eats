import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, FlatList, StyleSheet, Image, Alert } from 'react-native'
import { Icon } from 'react-native-elements'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { listarProducto, actualizarRegistro, deleteRegistro } from '../../Utils/Acciones';

export default function MyStore() {
    const navigation = useNavigation();
    const [productos, setproductos] = useState([])

    useEffect(() => {
        (
            async () => {
                setproductos(await listarProducto())
            }
        )()
    }, [productos])

    useFocusEffect(
        useCallback(
            () => {
                (
                    async () => {
                        setproductos(await listarProducto())
                    }
                )()
            },
            [],
        )
    );

    return (
        <View style={{ flex: 1, justifyContent: "center" }}>

            {
                productos.length > 0 ? (
                    <FlatList
                        data={productos}
                        renderItem={(item) => (
                            <Productos
                                productos={item}
                                setproductos={setproductos}
                                navigation={navigation}
                            ></Productos>
                        )}
                    />
                ) : (
                    <View style={{ alignSelf: 'center' }}>
                        <View style={{
                            width: 120,
                            height: 120,
                            borderColor: '#25D366',
                            borderWidth: 1,
                            borderRadius: 60,
                            alignSelf: 'center'
                        }}>
                            <Icon
                                type="material-community"
                                name='cart-plus'
                                size={100}
                                color="#25D366"
                                style={{ margin: 10 }}
                            />
                        </View>
                    </View>
                )
            }

            <Icon
                name="plus"
                type="material-community"
                color='#128C73'
                containerStyle={styles.btnContainer}
                onPress={() => {
                    navigation.navigate("add-product")
                }}
                reverse
            />
        </View>
    )
}

function Productos(props) {
    const { productos, setproductos, navigation } = props;
    const { precio, id, titulo, descripcion, imagenes } = productos.item;
    return (
        <View style={styles.container}>
            <Image
                source={{ uri: imagenes[0] }}
                style={{ width: 150, height: 150, borderRadius: 10, marginLeft: 10 }}
                resizeMethod='resize'
            />
            <View style={styles.viewmedio}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text style={styles.descripcion}>{descripcion.length ? descripcion.substring(0, 20) : descripcion}...</Text>
                <Text style={styles.precio}>$ {parseFloat(precio).toFixed(2)}</Text>
                <View style={styles.iconbar}>
                    <View style={styles.icon} >
                        <Icon
                            type="material-community"
                            color='#25D366'
                            name='check-outline'
                            style={styles.icon}
                            onPress={() => {
                                Alert.alert("Dar de alta el producto", "Estas seguro que deseas dar de alta el producto?", [
                                    {
                                        style: "default",
                                        text: 'Confirmar',
                                        onPress: () => actualizarRegistro("Productos", id, { status: 0 })
                                    },
                                    {
                                        style: "default",
                                        text: 'Cancelar',
                                    }
                                ])
                            }}
                        />
                    </View>
                    <View style={styles.iconedit} >
                        <Icon
                            type="material-community"
                            color='#FFA000'
                            name='pencil-outline'
                            style={styles.iconedit}
                            onPress={() => {
                                navigation.navigate('edit-store', { id })
                            }}
                        />
                    </View>
                    <View style={styles.icondelet} >
                        <Icon
                            type="material-community"
                            color='#D32F2F'
                            name='trash-can-outline'
                            style={styles.icondelet}
                            onPress={() => {
                                Alert.alert("Eliminar Producto", "¿Estas seguro de eliminar este Producto/Servicio?", [
                                    {
                                        style: 'default',
                                        text: 'Confirmar',
                                        onPress: () => deleteRegistro('Productos', id)
                                    },
                                    {
                                        style: 'cancel',
                                        text: 'salir'
                                    }
                                ])
                            }}
                        />
                    </View>
                </View>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    btnContainer: {
        bottom: 10,
        right: 10,
        position: 'absolute',
        shadowColor: '#000000',
        shadowOffset: { width: 2, height: 2 },
        shadowOpacity: 0.2
    },
    container: {
        flexDirection: 'row',
        flex: 1,
        paddingVertical: 10,
        borderBottomColor: '#128C73',
        borderBottomWidth: 0.5,
        shadowColor: '#128C73',
        shadowOffset: { height: 10 },
        shadowOpacity: 0.9
    },
    viewmedio: {
        flex: 1,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titulo: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '700',
        textAlign: 'center',
        color: '#075e54'
    },
    descripcion: {
        fontSize: 16,
        color: '#737373'
    },
    precio: {
        fontSize: 16,
        color: '#128C7E'
    },
    iconbar: {
        marginTop: 20,
        flexDirection: 'row',
    },
    icon: {
        borderWidth: 1,
        borderColor: '#25D366',
        padding: 5,
        borderRadius: 60,
        marginLeft: 20
    },
    iconedit: {
        borderWidth: 1,
        borderColor: '#FFA000',
        padding: 5,
        borderRadius: 50,
        marginLeft: 20
    },
    icondelet: {
        borderWidth: 1,
        borderColor: '#D32F2F',
        padding: 5,
        borderRadius: 50,
        marginLeft: 20
    }
})
