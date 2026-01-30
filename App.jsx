import './firebase-messaging';

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { Provider, useDispatch, useSelector } from "react-redux";
import DrawerNavigator from "./src/navigation/DrawerNavigator";
import AuthStack from "./src/navigation/AuthStack";
import { store } from "./src/redux/store";
import { ThemeProvider } from "./src/theme/ThemeContext";
import { chkLogin } from './src/redux/slices/authSlice';
import SplashScreen from './src/screens/splash/SplashScreen';

// Notification 
import { requestNotificationPermission } from './src/utils/requestPermissions';
import { registerNotificationListeners, navigateByNotificationType } from './src/utils/notificationService';

// ⭐ Navigation service
import {
  navigationRef,
  processPendingNavigation,
} from './src/contants/NavigationService';

// ⭐ Deep linking
const linking = {
  prefixes: ['kumharpariwar://'],
  config: {
    screens: {
      BlogScreen: 'blog/:blog_id',
      EventsScreen: 'event/:event_id',
      NotificationScreen: 'notifications',
    },
  },
};


function AppNavigator() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    dispatch(chkLogin());

    // ⏳ Splash delay
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // ⭐ Handle background notification tap
  useEffect(() => {
    if (global.backgroundNotificationData) {
      const data = global.backgroundNotificationData;
      global.backgroundNotificationData = null;

      console.log('🔄 Navigating from background tap:', data);
      navigateByNotificationType(data);
    }
  }, []);

  // ⭐ Show splash first
  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer
      linking={linking}
      ref={navigationRef}
      onReady={() => {
        processPendingNavigation();
      }}
    >
      {token ? <DrawerNavigator /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  useEffect(() => {
    requestNotificationPermission();
    registerNotificationListeners();
  }, []);
  return (
    <ThemeProvider>
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    </ThemeProvider>
  );
}
