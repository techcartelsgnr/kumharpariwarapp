import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';

import {
  useTheme,
  FontSizes,
  TextStyles,
  BorderRadius,
} from '../theme/theme';

const ButtonWithLoader = ({
  isLoading = false,
  text,
  onPress,
  bgColor,              // optional override
  textColor,            // optional override
}) => {
  const { colors } = useTheme();

  const buttonBg = bgColor || colors.primary;
  const buttonText = textColor || '#ffffff';

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={isLoading}
      style={[
        styles.btn,
        {
          backgroundColor: buttonBg,
          opacity: isLoading ? 0.8 : 1,
        },
      ]}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={buttonText} />
      ) : (
        <Text
          style={[
            styles.text,
            { color: buttonText },
          ]}
        >
          {text}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default ButtonWithLoader;

/* ===================== STYLES ===================== */

const styles = StyleSheet.create({
  btn: {
    paddingVertical: 14,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },

  text: {
    ...TextStyles.button,
    fontSize: FontSizes.normal,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});