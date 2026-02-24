import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Lock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

import commanServices from "../../redux/services/commanServices";
import { resetPassword } from "../../redux/slices/authSlice";

export default function ResetScreen({ route }) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { colors, isDarkMode } = useTheme();

  const { mobile, otp } = route.params;

  const { pending } = useSelector((state) => state.auth);

  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [pinError, setPinError] = useState("");
  const [confirmPinError, setConfirmPinError] = useState("");

  /* =============================
     VALIDATION
  ============================= */
  const isValid = () => {
    setPinError("");
    setConfirmPinError("");

    if (!pin) {
      setPinError("Please enter new PIN");
      return false;
    }

    if (pin.length < 4) {
      setPinError("PIN must be 4 digits");
      return false;
    }

    if (!confirmPin) {
      setConfirmPinError("Please confirm PIN");
      return false;
    }

    if (pin !== confirmPin) {
      setConfirmPinError("PIN does not match");
      return false;
    }

    return true;
  };

  /* =============================
     SUBMIT
  ============================= */
  const handleSubmit = async () => {
    if (!isValid()) return;

    try {
      const res = await dispatch(
        resetPassword({
          mobile,
          otp,
          password: pin,
        })
      ).unwrap();

      if (res?.message === "Password Changed") {
        commanServices.showToast("PIN changed successfully!");
        navigation.replace("LoginScreen");
      }
    } catch (error) {
      commanServices.showToast(error || "Something went wrong");
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

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Reset PIN
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Create your new secure PIN
        </Text>
      </View>

      {/* CARD */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          },
        ]}
      >
        {/* NEW PIN */}
        <InputAuthField
          label="New PIN"
          required
          placeholder="Enter new PIN"
          keyboardType="number-pad"
          isSecure
          maxLength={4}
          icon={<Lock size={18} color={colors.textSecondary} />}
          value={pin}
          onChangeText={(text) => {
            setPin(text);
            setPinError("");
          }}
          error={pinError}
        />

        {/* CONFIRM PIN */}
        <InputAuthField
          label="Confirm PIN"
          required
          placeholder="Re-enter PIN"
          keyboardType="number-pad"
          isSecure
          maxLength={4}
          icon={<Lock size={18} color={colors.textSecondary} />}
          value={confirmPin}
          onChangeText={(text) => {
            setConfirmPin(text);
            setConfirmPinError("");
          }}
          error={confirmPinError}
        />

        {/* SUBMIT BUTTON */}
        <ButtonWithLoader
          text="Submit"
          isLoading={pending}
          onPress={handleSubmit}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

/* =============================
   STYLES
============================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: "center",
  },

  header: {
    marginBottom: Spacing.xl,
    alignItems: "center",
  },

  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.large,
  },

  subtitle: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 4,
  },

  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },
});