import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

import {
  useTheme,
  FontSizes,
  BorderRadius,
  Spacing,
  Fonts,
} from "../theme/theme";

const InputAuthField = ({
  label,                // 🔹 Floating label (top)
  placeholder,          // 🔹 Input placeholder
  icon,
  keyboardType,
  firstLabelText,
  onChangeText,
  isSecure,
  value,
  rightIcon,
  onRightIconPress,
  maxLength,
  required = false,     // 🔹 for *
  error,
  editable = true,
}) => {
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={styles.fieldWrapper}>
      {/* 🔹 TOP LABEL */}
      {label && (
        <Text
          style={[
            styles.label,
            { color: colors.textSecondary },
          ]}
        >
          {label}
          {required && (
            <Text style={{ color: colors.error }}> *</Text>
          )}
        </Text>
      )}

      {/* 🔹 INPUT CONTAINER */}
      <View
        style={[
          styles.container,
          {
            backgroundColor: editable
              ? (isDarkMode ? colors.surface : colors.cardBackground)
              : colors.divider,     // ✅ DIFFERENT BG
            borderColor: error
              ? colors.error
              : colors.divider,
          },
        ]}
      >
        {/* LEFT ICON */}
        {icon && <View style={styles.iconWrap}>{icon}</View>}

        {/* PREFIX TEXT (e.g. +91) */}
        {firstLabelText && (
          <Text
            style={[
              styles.prefixText,
              { color: colors.textSecondary },
            ]}
          >
            {firstLabelText}
          </Text>
        )}

        {/* INPUT */}
        <TextInput
          placeholder={placeholder}
          placeholderTextColor={colors.textTertiary}
          keyboardType={keyboardType}
          secureTextEntry={isSecure}
          onChangeText={onChangeText}
          editable={editable}
          maxLength={maxLength}
          value={value}
          style={[
            styles.input,
            { color: colors.textPrimary },
          ]}
        />

        {/* RIGHT ICON (EYE) */}
        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            style={styles.iconWrapper}
            activeOpacity={0.7}
          >
            {rightIcon}
          </TouchableOpacity>
        )}
      </View>
      {error && (
        <Text style={[styles.errorText]}>
          {error}
        </Text>
      )}
    </View>
  );
};

export default InputAuthField;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  fieldWrapper: {
    marginBottom: Spacing.smt,
  },

  label: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    marginBottom: 5,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: '#fefefe',
    borderRadius: BorderRadius.large, // 🔥 rounded like screenshot
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
  },

  iconWrap: {
    marginRight: 8,
  },

  prefixText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    marginRight: 6,
  },

  input: {
    flex: 1,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    paddingVertical: 0,
  },

  iconWrapper: {
    paddingLeft: 10,
  },
  errorText: {
    marginTop: 4,
    color: '#E74C3C',
    fontSize: FontSizes.xsmall,
    fontFamily: Fonts.quicksand.medium,
  },
});
