import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';

export default function CustomDrawer(props: any) {
    const { state, navigation } = props;

    return (
        <DrawerContentScrollView {...props}>
            <Text style = {{fontSize:20,fontWeight:'bold',color:'#fff'}}>My Gallery</Text>
            <View style={{ marginTop: 20 }}>

                {state.routes.map((route: any, index: any) => {
                    const selected = state.index === index;

                    return (
                        <TouchableOpacity
                            key={route.key}
                            onPress={() => navigation.navigate(route.name)}
                            style={[
                                styles.menuItem,
                                selected ? styles.activeItem : styles.inactiveItem,
                            ]}
                        >
                            <Text style={[styles.menuItem, selected ? styles.activeText : styles.inactiveText]}>
                                {route.name}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    menuItem: {
        padding: 6,
        borderRadius: 8,
        marginBottom: 8,
    },
    inactiveItem: {
        backgroundColor: '#3498db'
    },
    activeItem: {
        backgroundColor: '#fff',
    },
    activeText: {
        color: '#000',
        fontWeight: 'bold',
    },
    inactiveText: {
        color: '#fff'
    },
});
