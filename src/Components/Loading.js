import React from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { Overlay } from 'react-native-elements';
import { Grid } from 'react-native-animated-spinkit';

export default function Loading(props) {
  const { isVisible, text} = props;
  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
    >
      <View style={styles.view}>
        <Grid size={48} color="#128C7E"></Grid>
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Overlay>
  )
}

const styles = StyleSheet.create({
  overlay:{
    backgroundColor: "rgba(0,0,0,0.6)",
    width: "90%",
    borderWidth: 1,
    borderColor: '#128C7E',
    borderRadius: 20,
    height: Dimensions.get('window').height/2
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    marginTop: 20,
    color: '#128C7E',
    fontSize: 24,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    textAlign: 'center'
  }
})
