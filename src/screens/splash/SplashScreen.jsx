import React, { useEffect, useRef } from "react";
import {
  View,
  Image,
  StyleSheet,
  Animated,
  StatusBar,
  ImageBackground,
} from "react-native";

import LinearGradient from "react-native-linear-gradient";
import { DeviceSize, useTheme } from "../../theme/theme";

export default function SplashScreen() {
  const { colors } = useTheme();

  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 2.2,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.7,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <>
      <StatusBar hidden />

      <ImageBackground
        source={require("../../../assets/images/splashbg.jpg")}
        style={styles.container}
        resizeMode="cover"
      >
        <View style={styles.centerContainer}>
          {/* 🔵 GRADIENT PULSE */}
          <Animated.View
            style={[
              styles.pulseWrapper,
              {
                transform: [{ scale: scaleAnim }],
                opacity: opacityAnim,
              },
            ]}
          >
            <LinearGradient
              colors={[
                colors.primaryGradientStart,
                colors.primaryGradientEnd,
              ]}
              style={styles.pulseCircle}
            />
          </Animated.View>

          {/* 🔵 LOGO */}
          <View style={styles.logoWrapper}>
            <Image
              source={require("../../../assets/images/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </View>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
  },

  pulseWrapper: {
    position: "absolute",
  },

  pulseCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },

  logoWrapper: {
    width: DeviceSize.wp(30),
    height: DeviceSize.wp(30),
    borderRadius: DeviceSize.wp(15),
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },

  logo: {
    width: DeviceSize.wp(20),
    height: DeviceSize.wp(20),
  },
});
