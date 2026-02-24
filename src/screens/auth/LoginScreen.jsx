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
  Alert,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock, Phone, LockKeyhole } from "lucide-react-native";
import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import { fetchLogin } from "../../redux/slices/authSlice"; // ✅ IMPORTANT
import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

const LoginScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();

  // 🔥 Redux states
  const { pending, token, error, fcmToken } = useSelector(
    (state) => state.auth
  );

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [securePin, setSecurePin] = useState(true);

  // =============================
  // 🔐 LOGIN HANDLER
  // =============================
  const handleLogin = async () => {
    if (phone.length !== 10) {
      Alert.alert("Error", "Please enter valid phone number");
      return;
    }

    if (!pin) {
      Alert.alert("Error", "Please enter PIN");
      return;
    }

    dispatch(
      fetchLogin({
        mobile: phone,
        pin: pin,
        fcmToken: fcmToken, // already stored in redux
      })
    );
  };

  // =============================
  // 🔁 LOGIN SUCCESS LISTENER
  // =============================
  useEffect(() => {
    if (token) {
      Alert.alert("Success", "Login successful");

      // 👉 Navigate after login
      // navigation.replace("Home");
    }
  }, [token]);

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* STATUS BAR */}
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
          onChangeText={setPhone}
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
          isLoading={pending} // 🔥 Redux pending
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
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },

  logo: {
    width: 60,
    height: 60,
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
