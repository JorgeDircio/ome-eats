//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';

// create a component
const InputEdit = (props) => {
  const { label, getValue, onChangeInput, id, placeholder, editable, seteditable, updateValue} = props;

  const edit = ()=>{
    seteditable(!editable);
  }

  return (
    <View style={styles.input}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TextInput
          editable={editable}
          placeholder={placeholder}
          key={id}
          value={getValue(id)}
          onChangeText={(text) => {
            onChangeInput(id, text)
          }}
          style={styles.textinputinternal}></TextInput>
        {
          editable ? (<Icon name="content-save" type="material-community" size={24} onPress={()=>{
            updateValue(id, getValue(id));
            edit();
          }} style={styles.icon} />)
            : (<Icon name="pencil" type="material-community" size={24} onPress={edit} style={styles.icon} />)
        }
      </View>
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  input: {
    borderBottomColor: "#cecece",
    borderBottomWidth: 1,
    width: "100%",
    marginBottom: 10,
    paddingHorizontal: 10
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#128C7E',
    fontSize: 16
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingBottom: 10
  },
  textinputinternal: {
    fontSize: 20,
    width: "80%",

  },
  icon:{

  }
});

//make this component available to the app
export default InputEdit;
