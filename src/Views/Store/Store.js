import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, StatusBar, StyleSheet, FlatList, Dimensions, TouchableOpacity } from 'react-native'
import { Icon, Avatar, Image, Rating, Badge } from 'react-native-elements'
import { useFocusEffect } from '@react-navigation/native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { size } from 'lodash'

import { listProducts, getUser, listProductsByCategory } from '../../Utils/Acciones';
import Busqueda from '../../Components/Busqueda'

export default function Store({ navigation }) {

    const [productList, setproductList] = useState([]);
    const [search, setSearch] = useState('');
    const [mensaje, setmensaje] = useState('Cargando...');
    const [notificacion, setnotificacion] = useState('');
    const [categoria, setCategoria] = useState('');
    const { photoURL } = getUser();

    useEffect(() => {
        (
            async () => {
                ListarProductos();
            })()
        
    }, []);

    useFocusEffect(
        useCallback(
            () => {
                ListarProductos();
            }, []
        )
    );

    const ListarProductos = async () => {
        setproductList(await listProducts());
    }

    const cargarProductosPorCategoria = async (category) => {
        const listarProductos = await listProductsByCategory(category);
        setproductList(listarProductos);

        if (productList.length == 0) {
            setmensaje("No se ha encontrado productos de la categoría " + category);
        }

    }

    const actualizarCategoria = async () => {
        setproductList(await listProducts());
    }

    return (
        <View style={styles.frame}>
            <StatusBar backgroundColor='#128C73'></StatusBar>
            <View style={styles.header}>
                <KeyboardAwareScrollView>
                    <View style={styles.menu}>
                        <Avatar
                            rounded
                            size='medium'
                            source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                        ></Avatar>
                        <Image
                            style={styles.logo}
                            source={require("../../../assets/logo.png")}
                        ></Image>
                        <View>
                            <Icon
                                type="material-community"
                                name='bell-outline'
                                color='#fff'
                                size={30}
                            />
                            <Badge
                                status="error"
                                containerStyle={{ position: 'absolute', top: -4, right: -4 }}
                                value={2}
                            />
                        </View>
                    </View>
                    <Busqueda
                        search={search}
                        setSearch={setSearch}
                        actualizarCategoria={actualizarCategoria}
                        setproductList={setproductList}
                        setmensaje={setmensaje}
                    ></Busqueda>
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.categoriaView} >
                <View style={styles.categoriaTitulo} >
                    <Text style={styles.categoriaText}>- CATEGORIAS -</Text>
                    {categoria.length > 0 && (
                        <TouchableOpacity
                            onPress={() => {
                                setCategoria("");
                                actualizarCategoria();
                            }}
                        >
                            <Icon
                                type="material-community"
                                color='red'
                                name='close'
                                reverse
                                size={10}
                            />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={styles.categoriaList}>
                    <BotonCategoria cargarProductosPorCategoria={cargarProductosPorCategoria} setCategoria={setCategoria} categoria={categoria} categoriaBoton="libros" icon="book-open-outline" texto="Libros" ></BotonCategoria>
                    <BotonCategoria cargarProductosPorCategoria={cargarProductosPorCategoria} setCategoria={setCategoria} categoria={categoria} categoriaBoton="ideas" icon="lightbulb-on-outline" texto="Ideas" ></BotonCategoria>
                    <BotonCategoria cargarProductosPorCategoria={cargarProductosPorCategoria} setCategoria={setCategoria} categoria={categoria} categoriaBoton="articulos" icon="cart-arrow-down" texto="Articulos" ></BotonCategoria>
                    <BotonCategoria cargarProductosPorCategoria={cargarProductosPorCategoria} setCategoria={setCategoria} categoria={categoria} categoriaBoton="servicios" icon="account-outline" texto="Servicios" ></BotonCategoria>
                </View>
            </View>
            {
                (size(productList) > 0) ? (
                    <FlatList
                        data={productList}
                        renderItem={producto => (
                            <Producto navigation={navigation} producto={producto}></Producto>
                        )}
                        keyExtractor={(_, index) => index.toString()}
                    />
                ) : (
                    <Text>{mensaje}</Text>
                )
            }
        </View>
    );
}

const Producto = ({ producto, navigation }) => {

    const { titulo, precio, rating, descripcion, id, imagenes, usuario } = producto.item;
    const { displayName, photoURL } = usuario;
    return (
        <TouchableOpacity style={styles.card}
            onPress={() => navigation.navigate('detail', { id, titulo })}
        >
            <Image source={{ uri: imagenes[0] }} style={styles.imgProduct} />
            <View style={styles.infoBox}>
                <Text style={styles.titulo}>{titulo}</Text>
                <Text>{descripcion.substring(0, 50)}...</Text>
                <Text style={styles.vendidopor}>Vendido por:</Text>
                <View style={styles.avatarbox}>
                    <Avatar
                        rounded
                        source={photoURL ? { uri: photoURL } : require('../../../assets/avatar.jpg')}
                        size='large'
                        style={styles.avatar}
                    />
                    <Text style={styles.displayName}> {displayName}</Text>
                </View>
                <Rating
                    readonly
                    imageSize={15}
                    startingValue={rating}
                    style={{ paddingLeft: 40 }}
                />
                <Text style={styles.precio}>$ {precio.toFixed(2)}</Text>
            </View>

        </TouchableOpacity>
    )
}

const BotonCategoria = (props) => {
    const { setCategoria, categoria, categoriaBoton, icon, texto, cargarProductosPorCategoria } = props;

    return (
        <TouchableOpacity
            style={
                categoria === categoriaBoton ? styles.categoriaHover : styles.categoriaBtn
            }
            onPress={() => {
                setCategoria(categoriaBoton);
                cargarProductosPorCategoria(categoriaBoton);
            }}
        >
            <Icon
                type='material-community'
                name={icon}
                size={30}
                color={categoria === categoriaBoton ? "#fff" : "#128C7E"}
            />
            <Text style={categoria == categoriaBoton ? styles.catTxtHover : styles.catTxt} >{texto}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    avatar: {
        height: 30,
        width: 30
    },
    categoriaTitulo: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    displayName: {

    },
    categoriaList: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: 5
    },
    categoriaText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#128C7E'
    },
    categoriaView: {
        marginTop: 10
    },
    catTxtHover: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#fff'
    },
    catTxt: {
        fontSize: 12,
        fontStyle: 'italic',
        color: '#128C7E'
    },
    categoriaHover: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 7.0,
            height: -8.0
        },
        shadowOpacity: 0.5,
        shadowColor: '#000',
        backgroundColor: '#25D366',
        borderRadius: 40,
        elevation: 1
    },
    categoriaBtn: {
        width: 80,
        height: 80,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: {
            width: 7.0,
            height: -8.0
        },
        shadowOpacity: 0.5,
        shadowColor: '#000',
        backgroundColor: '#fff',
        borderRadius: 40,
        elevation: 1
    },
    precio: {
        marginTop: 10,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#128C7E',
        alignSelf: 'center'
    },
    avatarbox: {
        flexDirection: 'row',
        marginTop: 5,
        alignItems: 'center'
    },
    frame: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    header: {
        height: '20%',
        width: '100%',
        backgroundColor: '#128C73'
    },
    menu: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    logo: {
        height: 50,
        width: 50
    },
    card: {
        width: '100%',
        paddingVertical: 20,
        paddingHorizontal: 10,
        marginHorizontal: 5,
        borderBottomColor: '#128C73',
        borderBottomWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
        flexDirection: 'row'
    },
    imgProduct: {
        height: 200,
        width: 150,
        borderRadius: 10
    },
    infoBox: {
        paddingLeft: 10,
        alignItems: 'center',
        flex: 1
    },
    titulo: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: "700",
        textAlign: 'center',
        color: "#075e54"
    },
    vendidopor: {
        fontSize: 16,
        marginTop: 5,
        color: "#075e54",
        fontWeight: '700'
    }
})
