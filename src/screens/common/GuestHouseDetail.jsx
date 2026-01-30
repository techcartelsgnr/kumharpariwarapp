import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import { ArrowLeft, Phone, MapPin } from "lucide-react-native";

import {
  useTheme,
  Spacing,
  FontSizes,
  Fonts,
  BorderRadius,
  Shadows,
} from "../../theme/theme";

/* =====================================================
   CONSTANTS
===================================================== */

const { width } = Dimensions.get("window");
const IMAGE_HEIGHT = 320;

/* =====================================================
   GUEST HOUSE DETAIL SCREEN
===================================================== */

const GuestHouseDetail = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useTheme();

  const { guestHouse } = route.params;

  const STATUS_BAR_HEIGHT =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
       {/* ✅ STATUS BAR */}
            <StatusBar
              translucent={false}
              backgroundColor={colors.background}
              barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
      <AppHeader title={'Guest House Details'}/>
      {/* ================= HERO IMAGE ================= */}
      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: guestHouse.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE CARD */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
            ]}
          >
            {guestHouse.name}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={16} color={colors.textSecondary} />
            <Text
              style={[
                styles.location,
                { color: colors.textSecondary },
              ]}
            >
              {guestHouse.city}, {guestHouse.state}
            </Text>
          </View>
        </View>

        {/* DESCRIPTION */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textPrimary },
            ]}
          >
            About Guest House
          </Text>

          <Text
            style={[
              styles.description,
              { color: colors.textSecondary },
            ]}
          >
            {guestHouse.desp
              ?.replace(/<[^>]+>/g, "")
              ?.trim()}
          </Text>
        </View>

        {/* CONTACT */}
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text
            style={[
              styles.sectionTitle,
              { color: colors.textPrimary },
            ]}
          >
            Contact Details
          </Text>

          <View style={styles.contactRow}>
            <Phone size={18} color={colors.primary} />
            <Text
              style={[
                styles.contactText,
                { color: colors.textPrimary },
              ]}
            >
              {guestHouse.contact_call}
            </Text>
          </View>

          <View style={styles.contactRow}>
            <MapPin size={18} color={colors.primary} />
            <Text
              style={[
                styles.contactText,
                { color: colors.textPrimary },
              ]}
            >
              {guestHouse.address}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default GuestHouseDetail;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* IMAGE */
  imageWrapper: {
    width,
    height: IMAGE_HEIGHT,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  // overlay: {
  //   ...StyleSheet.absoluteFillObject,
  //   backgroundColor: "rgba(0,0,0,0.35)",
  // },

  backButton: {
    position: "absolute",
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  /* CONTENT */
  scrollContent: {
    padding: Spacing.md,
    paddingBottom: 40,
  },

  card: {
    borderRadius: BorderRadius.large,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadows.small,
  },

  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.large,
    marginBottom: Spacing.xs,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  location: {
    marginLeft: 6,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },

  sectionTitle: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
    marginBottom: Spacing.sm,
  },

  description: {
    fontFamily: Fonts.quicksand.regular,
    fontSize: FontSizes.small,
    lineHeight: 22,
  },

  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },

  contactText: {
    marginLeft: 10,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    flex: 1,
  },
});
