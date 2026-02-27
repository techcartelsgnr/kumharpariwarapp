import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Keyboard,
} from "react-native";

import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Eye, EyeOff, Phone, LockKeyhole, User, Mail, ArrowLeft } from "lucide-react-native";

import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import { getotp } from "../../redux/slices/authSlice";
import commanServices from "../../redux/services/commanServices";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
  DeviceSize
} from "../../theme/theme";

const RegisterScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [pin, setPin] = useState("");
  const [securePin, setSecurePin] = useState(true);
  const [refCode, setRefCode] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔥 EXACT SAME FLOW AS OLD PROJECT
  const handleRegister = async () => {
    if (!name.trim()) {
      Alert.alert("Validation", "Please enter your name");
      return;
    }
    if (mobile.length !== 10) {
      Alert.alert("Validation", "Enter valid mobile number");
      return;
    }
    if (!pin || pin.length < 4) {
      Alert.alert("Validation", "PIN must be at least 4 digits");
      return;
    }

    try {
      setLoading(true);

      // ✅ IMPORTANT PART
      const result = await dispatch(
        getotp({ email, mobile, pin })
      ).unwrap();

      // ✅ NAVIGATE ONLY ON SUCCESS
      if (result?.message === "OTP Sent on Mobile") {
        navigation.navigate("OtpScreen", {
          name,
          email,
          mobile,
          pin,
          refCode,
        });
      } else {
        commanServices.showToast(
          result?.errors || "OTP sending failed"
        );
      }
    } catch (error) {
      console.log("OTP ERROR:", error);
      commanServices.showToast(
        typeof error === "string" ? error : "Something went wrong"
      );
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
       <View style={styles.topBar}>
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  activeOpacity={0.7}
                  style={[
                    styles.backButton,
                    { backgroundColor: colors.cardBackground }
                  ]}
                >
                  <ArrowLeft size={20} color={colors.textPrimary} />
                </TouchableOpacity>
              </View>

      {/* LOGO */}
      <View style={styles.logoWrapper}>
        <View
          style={[
            styles.logoCircle,
            // { backgroundColor: colors.cardBackground },
          ]}
        >
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>
        <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
          Register
        </Text>
      </View>

      {/* FORM */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          },
        ]}
      >
        <InputAuthField
          required
          placeholder="Full Name"
          icon={<User size={18} color={colors.textSecondary} />}
          value={name}
          onChangeText={setName}
        />

        <InputAuthField
          placeholder="Email (optional)"
          keyboardType="email-address"
          icon={<Mail size={18} color={colors.textSecondary} />}
          value={email}
          onChangeText={setEmail}
        />

        <InputAuthField
          required
          placeholder="Mobile Number"
          keyboardType="number-pad"
          icon={<Phone size={18} color={colors.textSecondary} />}
          maxLength={10}
          value={mobile}
          onChangeText={setMobile}
        />

        <InputAuthField
          required
          placeholder="Create PIN"
          keyboardType="number-pad"
          icon={<LockKeyhole size={18} color={colors.textSecondary} />}
          isSecure={securePin}
          maxLength={6}
          value={pin}
          onChangeText={setPin}
          rightIcon={
            securePin ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() => setSecurePin(!securePin)}
        />

        <InputAuthField
          placeholder="Referral Code (optional)"
          value={refCode}
          onChangeText={setRefCode}
        />

        <ButtonWithLoader
          text="Send OTP"
          isLoading={loading}
          onPress={handleRegister}
        />

        <TouchableOpacity
          style={styles.loginWrapper}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.loginText, { color: colors.primary }]}>
            Already have an account? Login
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },
  logoWrapper: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 75,
    left: 20,
    right: 0,
    zIndex: 10,
  },

  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 4,
  },
  logoCircle: {
    width: DeviceSize.hp(20),
    height: DeviceSize.hp(14),
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  logo: {
    width: DeviceSize.hp(14),
    height: DeviceSize.hp(14),
    resizeMode: "contain",
  },
  appTitle: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.large,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },
  loginWrapper: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  loginText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },
});
