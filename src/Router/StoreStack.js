import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Store from '../Views/Store/Store'
import Contact from '../Views/Store/Contact';
import Detail from '../Views/Store/Detail';
import MessageList from '../Views/Store/MessageList';

//Creando la pila de la navegacion
const Stack = createStackNavigator();
export default function StoreStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Store}
        name="store"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        component={Contact}
        name="contact"
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen component={Detail}
        name="detail"
        options={{
          headerTransparent: true, headerTintColor: '#128C7E', title: ''
        }}
      />
      <Stack.Screen
        component={MessageList}
        name="message-list"
        options={{
          headerStyle: { backgroundColor: '#128C7E' }, headerTintColor: '#fff', title: 'Mensajes'
        }}
      />
    </Stack.Navigator>
  );
}