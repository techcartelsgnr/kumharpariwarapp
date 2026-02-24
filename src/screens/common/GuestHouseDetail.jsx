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
  useWindowDimensions,
  Linking,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppHeader from "../../components/AppHeader";
import { ArrowLeft, Phone, MapPin } from "lucide-react-native";
import RenderHTML from "react-native-render-html";

import {
  useTheme,
  Spacing,
  FontSizes,
  Fonts,
  BorderRadius,
  Shadows,
  DeviceSize
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
  const { width } = useWindowDimensions();

  const { guestHouse } = route.params;

  const STATUS_BAR_HEIGHT =
    Platform.OS === "android" ? StatusBar.currentHeight || 0 : 44;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* ✅ STATUS BAR */}
      <StatusBar
        translucent={false}
        backgroundColor={colors.background}
        barStyle={isDarkMode ? "light-content" : "dark-content"}
      />
      <AppHeader title={'Guest House Details'} />
      {/* ================= CONTENT ================= */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.imageWrapper}>
          <Image
            source={{ uri: guestHouse.image }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
        {/* TITLE CARD */}
        <View
          style={{ marginBottom: 10, }}
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
          <View>
            <Text
              style={[
                styles.contactText,
                { color: colors.textPrimary },
              ]}
            >
              Address :- {guestHouse.address}
            </Text>
          </View>
          <TouchableOpacity style={styles.contactRow} onPress={() => Linking.openURL(`tel:${guestHouse.contact_call}`)}>
            <Phone size={18} color={colors.primary} />
            <Text
              style={[
                styles.callText,
                { color: colors.textPrimary },
              ]}
            >
              {guestHouse.contact_call}
            </Text>
          </TouchableOpacity>
        </View>

        {/* DESCRIPTION */}
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.textPrimary },
          ]}
        >
          About Guest House
        </Text>
        <View
          style={[
            styles.card,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <RenderHTML
            contentWidth={width}
            source={{ html: guestHouse.desp }}
            baseStyle={{
              color: colors.textPrimary,
              fontSize: FontSizes.small,
              backgroundColor: colors.cardBackground,
              lineHeight: 20,
            }}
            tagsStyles={{
              p: {
                fontSize: FontSizes.small,
                fontFamily: Fonts.quicksand.bold,
                color: colors.textPrimary,
                lineHeight: 22,
              },
              b: {
                fontWeight: "800",
              },
              span: {
                fontWeight: "500",
                backgroundColor: colors.card,
              },
              strong: {
                fontWeight: "900",
              },
              i: {
                fontFamily: Fonts.quicksand.medium,
              },
              u: { textDecorationLine: "underline" },
            }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
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
    height: DeviceSize.hp(25),
    marginBottom: 10,
  },

  image: {
    width: "92%",
    height: "100%",
    borderRadius: 10,
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
    // ...Shadows.small,
  },

  title: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,
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
    fontSize: FontSizes.small,
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
    marginTop: Spacing.sm,
  },

  contactText: {
    // marginLeft: 10,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 5,
    flex: 1,
  },
  callText: {
    marginLeft: 6,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    flex: 1,
  },
});
