import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Phone, LockKeyhole } from "lucide-react-native";

import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import { fetchLogin } from "../../redux/slices/authSlice";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
  DeviceSize
} from "../../theme/theme";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { pending, token, error, fcmToken } = useSelector(
    (state) => state.auth
  );

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [securePin, setSecurePin] = useState(true);

  /* ✅ ERROR STATES */
  const [phoneError, setPhoneError] = useState("");
  const [pinError, setPinError] = useState("");

  /* =============================
     🔐 LOGIN HANDLER
  ============================= */
  const handleLogin = () => {
    setPhoneError("");
    setPinError("");

    /* PHONE VALIDATION */
    if (!phone) {
      setPhoneError("Phone number not entered");
      return;
    }

    if (phone.length !== 10) {
      setPhoneError("Phone number is wrong");
      return;
    }

    /* PIN VALIDATION */
    if (!pin) {
      setPinError("PIN not entered");
      return;
    }

    if (pin.length < 4) {
      setPinError("Invalid PIN");
      return;
    }

    dispatch(
      fetchLogin({
        mobile: phone,
        pin: pin,
        fcmToken: fcmToken,
      })
    );
  };

  /* =============================
     ✅ LOGIN SUCCESS
  ============================= */
  useEffect(() => {
    if (token) {
      navigation.replace("Home");
    }
  }, [token]);

  /* =============================
     ❌ BACKEND ERROR
  ============================= */
  // useEffect(() => {
  //   if (error) {
  //     setPinError(error);   // Show backend error under PIN
  //   }
  // }, [error]);

  useEffect(() => {
  if (!error) return;

  const msg = error.toLowerCase();

  const isMobileError =
    msg.includes("mobile") ||
    msg.includes("number") ||
    msg.includes("record") ||
    msg.includes("रिकॉर्ड") ||   // ✅ Hindi backend safe
    msg.includes("नंबर");

  if (isMobileError) {
    setPhoneError(error);   // ✅ Show ONLY under Mobile
    setPinError("");
  } else {
    setPinError(error);     // ✅ Show ONLY under PIN
    setPhoneError("");
  }
}, [error]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <StatusBar
        translucent={false}
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      {/* LOGO */}
      <View style={styles.logoWrapper}>
        <View
          style={[
            styles.logoCircle,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Image
            source={require("../../../assets/images/logo.png")}
            style={styles.logo}
          />
        </View>

        <Text style={[styles.appTitle, { color: colors.textPrimary }]}>
          Kumhar Pariwar
        </Text>
      </View>

      {/* FORM CARD */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          },
        ]}
      >
        {/* PHONE */}
        <InputAuthField
          label="Phone Number"
          required
          placeholder="Phone number"
          keyboardType="number-pad"
          icon={<Phone size={18} color={colors.textSecondary} />}
          maxLength={10}
          value={phone}
          onChangeText={(text) => {
            setPhone(text);
          
          }}
          error={phoneError}
        />

        {/* PIN */}
        <InputAuthField
          label="Enter PIN"
          required
          placeholder="Enter your PIN"
          keyboardType="number-pad"
          icon={<LockKeyhole size={18} color={colors.textSecondary} />}
          isSecure={securePin}
          maxLength={6}
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setPinError("");     // Clear error while typing
          }}
          rightIcon={
            securePin ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() => setSecurePin(!securePin)}
          error={pinError}
        />

        {/* FORGOT PIN */}
        <TouchableOpacity
          style={styles.forgotWrapper}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ForgotScreen")}
        >
          <Lock size={14} color={colors.primary} />
          <Text style={[styles.forgotText, { color: colors.primary }]}>
            Forgot PIN?
          </Text>
        </TouchableOpacity>

        {/* LOGIN BUTTON */}
        <ButtonWithLoader
          text="Login"
          isLoading={pending}
          onPress={handleLogin}
        />
      </View>

      {/* REGISTER */}
      <View style={styles.registerWrapper}>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => navigation.navigate("RegisterScreen")}
        >
          <Text style={[styles.registerText, { color: colors.primary }]}>
            Register Here
          </Text>
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <Text style={[styles.footerText, { color: colors.textSecondary }]}>
        Secure login powered by Kumhar Pariwar
      </Text>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

/* =============================
   STYLES
============================= */
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

  logoCircle: {
    width: DeviceSize.hp(20),
    height: DeviceSize.hp(18),
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
    marginTop: 2,
  },

  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },

  forgotWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: Spacing.md,
  },

  forgotText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    marginLeft: 6,
  },

  registerWrapper: {
    marginTop: Spacing.lg,
    alignItems: "center",
  },

  registerText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },

  footerText: {
    marginTop: Spacing.xl,
    textAlign: "center",
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.xsmall,
  },
});