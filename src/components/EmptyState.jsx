import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { AlertCircle } from "lucide-react-native";

import {
  FontSizes,
  DeviceSize,
  useTheme,
} from "../theme/theme";



/* =====================================================
   EMPTY STATE (SIMPLE)
===================================================== */

const EmptyState = ({
  icon: Icon = AlertCircle,
  image = null,
  title = "No Data Found",
  style,
}) => {
  const { colors } = useTheme();
  const ICON_SIZE = DeviceSize.wp(16);

  return (
    <View style={[styles.container, style]}>
      {image ? (
        <Image
          source={image}
          style={styles.emptyImage}
          resizeMode="contain"
        />
      ) : (
        <Icon size={ICON_SIZE} color={colors.textSecondary} />
      )}

      <Text
        style={[
          styles.text,
          { color: colors.textSecondary },
        ]}
      >
        {title}
      </Text>
    </View>
  );
};

export default EmptyState;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    
  },
  emptyImage: {
    width: DeviceSize.wp(22),
    height: DeviceSize.wp(22),
    marginBottom: DeviceSize.hp(1.5),
  },

  text: {
    fontSize: FontSizes.small,
    textAlign: "center",
  },
});
