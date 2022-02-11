import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Profile from '../Views/Profile/Profile'


const Stack = createStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={Profile}
        name='profile'
        options={{
          title: 'Perfil',
          headerTintColor: '#fff',
          headerStyle: { backgroundColor: '#128C7E' }
        }}
      />
    </Stack.Navigator>
  );
}