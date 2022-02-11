import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ConfirmNumber from '../Views/Account/ConfirmNumber';
import Login from '../Views/Account/Login';
import Register from '../Views/Account/Register';
import RestorePassword from '../Views/Account/RestorePassword';
import SendConfirmation from '../Views/Account/SendConfirmation';
import { NavigationContainer } from '@react-navigation/native';

const Stack = createStackNavigator();

export default function AccountStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='send-confirmation'>
        <Stack.Screen
          component={ConfirmNumber}
          name='confirm-number'
          options={{
            headerTintColor: '#fff', title: 'Confirmar Número', headerStyle: { backgroundColor: '#128C7E' }
          }}
        />
        <Stack.Screen
          component={SendConfirmation}
          name='send-confirmation'
          options={{
            headerTintColor: '#fff', title: 'Confirma tu Número de Telefono', headerStyle: { backgroundColor: '#128C7E' }
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}