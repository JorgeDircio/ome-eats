import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Login from '../Views/Account/Login';
import Register from '../Views/Account/Register';
import RestorePassword from '../Views/Account/RestorePassword';

const Stack = createStackNavigator();

export default function UnauthenticatedRoutes() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName='login'
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          component={Login}
          name='login'
        />
        <Stack.Screen
          component={Register}
          name='register'
        />
        <Stack.Screen
          component={RestorePassword}
          name='restore-password'
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}