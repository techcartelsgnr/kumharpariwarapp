import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Text,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { Eye, EyeOff, Lock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";

import AppHeader from "../../components/AppHeader";
import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import { changePassword, logout } from "../../redux/slices/authSlice";
import commanServices from "../../redux/services/commanServices";


import {
  useTheme,
  Spacing,
  FontSizes,
  Fonts,
} from "../../theme/theme";

/* =====================================================
   CHANGE PASSWORD
===================================================== */

const ChangePassword = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { token, changePasswordLoading } =
    useSelector((state) => state.auth);

  /* ===============================
     FORM STATE
  =============================== */
  const [oldPin, setOldPin] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  const [showOldPin, setShowOldPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  const [error, setError] = useState("");

  /* ===============================
     INPUT HANDLERS (4 DIGITS ONLY)
  =============================== */
  const handleOldPin = (text) =>
    setOldPin(text.replace(/[^0-9]/g, ""));

  const handleNewPin = (text) =>
    setNewPin(text.replace(/[^0-9]/g, ""));

  const handleConfirmPin = (text) =>
    setConfirmPin(text.replace(/[^0-9]/g, ""));

  /* ===============================
     SUBMIT
  =============================== */
  const handleChangePassword = async () => {
    setError("");

    if (!oldPin || !newPin || !confirmPin) {
      setError("All fields are required");
      return;
    }

    if (
      oldPin.length !== 4 ||
      newPin.length !== 4 ||
      confirmPin.length !== 4
    ) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    if (newPin !== confirmPin) {
      setError("New PIN and Confirm PIN do not match");
      return;
    }

    const res = await dispatch(
      changePassword({
        token,
        old_pin: oldPin,
        new_pin: newPin,
      })
    );

    if (changePassword.fulfilled.match(res)) {
      commanServices.showToast(
        res.payload?.message || "PIN changed successfully"
      );
      // ✅ AUTO LOGOUT
      dispatch(logout({token}));
    } else {
      setError(res.payload || "Old PIN is incorrect");
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <AppHeader title="Change PIN" />

      <View style={styles.container}>
        {/* OLD PIN */}
        <InputAuthField
          label="Old PIN"
          placeholder="Enter old PIN"
          value={oldPin}
          onChangeText={handleOldPin}
          keyboardType="number-pad"
          maxLength={4}
          isSecure={!showOldPin}
          icon={<Lock size={18} color={colors.textSecondary} />}
          rightIcon={
            showOldPin ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() => setShowOldPin(!showOldPin)}
        />

        {/* NEW PIN */}
        <InputAuthField
          label="New PIN"
          placeholder="Enter new PIN"
          value={newPin}
          onChangeText={handleNewPin}
          keyboardType="number-pad"
          maxLength={4}
          isSecure={!showNewPin}
          icon={<Lock size={18} color={colors.textSecondary} />}
          rightIcon={
            showNewPin ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() => setShowNewPin(!showNewPin)}
        />

        {/* CONFIRM PIN */}
        <InputAuthField
          label="Confirm PIN"
          placeholder="Confirm new PIN"
          value={confirmPin}
          onChangeText={handleConfirmPin}
          keyboardType="number-pad"
          maxLength={4}
          isSecure={!showConfirmPin}
          icon={<Lock size={18} color={colors.textSecondary} />}
          rightIcon={
            showConfirmPin ? (
              <EyeOff size={18} color={colors.textSecondary} />
            ) : (
              <Eye size={18} color={colors.textSecondary} />
            )
          }
          onRightIconPress={() =>
            setShowConfirmPin(!showConfirmPin)
          }
        />

        {/* ERROR */}
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}

        {/* SUBMIT */}
        <View style={{ marginTop: Spacing.lg }}>
          <ButtonWithLoader
            text="Change PIN"
            isLoading={changePasswordLoading}
            onPress={handleChangePassword}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ChangePassword;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    padding: Spacing.lg,
  },

  errorText: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: Spacing.sm,
  },
});
