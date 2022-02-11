import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EditStore from '../Views/MyStore/EditStore';
import MyStore from '../Views/MyStore/MyStore';
import AddProduct from '../Views/MyStore/AddProduct';

const Stack = createStackNavigator();

export default function MyStoreStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: '#fff',
        headerStyle: { backgroundColor: '#128C7E' }
      }}
    >
      <Stack.Screen
        component={MyStore}
        name='my-store'
        options={{
          title: 'Mi Tienda'
        }}
      />
      <Stack.Screen
        component={AddProduct}
        name="add-product"
        options={{
          title: 'Agregar Producto', headerStyle: { backgroundColor: '#128C7E' }, headerTintColor: '#fff'
        }}
      />
      <Stack.Screen
        component={EditStore}
        name='edit-store'
        options={{
          title: 'Editar Producto'
        }}
      />
    </Stack.Navigator>
  );
}