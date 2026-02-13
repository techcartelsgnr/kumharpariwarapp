import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from "@react-navigation/drawer";

import {
  Home,
  ImageIcon,
  Users,
  Building2,
  Hotel,
  LogOut,
  ChevronRight,
} from "lucide-react-native";


import { DeviceSize, FontSizes, Fonts, useTheme } from "../theme/theme";

import MainStack from "./MainStack";
import {GalleryScreen, GuestHouseDetail, GuestHouseScreen, HostelScreen, KaryakariniMembers, KaryKarniScreen} from "./index";


const Drawer = createDrawerNavigator();

/* =====================================================
   🔹 CUSTOM DRAWER CONTENT
===================================================== */
function CustomDrawerContent(props) {
  const { colors, isDarkMode } = useTheme();
  const currentRoute =
    props.state?.routeNames[props.state.index];

  const drawerBg = isDarkMode
    ? [colors.background, colors.surface]
    : [colors.cardBackground, colors.background];

  return (
    <LinearGradient colors={drawerBg} style={styles.container}>
      <DrawerContentScrollView
        {...props}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View
          style={[
            styles.header,
            { borderBottomColor: colors.divider },
          ]}
        >
          <Image
            source={require("../../assets/images/logo2.png")}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            कुम्हार परिवार
          </Text>
          <Text
            style={[
              styles.subTitle,
              { color: colors.textSecondary },
            ]}
          >
            Welcome to Community
          </Text>
        </View>

        {/* MENU */}
        <View
          style={[
            styles.menuWrapper,
            { borderBottomColor: colors.divider },
          ]}
        >
          <DrawerItem
            label="Home Page"
            route="Home"
            Icon={Home}
            iconColor={colors.primary}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("Home")}
          />

          <DrawerItem
            label="My Contacts"
            route="Contacts"
            Icon={Users}
            iconColor={colors.success}
            activeRoute={currentRoute}
            colors={colors}
          />

          <DrawerItem
            label="Gallery"
            route="GalleryScreen"
            Icon={ImageIcon}
            iconColor={colors.warning}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("GalleryScreen")}
          />

          <DrawerItem
            label="कार्यकारिणी"
            route="Committee"
            Icon={Users}
            iconColor={colors.accent}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("KaryKarniScreen")}
          />

          <DrawerItem
            label="Hostel / छात्रावास"
            route="Hostel"
            Icon={Building2}
            iconColor={colors.info}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("HostelScreen")}
          />

          <DrawerItem
            label="Guest House"
            route="GuestHouse"
            Icon={Hotel}
            iconColor={colors.primaryDark}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("GuestHouseScreen")}
          />
        </View>
      </DrawerContentScrollView>

      {/* LOGOUT */}
      <TouchableOpacity
        style={[
          styles.logoutCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          },
        ]}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Logout
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

/* =====================================================
   🔹 DRAWER ITEM
===================================================== */
const DrawerItem = ({
  label,
  route,
  Icon,
  iconColor,
  onPress,
  activeRoute,
  colors,
}) => {
  const isActive = route === activeRoute;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={[
        styles.item,
        {
          backgroundColor: isActive
            ? colors.primary + "22"
            : colors.cardBackground,
          borderLeftWidth: isActive ? 4 : 0,
          borderLeftColor: colors.primary,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          { backgroundColor: iconColor },
        ]}
      >
        <Icon size={20} color="#fff" />
      </View>

      <Text
        style={[
          styles.itemText,
          {
            color: isActive
              ? colors.primary
              : colors.textPrimary,
          },
        ]}
      >
        {label}
      </Text>

      <ChevronRight
        size={18}
        color={
          isActive ? colors.primary : colors.textSecondary
        }
      />
    </TouchableOpacity>
  );
};

/* =====================================================
   🔹 DRAWER NAVIGATOR (🔥 KEY FIX HERE 🔥)
===================================================== */
export default function DrawerNavigator() {
  const { isDarkMode } = useTheme();

  return (
    <Drawer.Navigator
      key={isDarkMode ? "dark" : "light"} // ✅ FORCE REMOUNT
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: DeviceSize.wp(78),
          backgroundColor: "transparent",
        },
        overlayColor: "transparent",
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
    >
      <Drawer.Screen name="Home" component={MainStack} />
      <Drawer.Screen name="GalleryScreen" component={GalleryScreen} />
      <Drawer.Screen name="GuestHouseScreen" component={GuestHouseScreen} />
      <Drawer.Screen name="HostelScreen" component={HostelScreen} />
      <Drawer.Screen name="KaryKarniScreen" component={KaryKarniScreen} />
      <Drawer.Screen name="KaryakariniMembers" component={KaryakariniMembers} />
    </Drawer.Navigator>
  );
}

/* =====================================================
   🔹 STYLES
===================================================== */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  header: {
    alignItems: "center",
    marginBottom: 25,
    borderBottomWidth: 1,
    paddingBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginBottom: 10,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.large,
  },
  subTitle: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 4,
  },
  menuWrapper: {
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    paddingBottom: 15,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  itemText: {
    flex: 1,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,
  },
  logoutCard: {
    flexDirection: "row",
    alignItems: "center",
    margin: 16,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    marginLeft: 10,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
  },
});
