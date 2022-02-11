import React from 'react';
import { View, Image } from 'react-native';
import Carousel, {Pagination} from 'react-native-snap-carousel';
import {size} from 'lodash';

export default function CarouselImage(props) {
  const {height, width, images, activeSlide, setActiveSlider} = props;

  const renderItem = ({item})=>{
    return(
      <Image
        style={{width, height}}
        source={{uri: item}}
        resizeMode="stretch"
      />
    );
  }

  return (
    <View>
      <Carousel
        layout="default"
        itemWidth={width}
        sliderWidth={width}
        data={images}
        renderItem={renderItem}
        onSnapToItem={index => setActiveSlider(index)}
      />
      <Paginacion
        data={images}
        activeSlide={activeSlide}
      />
    </View>
  )
}

function Paginacion(props){
  const {data, activeSlide} = props;
  return(
    <Pagination
      dotsLength={size(data)}
      activeDotIndex={activeSlide}
      containerStyle={{
        backgroundColor: "transparent",
        zIndex: 1,
        position: "absolute",
        bottom: 40,
        alignSelf: 'center'
      }}
      dotContainerStyle={{
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 2,
        backgroundColor: '#25D366'
      }}
      inactiveDotStyle={{
        height: 10,
        width: 10,
        borderRadius: 5,
        marginHorizontal: 2,
        backgroundColor: '#128C7E'
      }}
      inactiveDotOpacity={0.6}
      inactiveDotScale={0.6}
    />
  );
}
