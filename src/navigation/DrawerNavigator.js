import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
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
  LogOut,
  ChevronRight,
  FileText,
  Info,
} from "lucide-react-native";


import { DeviceSize, FontSizes, Fonts, useTheme } from "../theme/theme";

import MainStack from "./MainStack";
import { AboutScreen, GalleryScreen, TermScreen, } from "./index";
import { logout } from '../redux/slices/authSlice';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useSelector, useDispatch } from "react-redux";
import ButtonWithLoader from "../components/ButtonWithLoader";


const Drawer = createDrawerNavigator();

/* =====================================================
   🔹 CUSTOM DRAWER CONTENT
===================================================== */
function CustomDrawerContent(props) {
  const { colors, isDarkMode } = useTheme();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const handleLogout = async () => {
    await AsyncStorage.setItem('APP_THEME', 'light');
    dispatch(logout({ token }));
  };

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

        contentContainerStyle={styles.scrollContainer}
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
            label="Terms"
            route="TermScreen"
            Icon={FileText}
            iconColor={colors.accent}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("TermScreen")}
          />

          <DrawerItem
            label="About Us"
            route="AboutScreen"
            Icon={Info}
            iconColor={colors.info}
            activeRoute={currentRoute}
            colors={colors}
            onPress={() => props.navigation.navigate("AboutScreen")}
          />


        </View>
         {/* LOGOUT */}
      <TouchableOpacity
        style={[
          styles.logoutCard,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          },
        ]}
        onPress={() => setShowLogoutModal(true)}
      >
        <LogOut size={20} color={colors.error} />
        <Text style={[styles.logoutText, { color: colors.error }]}>
          Logout
        </Text>
      </TouchableOpacity>
      </DrawerContentScrollView>

     

      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalCard,
              { backgroundColor: colors.cardBackground }
            ]}
          >
            <View
              style={[
                styles.modalIconWrapper,
                { backgroundColor: colors.error + "22" }
              ]}
            >
              <LogOut size={28} color={colors.error} />
            </View>

            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Confirm Logout
            </Text>

            <Text style={[styles.modalMessage, { color: colors.textSecondary }]}>
              Are you sure you want to logout?
            </Text>

            <View style={styles.modalButtons}>
              <ButtonWithLoader
                text="Cancel"
                bgColor={colors.divider}
                textColor={colors.textPrimary}
                onPress={() => setShowLogoutModal(false)}
              />

              <ButtonWithLoader
                text="Logout"
                bgColor={colors.error}
                isLoading={false}
                onPress={() => {
                  setShowLogoutModal(false);
                  handleLogout();
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

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
      <Drawer.Screen name="TermScreen" component={TermScreen} />
      <Drawer.Screen name="AboutScreen" component={AboutScreen} />


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
    margin: 10,
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
  },
  logoutText: {
    marginLeft: 10,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },

  modalCard: {
    width: DeviceSize.wp(82),
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },

  modalIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  modalTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.medium,
    marginBottom: 6,
  },

  modalMessage: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    textAlign: "center",
    marginBottom: 20,
  },

  modalButtons: {
    width: "100%",
    gap: 10,
  },
});
