import React from 'react'
import DrawerNavigator from './navigation/DrawerNavigator'
import ScreenNavigator from './navigation/ScreenNavigator'
import { NavigationContainer } from '@react-navigation/native'

const App = () => {
  return (
    <NavigationContainer>
      {/* <DrawerNavigator/> */}
      <ScreenNavigator/>
    </NavigationContainer>
  )
}

export default App