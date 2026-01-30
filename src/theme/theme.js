// theme.js
import React, { useState, useEffect } from 'react';
import { Dimensions, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';

/* =====================================================
   COLOR DEFINITIONS
===================================================== */

export const DarkColors = {
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#FF4757',

  primaryGradientStart: '#FF6B6B',
  primaryGradientEnd: '#FFB86B',
  secondaryGradientStart: '#6B7AFF',
  secondaryGradientEnd: '#8E6BFF',

  background: '#1A1A2E',
  cardBackground: '#2E2E4F',
  surface: '#16213E',
  elevated: '#343456',

  textPrimary: '#FFFFFF',
  textWhite: '#fefefe',
  textSecondary: '#CCCCCC',
  textTertiary: '#999999',
  textAccent: '#00D1FF',

  accent: '#00D1FF',
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',
  info: '#3498DB',

  border: 'rgba(255,255,255,0.1)',
  divider: 'rgba(255,255,255,0.05)',
  shadow: 'rgba(0,0,0,0.3)',
};

export const LightColors = {
  primary: '#FF6B6B',
  primaryLight: '#FF8E8E',
  primaryDark: '#FF4757',

  primaryGradientStart: '#FF6B6B',
  primaryGradientEnd: '#FFB86B',
  secondaryGradientStart: '#6B7AFF',
  secondaryGradientEnd: '#8E6BFF',

  background: '#F8F9FA',
  cardBackground: '#FFFFFF',
  surface: '#E9ECEF',
  elevated: '#FFFFFF',

  textPrimary: '#212529',
  textWhite: '#fefefe',
  textSecondary: '#6C757D',
  textTertiary: '#ADB5BD',
  textAccent: '#007BFF',

  accent: '#007BFF',
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  border: 'rgba(0,0,0,0.1)',
  divider: 'rgba(0,0,0,0.05)',
  shadow: 'rgba(0,0,0,0.1)',
};

/* =====================================================
   THEME MANAGER (SINGLE SOURCE)
===================================================== */

class ThemeManager {
  constructor() {
    this.isDarkMode = false; // ✅ ALWAYS START LIGHT
    this.colors = LightColors;
    this.listeners = new Set();
  }

  setTheme(isDark) {
    this.isDarkMode = isDark;
    this.colors = isDark ? DarkColors : LightColors;
    this.notify();
  }

  toggleTheme() {
    this.setTheme(!this.isDarkMode);
  }

  notify() {
    this.listeners.forEach(cb =>
      cb(this.colors, this.isDarkMode)
    );
  }

  addListener(cb) {
    this.listeners.add(cb);
  }

  removeListener(cb) {
    this.listeners.delete(cb);
  }

  getColors() {
    return this.colors;
  }
}

const themeManager = new ThemeManager();

/* =====================================================
   THEME HOOK
===================================================== */

export const useTheme = () => {
  const [state, setState] = useState({
    colors: themeManager.getColors(),
    isDarkMode: themeManager.isDarkMode,
  });

  useEffect(() => {
    const listener = (colors, isDark) => {
      setState({ colors, isDarkMode: isDark });
    };

    themeManager.addListener(listener);
    return () => themeManager.removeListener(listener);
  }, []);

  return {
    ...state,
    toggleTheme: () => themeManager.toggleTheme(),
    setTheme: (isDark) => themeManager.setTheme(isDark),
  };
};

/* =====================================================
   HELPERS
===================================================== */

export const themedColor = (light, dark) =>
  themeManager.isDarkMode ? dark : light;

export const getColors = () => themeManager.getColors();
export const getIsDarkMode = () => themeManager.isDarkMode;
export const toggleTheme = () => themeManager.toggleTheme();
export const setTheme = (isDark) => themeManager.setTheme(isDark);

/* =====================================================
   DESIGN TOKENS
===================================================== */

export const Spacing = {
  xs: 4,
  sm: 8,
  smt: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
};

export const BorderRadius = {
  small: 4,
  medium: 8,
  large: 12,
  xl: 16,
  pill: 100,
};

/* =====================================================
   FONT SIZES (✅ RFValue APPLIED AS REQUESTED)
===================================================== */

// 🔹 Platform font scale
const iosScale = 0.9;      // iOS fonts usually appear bigger
const androidScale = 1;   // Android baseline
const scale = Platform.OS === 'ios' ? iosScale : androidScale;

export const FontSizes = {
  tiny: RFValue(8 * scale),
  nine: RFValue(9 * scale),
  xsmall: RFValue(10 * scale),
  small: RFValue(12 * scale),
  normal: RFValue(14 * scale),
  medium: RFValue(16 * scale),
  large: RFValue(18 * scale),
  xlarge: RFValue(20 * scale),
  xl: RFValue(24 * scale),
  xxl: RFValue(28 * scale),
  title: RFValue(32 * scale),
};

/* =====================================================
   SHADOWS
===================================================== */

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
};

/* =====================================================
   DEVICE SIZE
===================================================== */

const { width, height } = Dimensions.get('window');

export const DeviceSize = {
  width,
  height,
  wp: (percent) => (width * percent) / 100,
  hp: (percent) => (height * percent) / 100,
};


/* =====================================================
   FONT FAMILIES (SINGLE SOURCE OF TRUTH)
===================================================== */

export const Fonts = {
  /* ===============================
     PRIMARY UI FONT – QUICKSAND
  =============================== */
  quicksand: {
    regular: 'Quicksand-Regular',
    medium: 'Quicksand-Medium',
    bold: 'Quicksand-Bold',
    variable: 'Quicksand-VariableFont_wght',
  },

  /* ===============================
     SECONDARY UI FONT – INTER TIGHT
  =============================== */
  inter: {
    regular: 'InterTight-Regular',
    medium: 'InterTight-Medium',
    bold: 'InterTight-Bold',
  },

  /* ===============================
     CONTENT / BODY FONT – NUNITO
  =============================== */
  nunito: {
    regular: 'NunitoSans',
    italic: 'NunitoSans-Italic',
  },

  /* ===============================
     HINDI / DEVANAGARI FONT
  =============================== */
  hindi: {
    regular: 'TiroDevanagariHindi-Regular',
    italic: 'TiroDevanagariHindi-Italic',
  },
};

/* =====================================================
   TEXT STYLES (USE EVERYWHERE)
===================================================== */

export const TextStyles = {
  heading: {
    fontFamily: Fonts.inter.bold,
    fontSize: FontSizes.xlarge,
  },

  subHeading: {
    fontFamily: Fonts.inter.medium,
    fontSize: FontSizes.large,
  },

  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
  },

  body: {
    fontFamily: Fonts.quicksand.regular,
    fontSize: FontSizes.normal,
  },

  caption: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },

  button: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,
  },

  hindi: {
    fontFamily: Fonts.hindi.regular,
    fontSize: FontSizes.medium,
  },
};


/* =====================================================
   UTILITIES
===================================================== */

export const ThemeUtils = {
  adaptive: (light, dark) => themedColor(light, dark),
  withOpacity: (hex, opacity) => {
    const c = hex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16);
    const g = parseInt(c.substring(2, 4), 16);
    const b = parseInt(c.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  },
};

/* =====================================================
   DEFAULT EXPORT
===================================================== */

export default {
  useTheme,
  toggleTheme,
  setTheme,
  themedColor,
  LightColors,
  DarkColors,
  Spacing,
  FontSizes,
  Fonts,
  BorderRadius,
  Shadows,
  TextStyles,
  DeviceSize,
  ThemeUtils,
};