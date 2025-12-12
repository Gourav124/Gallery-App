import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import { NavigationContainer } from '@react-navigation/native';
import CustomDrawer from './CustomDrawer';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

const Drawer = createDrawerNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                    drawerStyle: { backgroundColor: '#3498db', width: 250 },
                }}
            >
                <Drawer.Screen name="Home" component={HomePage} options={{ title: 'My Gallery', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }} />
                <Drawer.Screen name="About" component={AboutPage} options={{ headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}

export default AppNavigator