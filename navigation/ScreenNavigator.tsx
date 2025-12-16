import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from '../pages/HomePage';
import SearchPage from '../pages/SearchPage';

const Stack = createNativeStackNavigator();

const ScreenNavigator = () => {
  return (
            <Stack.Navigator
                initialRouteName="Home">
                <Stack.Screen name="Home" component={HomePage} options={{ title: 'My Gallery', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff'}} />
                <Stack.Screen name="Search" component={SearchPage} options={{ headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }} />
            </Stack.Navigator>
  )
}

export default ScreenNavigator