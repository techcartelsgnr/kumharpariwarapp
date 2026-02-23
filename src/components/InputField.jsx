import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  useTheme,
  FontSizes,
  TextStyles,
  BorderRadius,
  Fonts,
} from '../theme/theme';

const InputField = ({
  label,
  icon,
  keyboardType,
  fieldButtonLabel,
  fieldButtonFunction,
  onChangeText,
  onBlur,
  isSecure,
  maxLength,
  editable = true,
  value,
  flex,
  flexBasis,
  width = '100%',
}) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.wrapper,
        {
          backgroundColor: colors.surface,
          borderColor: colors.divider,
        },
      ]}
    >
      {icon && <View style={styles.iconWrap}>{icon}</View>}

      <TextInput
        placeholder={label}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        secureTextEntry={isSecure}
        onChangeText={onChangeText}
        onBlur={onBlur}
        maxLength={maxLength}
        editable={editable}
        value={value}
        style={[
          styles.input,
          {
            flex: flex || 1,
            flexBasis,
            width,
            color: colors.textPrimary,
          },
        ]}
      />

      {fieldButtonFunction && (
        <TouchableOpacity onPress={fieldButtonFunction}>
          <Text
            style={[
              styles.fieldBtnText,
              { color: colors.accent },
            ]}
          >
            {fieldButtonLabel}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default InputField;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.large,
    paddingHorizontal: 10,
    paddingVertical: 14,
    borderWidth: 1,
    width: '100%',
    marginBottom: 10,
  },

  iconWrap: {
    marginRight: 5,
  },

  input: {
    ...TextStyles.body,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    paddingVertical: 0,
  },

  fieldBtnText: {
    ...TextStyles.caption,
    fontSize: FontSizes.small,
    marginLeft: 8,
  },
});