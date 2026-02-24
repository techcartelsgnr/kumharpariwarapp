import React, { useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
  RefreshControl,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../components/AppHeader";
import { fetchAbout } from "../../redux/slices/commonSlice";
import RenderHTML from "react-native-render-html";
import EmptyState from "../../components/EmptyState";
import { SafeAreaView } from "react-native-safe-area-context";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
} from "../../theme/theme";

export default function AboutScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const { token } = useSelector(state => state.auth);

  const {
    aboutus,
    aboutusLoading,
    aboutusError,
  } = useSelector(state => state.common);

  useEffect(() => {
    if (token) {
      console.log("About Data =>", aboutus);
      dispatch(fetchAbout({ token }));
    }
  }, [token]);

  const onRefresh = () => {
    if (!token || aboutusLoading) return;
    dispatch(fetchAbout({ token }));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <AppHeader title="About Us" />

      {aboutusLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : aboutusError ? (
        <View style={styles.loaderContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {aboutusError}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={aboutusLoading}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          {/* <Text>{token}</Text> */}
          {aboutus ? (
            <RenderHTML
              contentWidth={width}
              source={{ html: aboutus }}
              baseStyle={{
                color: colors.textPrimary,
                fontSize: FontSizes.small,
                fontFamily: Fonts.quicksand.medium,
                lineHeight: 20,
              }}
              tagsStyles={{
                h1: {
                  fontSize: FontSizes.large,
                  fontFamily: Fonts.quicksand.bold,
                  color: colors.textPrimary,
                  lineHeight: 26,
                  marginBottom: Spacing.sm,
                },
                h2: {
                  fontSize: FontSizes.medium,
                  fontFamily: Fonts.quicksand.bold,
                  color: colors.textPrimary,
                  marginBottom: Spacing.sm,
                },
                p: {
                  fontSize: FontSizes.small,
                  fontFamily: Fonts.quicksand.medium,
                  color: colors.textSecondary,
                  lineHeight: 22,
                  marginBottom: Spacing.sm,
                },
                b: {
                  fontWeight: "800",
                },
                strong: {
                  fontWeight: "900",
                },
                span: {
                  fontWeight: "500",
                },
                i: {
                  fontFamily: Fonts.quicksand.medium,
                },
                u: {
                  textDecorationLine: "underline",
                },
              }}
            />) : (
            <EmptyState title="About information not available" />
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    padding: Spacing.md,
    paddingBottom: Spacing.xxl,
  },

  errorText: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.normal,
  },
});