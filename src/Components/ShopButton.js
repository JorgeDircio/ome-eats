import React from 'react';
import { TouchableHighlight, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function ShopButton() {
  const navigation = useNavigation();

  return (
    <TouchableHighlight
      style={styles.container}
      onPress={()=> { navigation.navigate("my-store-stack");}}
    >
      <Icon color='#fff' name='store' size={30} />
    </TouchableHighlight>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#25D366",
    alignItems: 'center',
    justifyContent: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    top: -10,
    shadowRadius: 5,
    shadowOffset: {height: 10},
    shadowOpacity: 0.3,
    borderWidth: 3,
    borderColor: '#fff',
    padding: 20
  }
});