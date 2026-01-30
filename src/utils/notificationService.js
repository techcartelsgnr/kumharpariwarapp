// notificationService.js
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  onMessage,
  onNotificationOpenedApp,
  getInitialNotification,
} from '@react-native-firebase/messaging';

import notifee, { EventType } from '@notifee/react-native';
import { navigate } from '../contants/NavigationService';

// -------------------------------------------------------------
// 🔥 Screen Router — handles all navigation based on notification
// -------------------------------------------------------------

const navigateByNotificationType = (data) => {
  if (!data) return;

  const type = data?.content_type?.toLowerCase();   // blog , event , general
  console.log("📲 Notification Type line number 21:", type);

  switch (type) {
    case "blog":
      navigate("BlogScreen", data);         // Navigate to blog detail
      break;

    case "event":
      navigate("EventsScreen", data);       // Navigate to event
      break;

    default:
      navigate("NotificationScreen", data); // Normal notification screen
      break;
  }
};

// -------------------------------------------------------------
// 🔔 Foreground Handler
// -------------------------------------------------------------

export const registerNotificationListeners = () => {
  const app = getApp();
  const messagingInstance = getMessaging(app);

  // When app is open → show local notification
  onMessage(messagingInstance, async (remoteMessage) => {
    console.log("📩 Foreground Message:", remoteMessage);

    const channelId = await notifee.createChannel({
      id: "default",
      name: "Default Channel",
    });

    await notifee.displayNotification({
      title: remoteMessage.notification?.title,
      body: remoteMessage.notification?.body,
      android: {
        channelId,
        smallIcon: "ic_launcher",
        pressAction: { id: "tap-action" },
      },
      data: remoteMessage.data || {},
    });
  });

  // -------------------------------------------------------------
  // 🔥 When user taps notification (app in foreground)
  // -------------------------------------------------------------
  notifee.onForegroundEvent(({ type, detail }) => {
    if (type === EventType.PRESS) {
      const data = detail?.notification?.data;
      navigateByNotificationType(data);
    }
  });

  // -------------------------------------------------------------
  // 🔥 When app opened from background tap
  // -------------------------------------------------------------
  onNotificationOpenedApp(messagingInstance, (remoteMessage) => {
    if (remoteMessage) {
      navigateByNotificationType(remoteMessage.data);
    }
  });

  // -------------------------------------------------------------
  // 🔥 When app opened from KILLED state (cold start)
  // -------------------------------------------------------------
  getInitialNotification(messagingInstance).then((remoteMessage) => {
    if (remoteMessage) {
      navigateByNotificationType(remoteMessage.data);
    }
  });
};










// import { getApp } from '@react-native-firebase/app';
// import {
//   getMessaging,
//   onMessage,
//   onNotificationOpenedApp,
//   getInitialNotification
// } from '@react-native-firebase/messaging';
// import notifee, { EventType } from '@notifee/react-native';
// import { navigate } from '../contants/NavigationService';

// // Simple Foreground Local Notification
// const showLocalNotification = async remoteMessage => {
//   const channelId = await notifee.createChannel({
//     id: 'default',
//     name: 'Default',
//   });

//   await notifee.displayNotification({
//     title: remoteMessage.notification?.title,
//     body: remoteMessage.notification?.body,
//     android: {
//       channelId,
//       smallIcon: 'ic_launcher',
//       pressAction: { id: 'tap-action' },
//     },
//     data: remoteMessage.data,
//   });
// };

// export const registerNotificationListeners = () => {
//   const app = getApp();
//   const messagingInstance = getMessaging(app);

//   // 1️⃣ Foreground Receive
//   onMessage(messagingInstance, async remoteMessage => {
//     console.log('📩 Foreground:', remoteMessage);
//     await showLocalNotification(remoteMessage);
//   });

//   // 2️⃣ Foreground Tap
//   notifee.onForegroundEvent(({ type, detail }) => {
//     if (type === EventType.PRESS) {
//       const screen = detail.notification?.data?.screen;
//       if (screen) navigate(screen);
//     }
//   });

//   // 3️⃣ Background Tap
//   onNotificationOpenedApp(messagingInstance, remoteMessage => {
//     const screen = remoteMessage?.data?.screen;
//     console.log('📩 Opened App From BG:', screen);
//     if (screen) navigate(screen);
//   });

//   // 4️⃣ Cold Start
//   getInitialNotification(messagingInstance).then(remoteMessage => {
//     if (remoteMessage) {
//       const screen = remoteMessage?.data?.screen;
//       console.log('📩 Cold Start:', screen);
//       if (screen) navigate(screen);
//     }
//   });
// };
