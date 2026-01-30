import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  ForgotScreen,
  LoginScreen,
  OtpScreen,
  RegisterScreen,
  ResetScreen,
} from './index';

const AuthStack = () => {
  const Stack = createNativeStackNavigator();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
      <Stack.Screen name="OtpScreen" component={OtpScreen} />
      <Stack.Screen name="ForgotScreen" component={ForgotScreen} />
      <Stack.Screen name="ResetScreen" component={ResetScreen} />
    </Stack.Navigator>
  );
};

export default AuthStack;
