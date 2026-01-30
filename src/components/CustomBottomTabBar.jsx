import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  useTheme,
  DeviceSize,
  FontSizes,
  TextStyles,
  Fonts,
} from '../theme/theme';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

// 🔹 Internal spacing
const HORIZONTAL_PADDING = DeviceSize.wp(4);
const ICON_LABEL_GAP = DeviceSize.wp(2);
const MIN_INACTIVE_WIDTH = DeviceSize.wp(11); // icon-only safe size

const CustomBottomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme(); // ✅ theme-aware

  return (
    <View style={[styles.wrapper, { paddingBottom: insets.bottom }]}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;

          const widthAnim = useRef(
            new Animated.Value(MIN_INACTIVE_WIDTH)
          ).current;

          const [iconWidth, setIconWidth] = useState(0);
          const [labelWidth, setLabelWidth] = useState(0);

          // 🔹 Auto-calculated width
          const activeWidth =
            iconWidth +
            (isFocused ? labelWidth + ICON_LABEL_GAP : 0) +
            HORIZONTAL_PADDING * 2;

          useEffect(() => {
            Animated.spring(widthAnim, {
              toValue: isFocused ? activeWidth : MIN_INACTIVE_WIDTH,
              useNativeDriver: false,
              speed: 14,
              bounciness: 6,
            }).start();
          }, [isFocused, iconWidth, labelWidth]);

          const onPress = () => {
            if (!isFocused) {
              navigation.navigate(route.name);
            }
          };

          return (
            <AnimatedTouchable
              key={route.key}
              activeOpacity={0.9}
              onPress={onPress}
              style={[
                styles.tabItem,
                {
                  width: widthAnim,
                  backgroundColor: isFocused
                    ? colors.accent
                    : 'transparent',
                },
              ]}
            >
              {/* 🔹 Icon wrapper (measure icon width) */}
              <View
                onLayout={(e) =>
                  setIconWidth(e.nativeEvent.layout.width)
                }
              >
                {options.tabBarIcon({
                  color: isFocused
                    ? '#FFFFFF'
                    : colors.textSecondary,
                })}
              </View>

              {/* 🔹 Label (only when focused) */}
              {isFocused && (
                <Text
                  style={[
                    styles.activeLabel,
                    { color: '#FFFFFF' },
                  ]}
                  numberOfLines={1}
                  onLayout={(e) =>
                    setLabelWidth(e.nativeEvent.layout.width)
                  }
                >
                  {options.tabBarLabel}
                </Text>
              )}
            </AnimatedTouchable>
          );
        })}
      </View>
    </View>
  );
};

export default CustomBottomTabBar;

/* =====================================================
   STYLES (THEME-SAFE)
===================================================== */

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
  },

  container: {
    flexDirection: 'row',
    width: '100%',
    paddingVertical: DeviceSize.wp(3),
    paddingHorizontal: DeviceSize.wp(3),
    justifyContent: 'space-around',
    elevation: 10,
  },

  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: DeviceSize.wp(9),
    borderRadius: DeviceSize.wp(8),
    overflow: 'hidden',
  },

  activeLabel: {
    marginLeft: DeviceSize.wp(2),
    // ...TextStyles.caption, // ✅ font from theme.js
    fontSize: FontSizes.xsmall,
    fontFamily: Fonts.quicksand.bold,
  },
});