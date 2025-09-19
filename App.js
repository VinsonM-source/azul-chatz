//App.js

import React, { useContext, useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider } from 'styled-components/native';
import { ThemeContext, ThemeProviderWrapper } from './src/context/ThemeContext';
import { db, auth } from './src/services/firebase';
import { doc, setDoc } from 'firebase/firestore';
import MainNavigator from './src/navigation/MainNavigator';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Setting a timer']); // Ignore Firebase warning

export default function App() {
  return (
    <ThemeProviderWrapper>
      <AppContent />
    </ThemeProviderWrapper>
  );
}

function AppContent() {
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) saveTokenToFirestore(token);
    });

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  const saveTokenToFirestore = async (token) => {
    if (!auth.currentUser) return;
    await setDoc(doc(db, 'users', auth.currentUser.uid), { expoPushToken: token }, { merge: true });
  };

  return (
    <NavigationContainer>
      <ThemeProvider theme={theme}>
        <MainNavigator />
      </ThemeProvider>
    </NavigationContainer>
  );
}

// Register device for push notifications
async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert('Failed to get push token!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    Alert.alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

