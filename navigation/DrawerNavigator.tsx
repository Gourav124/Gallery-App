import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import CustomDrawer from './CustomDrawer';
import HomePage from '../pages/HomePage';
import AboutPage from '../pages/AboutPage';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
    return (
            <Drawer.Navigator
                initialRouteName="Home"
                drawerContent={(props) => <CustomDrawer {...props} />}
                screenOptions={{
                    drawerStyle: { backgroundColor: '#3498db', width: 250 },
                }}
            >
                <Drawer.Screen name="Home" component={HomePage} options={{ title: 'My Gallery', headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff'}} />
                <Drawer.Screen name="About" component={AboutPage} options={{ headerStyle: { backgroundColor: '#3498db' }, headerTintColor: '#fff' }} />
            </Drawer.Navigator>
    )
}

export default DrawerNavigator