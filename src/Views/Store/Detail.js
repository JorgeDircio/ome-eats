import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Icon, Avatar, Input, Button, Rating } from 'react-native-elements';
import { getRegisterById, getUser } from '../../Utils/Acciones';
import { size } from 'lodash';
import Loading from '../../Components/Loading';
import CarouselImage from '../../Components/Carousel';

export default function Detail(props) {

  const { route } = props;
  const { id, titulo } = route.params;

  const [producto, setProducto] = useState({});
  const [token, setToken] = useState("");
  const [nombreVendedor, setNombreVendedor] = useState("");
  const [fotoVendedor, setFotoVendedor] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [activeSlider, setActiveSlider] = useState(0);
  const currentUser = getUser();

  useEffect(() => {
    (
      async () => {
        setProducto((await getRegisterById("Productos", id)).data);
      }
    )();
  }, []);

  useEffect(() => {
    (
      async () => {
        if (size(producto) > 0) {
          const resultado = (await getRegisterById("Usuarios", producto.usuario)).data;
        }
      }
    )();
  }, [producto])

  return (
    <View>
      <CarouselImage
        images={producto.imagenes}
        height={400}
        width={Dimensions.get("window").width}
        activeSlide={activeSlider}
        setActiveSlider={setActiveSlider}
      />
      <Text>Detalle</Text>
    </View>
  )
}
