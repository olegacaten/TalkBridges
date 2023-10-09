import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as io from "socket.io-client"; 
import LogIn from './app/static/LogIn';
import Chats from './app/static/Chats';
import Chat from './app/static/Chat';
import { StatusBar, Text } from 'react-native';
import { Provider } from 'react-redux';
import { store } from './app/core/user';

const Stack = createStackNavigator();

export const socket = io.connect('http://192.168.198.248:8082');

const App = () => {
  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to the server ' + socket.id);
      // dispatch(socket.id);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the server');
    });

    socket.on('error', (error: any) => {
      console.error('Socket.io error:', error);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar translucent={false} backgroundColor={'white'} barStyle={'dark-content'} />
        <Stack.Navigator initialRouteName="LogIn">
          <Stack.Screen name="LogIn" component={LogIn} options={{ title: 'Log In' }} />
          <Stack.Screen name="Chats" component={Chats} options={{ title: 'Chats' }} />
          <Stack.Screen name="Chat" component={Chat} options={{ title: 'Chat' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
