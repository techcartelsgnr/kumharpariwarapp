import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Switch, // ✅ NEW
  Modal,
} from "react-native";

import {
  UserPlus,
  PlusSquare,
  Lock,
  MessageSquare,
  ChevronRight,
  Edit3,
  Moon, // ✅ optional icon
  Users,
  Building2,
  Hotel,
  LogOut,
  Contact,
} from "lucide-react-native";

import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { logout } from '../../redux/slices/authSlice';
import { SafeAreaView } from "react-native-safe-area-context";

import AppHeader from "../../components/AppHeader";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
  DeviceSize,
} from "../../theme/theme";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ButtonWithLoader from "../../components/ButtonWithLoader";

/* =====================================================
   PROFILE SCREEN
===================================================== */

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const dispatch = useDispatch();

  // ✅ get toggleTheme also
  const { colors, isDarkMode, toggleTheme } = useTheme();

  const { name, mobile, token, image } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await AsyncStorage.setItem('APP_THEME', 'light');
    dispatch(logout({ token }));
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ STATUS BAR */}
      <StatusBar
        translucent={false}
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      {/* 🔹 HEADER */}
      <AppHeader title="My Profile" />

      <ScrollView
        contentContainerStyle={styles.scrollv}
        showsVerticalScrollIndicator={false}
      >
        {/* =====================================================
    🔹 PROFILE CARD (UPDATED LAYOUT)
===================================================== */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.divider,
            },
          ]}
        >
          {/* LEFT: AVATAR */}
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: image }}
              style={styles.avatar}
            />

            <TouchableOpacity
              style={[
                styles.editButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => navigation.navigate("UpdateProfile")}
            >
              <Edit3 size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* RIGHT: USER INFO */}
          <View style={styles.profileInfo}>
            <Text
              style={[styles.userName, { color: colors.textPrimary }]}
              numberOfLines={1}
            >
              {name}
            </Text>

            <Text
              style={[styles.userPhone, { color: colors.textSecondary }]}
              numberOfLines={1}
            >
              {mobile}
            </Text>
          </View>
        </View>

        <View style={styles.scroll}>


          {/* =====================================================
            🔹 OPTIONS
        ===================================================== */}
          <Text
            style={[styles.sectionTitle, { color: colors.textSecondary }]}
          >
            MORE OPTIONS
          </Text>

          <OptionItem
            icon={<UserPlus size={20} color="#8F87F1" />}
            label="Add Contact to Directory"
            onPress={() => navigation.navigate("AddContact")}
            colors={colors}
          />

          <OptionItem
            icon={<Contact size={20} color="#0ABAB5" />}
            label="My Contacts"
            onPress={() => navigation.navigate("MyContactScreen")}
            colors={colors}
          />

          <OptionItem
            icon={<PlusSquare size={20} color="#F4B400" />}
            label="Add Post"
            onPress={() => navigation.navigate("AddPostScreen")}
            colors={colors}
          />

           <OptionItem
            icon={<PlusSquare size={20} color="#F4B400" />}
            label="My Post"
            onPress={() => navigation.navigate("MyPostScreen")}
            colors={colors}
          />

          <OptionItem
            icon={<Lock size={20} color="#3B82F6" />}
            label="Change Password"
            onPress={() => navigation.navigate("ChangePassword")}
            colors={colors}
          />

          <OptionItem
            icon={<MessageSquare size={20} color="#9333EA" />}
            label="Suggestion Box"
            onPress={() => navigation.navigate("SuggestionScreen")}
            colors={colors}
          />
          <OptionItem
            icon={<Users size={20} color="#0ABAB5" />}
            label="कार्यकारिणी"
            onPress={() => navigation.navigate("KaryKarniScreen")}
            colors={colors}
          />

          <OptionItem
            icon={<Building2 size={20} color="#FF4757" />}
            label="Hostel / छात्रावास"
            onPress={() => navigation.navigate("HostelScreen")}
            colors={colors}
          />
          <OptionItem
            icon={<Hotel size={20} color="#28A745" />}
            label="Guest House"
            onPress={() => navigation.navigate("GuestHouseScreen")}
            colors={colors}
          />

          {/* =====================================================
            🔹 THEME SWITCH (NEW)
        ===================================================== */}
          <View
            style={[
              styles.themeRow,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
              },
            ]}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconCircle}>
                <Moon size={20} color={colors.primary} />
              </View>
              <Text
                style={[styles.optionText, { color: colors.textPrimary }]}
              >
                {isDarkMode ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              thumbColor={colors.primary}
              trackColor={{
                false: colors.divider,
                true: colors.primary + "55",
              }}
            />
          </View>

          <View style={styles.logoutBox}>
            <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
              <Text style={[styles.logoutText, { color: colors.textTertiary }]}>Logout</Text>
            </TouchableOpacity>
          </View>

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

          {/* =====================================================
            🔹 FOOTER
        ===================================================== */}
          <Text
            style={[styles.footerText, { color: colors.textTertiary }]}
          >
            Developed by ❤️ TechCartel
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

/* =====================================================
   OPTION ITEM COMPONENT
===================================================== */

const OptionItem = ({ icon, label, onPress, colors }) => {
  return (
    <TouchableOpacity
      style={[
        styles.optionItem,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.divider,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={styles.optionLeft}>
        <View style={styles.iconCircle}>{icon}</View>
        <Text style={[styles.optionText, { color: colors.textPrimary }]}>
          {label}
        </Text>
      </View>

      <ChevronRight size={18} color={colors.textSecondary} style={{ marginRight: 5, }} />
    </TouchableOpacity>
  );
};

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 70, },

  scroll: { padding: Spacing.md },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: Spacing.lg,
    borderBottomRightRadius: BorderRadius.pill,
    marginBottom: Spacing.xs,
  },

  avatarWrapper: {
    position: "relative",
    marginRight: Spacing.md,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },

  editButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  profileInfo: {
    flex: 1,
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },

  userName: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.medium,
  },

  userPhone: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.normal,
    marginTop: 4,
  },


  sectionTitle: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    // marginBottom: Spacing.md,
  },

  optionItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    marginTop: Spacing.smt,
  },

  /* ✅ reused for theme row */
  themeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: Spacing.sm,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
    marginTop: Spacing.md,
  },

  optionLeft: { flexDirection: "row", alignItems: "center" },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.xs,
  },

  optionText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },

  footerText: {
    textAlign: "center",
    marginTop: Spacing.md,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },
  logoutText: {
    textAlign: "center",
    marginTop: Spacing.sm,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
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
