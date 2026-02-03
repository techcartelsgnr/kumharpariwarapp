import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutes from '../navigation/TabRoutes';
import {
  AboutScreen,
  AddContact,
  AddPostScreen,
  AllBusinessCategory,
  BusinessCategory,
  BusinessSubCategory,
  ChangePassword,
  ContactSearch,
  ContactsList,
  HostelScreen,
  KaryKarniScreen,
  NotificationScreen,
  SuggestionScreen,
  UpdateProfile
} from './index';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="ContactSearch" component={ContactSearch} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      
      <Stack.Screen name="HostelScreen" component={HostelScreen} />
      <Stack.Screen name="KaryKarniScreen" component={KaryKarniScreen} />
      <Stack.Screen name="BusinessCategory" component={BusinessCategory} />
      <Stack.Screen name="AllBusinessCategory" component={AllBusinessCategory} />
      <Stack.Screen name="BusinessSubCategory" component={BusinessSubCategory} />
      <Stack.Screen name="ContactsList" component={ContactsList} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="SuggestionScreen" component={SuggestionScreen} />
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      <Stack.Screen name="AddContact" component={AddContact} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      
    </Stack.Navigator>
  );
};

export default MainStack;
