import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Phone, ShieldCheck, ArrowLeft } from "lucide-react-native";
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
  DeviceSize,
} from "../../theme/theme";

import { ResendOtp } from "../../redux/slices/authSlice";

export default function ForgotScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { colors, isDarkMode } = useTheme();
  const { pending } = useSelector((state) => state.auth);

  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [remainingTime, setRemainingTime] = useState(60);
  const [on, setOn] = useState(false);

  const [mobileError, setMobileError] = useState("");
  const [otpError, setOtpError] = useState("");

  /* =============================
     TIMER LOGIC (UNCHANGED)
  ============================= */
  useEffect(() => {
    let intervalId;

    if (on && remainingTime > 0) {
      intervalId = setInterval(() => {
        setRemainingTime((prev) => Math.max(0, prev - 1));
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [on, remainingTime]);

  /* =============================
     GET / RESEND OTP
  ============================= */
  const handleOtpRequest = () => {
    setMobileError("");

    if (!mobile) {
      setMobileError("Please enter mobile number");
      return;
    }

    if (mobile.length !== 10) {
      setMobileError("Enter valid mobile number");
      return;
    }

    setRemainingTime(60);
    setOn(true);

    dispatch(ResendOtp({ mobile }));
  };

  /* =============================
     NEXT
  ============================= */
  const handleNext = () => {
    setOtpError("");

    if (!mobile || !otp) {
      if (!otp) setOtpError("Please enter OTP");
      if (!mobile) setMobileError("Please enter mobile number");
      return;
    }

    navigation.navigate("ResetScreen", {
      mobile,
      otp,
    });
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

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}>
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

          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Forgot PIN
          </Text>

          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            OTP verification required
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
          {/* MOBILE */}
          <InputAuthField
            label="Mobile Number"
            required
            placeholder="Enter mobile number"
            keyboardType="number-pad"
            icon={<Phone size={18} color={colors.textSecondary} />}
            maxLength={10}
            value={mobile}
            onChangeText={(text) => {
              setMobile(text);
              setMobileError("");
            }}
            error={mobileError}
          />

          {/* OTP */}
          <InputAuthField
            label="Enter OTP"
            required
            placeholder="Enter verification code"
            keyboardType="number-pad"
            icon={<ShieldCheck size={18} color={colors.textSecondary} />}
            maxLength={6}
            value={otp}
            onChangeText={(text) => {
              setOtp(text);
              setOtpError("");
            }}
            error={otpError}
            rightIcon={
              <TouchableOpacity
                disabled={on && remainingTime > 0}
                onPress={handleOtpRequest}
              >
                <Text
                  style={{
                    color:
                      on && remainingTime > 0
                        ? colors.textTertiary
                        : colors.primary,
                    fontFamily: Fonts.quicksand.bold,
                    fontSize: FontSizes.small,
                  }}
                >
                  {on && remainingTime > 0
                    ? `${remainingTime}s`
                    : on
                      ? "Resend OTP"
                      : "Get OTP"}
                </Text>
              </TouchableOpacity>
            }
          />

          {/* TIMER TEXT */}
          {remainingTime > 0 && on && (
            <Text style={[styles.timerText, { color: colors.textSecondary }]}>
              Remaining 00:{remainingTime < 10 ? `0${remainingTime}` : remainingTime}
            </Text>
          )}

          {/* BUTTON */}
          <ButtonWithLoader
            text="Next"
            isLoading={pending}
            onPress={handleNext}
          />
        </View>
      </ScrollView>
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
  },

  logoWrapper: {
    alignItems: "center",
    marginBottom: Spacing.xl,
  },
  topBar: {
    position: "absolute",
    top: Platform.OS === "ios" ? 70 : 65,
    left: 0,
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
    height: DeviceSize.hp(15),
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

  timerText: {
    textAlign: "center",
    marginBottom: Spacing.md,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },
});