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
import { fetchTerms } from "../../redux/slices/commonSlice";
import RenderHTML from "react-native-render-html";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
} from "../../theme/theme";

import { SafeAreaView } from "react-native-safe-area-context";

export default function TermScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const { token } = useSelector(state => state.auth);

  const {
    terms,
    termsLoading,
    termsError,
  } = useSelector(state => state.common);

  useEffect(() => {
    if (token) {
      dispatch(fetchTerms({ token }));
    }
  }, [token]);

  const onRefresh = () => {
    if (!token) return;
    dispatch(fetchTerms({ token }));
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <AppHeader title="Terms & Conditions" />

      {termsLoading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : termsError ? (
        <View style={styles.loaderContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            {termsError}
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl
              refreshing={termsLoading}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
         
          <RenderHTML
            contentWidth={width}
            source={{ html: terms }}
            baseStyle={{
              color: colors.textPrimary,
              fontSize: FontSizes.small,
              fontFamily: Fonts.quicksand.medium,
              lineHeight: 20,
            }}
            tagsStyles={{
              h1: {
                fontSize: FontSizes.small,
                fontFamily: Fonts.quicksand.bold,
                color: colors.textPrimary,
                lineHeight: 22,
              },
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

  termsText: {
    // fontFamily: Fonts.quicksand.regular,
    // fontSize: FontSizes.normal,
    lineHeight: 22,
  },

  errorText: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.normal,
  },
});