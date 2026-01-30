import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

import AppHeader from "../../components/AppHeader";
import BusinessCategory from "./BusinessCategory";
import { fetchBusinessCategories } from "../../redux/slices/mainSlice";

import { useTheme } from "../../theme/theme";

export default function AllBusinessCategory({ navigation }) {
  const { colors } = useTheme();
  const dispatch = useDispatch();
  const { token } = useSelector(state => state.auth);

  useEffect(() => {
    if (token) {
      dispatch(fetchBusinessCategories(token));
    }
  }, [token]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="All Categories" />

      <View style={styles.container}>
        <BusinessCategory navigation={navigation} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 10,
  },
});
