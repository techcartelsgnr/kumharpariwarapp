import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabRoutes from '../navigation/TabRoutes';
import {
  AddContact,
  AddPostScreen,
  AllBusinessCategory,
  BusinessCategory,
  BusinessSubCategory,
  ChangePassword,
  ContactSearch,
  ContactsList,
  GuestHouseDetail,
  GuestHouseScreen,
  HostelScreen,
  KaryakariniMembers,
  KaryKarniScreen,
  NotificationScreen,
  SuggestionScreen,
  UpdateProfile,
  HostelDetail,
  PostDetail,
} from './index';

const Stack = createNativeStackNavigator();

const MainStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TabRoutes" component={TabRoutes} />
      
      <Stack.Screen name="ContactSearch" component={ContactSearch} />
      <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
      <Stack.Screen name="HostelScreen" component={HostelScreen} />
      <Stack.Screen name="HostelDetail" component={HostelDetail} />
      <Stack.Screen name="GuestHouseScreen" component={GuestHouseScreen} />
      <Stack.Screen name="GuestHouseDetail" component={GuestHouseDetail} />
      
      <Stack.Screen name="BusinessCategory" component={BusinessCategory} />
      <Stack.Screen name="AllBusinessCategory" component={AllBusinessCategory} />
      <Stack.Screen name="BusinessSubCategory" component={BusinessSubCategory} />
      <Stack.Screen name="ContactsList" component={ContactsList} />
      <Stack.Screen name="ChangePassword" component={ChangePassword} />
      <Stack.Screen name="SuggestionScreen" component={SuggestionScreen} />
      <Stack.Screen name="AddPostScreen" component={AddPostScreen} />
      <Stack.Screen name="AddContact" component={AddContact} />
      <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
      <Stack.Screen name="KaryKarniScreen" component={KaryKarniScreen} />
      <Stack.Screen name="KaryakariniMembers" component={KaryakariniMembers} />
      <Stack.Screen name="PostDetail" component={PostDetail} />
      
    </Stack.Navigator>
  );
};

export default MainStack;
