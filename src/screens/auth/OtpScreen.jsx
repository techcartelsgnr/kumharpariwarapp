import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Keyboard,
  TouchableOpacity,
} from "react-native";

import { useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { LockKeyhole } from "lucide-react-native";

import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import { register, ResendOtp } from "../../redux/slices/authSlice";
import commanServices from "../../redux/services/commanServices";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

const OtpScreen = () => {
  const route = useRoute();
  const { name, email, mobile, pin, refCode } = route.params;


  const dispatch = useDispatch();
  const { colors, isDarkMode } = useTheme();



  const [otp, setOtp] = useState("");
  const [remainingTime, setRemainingTime] = useState(60);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleVerify = async () => {
    if (!otp) {
      commanServices.showToast("OTP cannot be empty ✋");
      return;
    }

    try {
      setLoading(true);
console.log('line number 56 -- otpscreen', name, email, mobile, pin, refCode, otp );
      // ✅ SAME AS OLD PROJECT
    dispatch(
        register({
          name,
          email,
          mobile,
          pin,
          refCode,
          otp,
          fcmToken: 'none',
        })
      );
    } catch (e) {
      commanServices.showToast("Verification failed");
    } finally {
      setLoading(false);
      Keyboard.dismiss();
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />

      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBackground,
            borderColor: colors.divider,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.textPrimary }]}>
          Verify OTP
        </Text>

        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          OTP sent to +91 {mobile}
        </Text>

        <InputAuthField
          label="Enter OTP"
          required
          placeholder="4-digit OTP"
          keyboardType="number-pad"
          icon={<LockKeyhole size={18} color={colors.textSecondary} />}
          maxLength={4}
          value={otp}
          onChangeText={setOtp}
        />

        <ButtonWithLoader
          text="Verify & Continue"
          isLoading={loading}
          onPress={handleVerify}
        />

        <View style={styles.resendWrapper}>
          {remainingTime > 0 ? (
            <Text style={{ color: colors.textSecondary }}>
              Resend OTP in {remainingTime}s
            </Text>
          ) : (
            <TouchableOpacity
              onPress={() => {
                setRemainingTime(60);
                dispatch(ResendOtp({ mobile }));
              }}
            >
              <Text style={[styles.resendText, { color: colors.primary }]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default OtpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  card: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },
  title: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.large,
    textAlign: "center",
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  resendWrapper: {
    marginTop: Spacing.md,
    alignItems: "center",
  },
  resendText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },
});
