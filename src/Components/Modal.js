//import liraries
import React, { Component } from 'react';
import { StyleSheet } from 'react-native';
import { Overlay } from 'react-native-elements';

// create a component
const Modal = (props) => {
  const {isVisible, setisVisible, children} = props;
  const closeModal = () => setisVisible(false)
  return (
    <Overlay
      isVisible={isVisible}
      overlayStyle={styles.overlay}
      onBackdropPress={closeModal}
    >
      {children}
    </Overlay>
  );
};

// define your styles
const styles = StyleSheet.create({
  overlay: {
    height: "auto",
    width: "90%",
    backgroundColor: '#FFF'
  },
});

//make this component available to the app
export default Modal;
