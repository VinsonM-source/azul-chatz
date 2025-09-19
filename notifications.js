// notifications.js

import * as Notifications from 'expo-notifications';
import { db } from './firebase';
import { doc, getDoc } from 'firebase/firestore';

export async function sendPushNotification(toUserId, title, body) {
  try {
    const userDoc = await getDoc(doc(db, 'users', toUserId));
    const token = userDoc.data()?.expoPushToken;
    if (!token) return;

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: token,
        title,
        body,
        sound: 'default',
      }),
    });
  } catch (err) {
    console.log('Error sending push notification:', err);
  }
}
