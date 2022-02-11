import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Icon } from 'react-native-elements';


import AccountStack from './AccountStack';
import MyStoreStack from './MyStoreStack';
import ProfileStack from './ProfileStack';
import StoreStack from './StoreStack';

//Importar componentes mas adelante
import ShopButton from '../Components/ShopButton';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const TabBar = () => {
  return (
    <Tab.Navigator
      initialRouteName='store-stack'
      tabBarOptions={{
        inactiveTintColor: '#fff', activeTintColor: '#fff', style: {
          borderTopLeftRadius: 60,
          borderTopRightRadius: 60,
          alignItems: 'center',
          backgroundColor: '#128C7E',
          paddingBottom: 5
        }
      }}
      screenOptions={
        ({ route }) => ({
          tabBarIcon: ({color}) => mostrarIcono(route, color),
        })
      }
    >
      <Tab.Screen
        component={StoreStack}
        name='store-stack'
        options={{ title: 'Tienda' }}
      />
      <Tab.Screen
        component={MyStoreStack}
        name='my-store-stack'
        options={{ title: '', tabBarIcon: ()=> <ShopButton></ShopButton>}}
      />
      <Tab.Screen
        component={ProfileStack}
        name='profile-stack'
        options={{ title: 'Cuenta' }}
      />
    </Tab.Navigator>
  );
}

const mostrarIcono = (route, color) => {
  let iconName = '';

  switch(route.name){
    case 'store-stack': iconName = 'cart-outline';
    break;
    case 'my-store-stack': iconName = 'cart-outline';
    break;
    case 'profile-stack': iconName = 'account-circle-outline';
    break;
  }

  return(
    <Icon type='material-community' name={iconName} size={24} color={color}/>
  );

}

export default function AuthenticatedRoutes() {
  return (
    <NavigationContainer>
      <TabBar />
    </NavigationContainer>
  );
}