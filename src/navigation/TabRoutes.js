import { StyleSheet, Image } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { COLORS, DeviceSize } from '../theme/theme';
import CustomBottomTabBar from '../components/CustomBottomTabBar';

import {
  HomeScreen,
  ProfileScreen,
  OurProud,
  ContactSearch,
  PostScreen
} from './index';

const Tab = createBottomTabNavigator();

// -------------------- Bottom Tabs --------------------
export default function TabRoutes() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={(props) => <CustomBottomTabBar {...props} />}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/home.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="OurProud"
        component={OurProud}
        options={{
          tabBarLabel: 'Our Proud',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/proud.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Contacts"
        component={ContactSearch}
        options={{
          tabBarLabel: 'Contacts',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/contact.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Posts"
        component={PostScreen}
        options={{
          tabBarLabel: 'Posts',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/post.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => (
            <Image
              source={require('../../assets/tab/profile.png')}
              style={[styles.icon, { tintColor: color }]}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// -------------------- Styles --------------------
const styles = StyleSheet.create({
  icon: {
    width: DeviceSize.wp(4),
    height: DeviceSize.wp(4),
    resizeMode: 'contain',
  },
});
