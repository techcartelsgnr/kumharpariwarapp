import { Platform, PermissionsAndroid } from 'react-native';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission,
  getToken,
  AuthorizationStatus,
  subscribeToTopic,   // ✅ modular subscribe
} from '@react-native-firebase/messaging';
import { store } from "../redux/store";
import { setFcmToken } from "../redux/slices/authSlice";
export const requestNotificationPermission = async () => {
  try {
    const app = getApp();
    const messagingInstance = getMessaging(app);

    // ANDROID 13+ PERMISSION
    if (Platform.OS === 'android' && Platform.Version >= 33) {
      const result = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
      );
      if (result !== PermissionsAndroid.RESULTS.GRANTED) {
        console.log('🚫 Notification permission denied');
        return;
      }
    }

    // OS Permission
    const status = await requestPermission(messagingInstance);
    const enabled =
      status === AuthorizationStatus.AUTHORIZED ||
      status === AuthorizationStatus.PROVISIONAL;

    if (!enabled) {
      console.log('🚫 User denied permission');
      return;
    }

    console.log('🔐 Permission Granted');

    // GET FCM TOKEN
    const token = await getToken(messagingInstance);
    store.dispatch(setFcmToken(token));
    console.log('🎯 FCM Token:', token);

    // SUBSCRIBE TO TOPIC (MODULAR API)
    await subscribeToTopic(messagingInstance, 'all');
    console.log('📌 Subscribed to topic: all');

    return token;
  } catch (err) {
    console.log('❌ Permission Error:', err);
  }
};
