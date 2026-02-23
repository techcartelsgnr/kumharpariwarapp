import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  TouchableOpacity,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
} from "react-native";

import RNFS from "react-native-fs";
import Share from "react-native-share";
import { useDispatch, useSelector } from "react-redux";

import Header from "../../components/Header";
import BasicSlider from "../../components/Slider";
import BusinessCategory from "../business/BusinessCategory";

import { Download, Share2 } from "lucide-react-native";

/* 🔹 Theme */
import { useTheme, Fonts, FontSizes, Spacing, DeviceSize, BorderRadius } from "../../theme/theme";

/* 🔹 Redux */
import {
  fetchSlider,
  fetchThoughtOfTheDay,
} from "../../redux/slices/commonSlice";
import { fetchBusinessCategories } from "../../redux/slices/mainSlice";

/* =====================================================
   HOME SCREEN
===================================================== */

export default function HomeScreen({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();

  const { token, name } = useSelector((state) => state.auth);
  const { thoughtOfTheDay, thoughtLoading } =
    useSelector((state) => state.common);

  const [refreshing, setRefreshing] = useState(false);

  /* ============================
     INITIAL LOAD
  ============================ */
  useEffect(() => {
    if (token) {
      dispatch(fetchSlider(token));
      dispatch(fetchBusinessCategories(token));
      dispatch(fetchThoughtOfTheDay(token));
    }
  }, [token, dispatch]);

  /* ============================
     PULL TO REFRESH
  ============================ */
  const onRefresh = useCallback(() => {
    if (!token) return;

    setRefreshing(true);

    Promise.all([
      dispatch(fetchSlider(token)),
      dispatch(fetchBusinessCategories(token)),
      dispatch(fetchThoughtOfTheDay(token)),
    ]).finally(() => setRefreshing(false));
  }, [token, dispatch]);

  /* ============================
     IMAGE PERMISSION (ANDROID)
  ============================ */
  const requestImagePermission = async () => {
    if (Platform.OS !== "android") return true;

    try {
      // ✅ Android 13+
      if (Platform.Version >= 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
          {
            title: "Image Permission",
            message: "Allow access to images to download",
            buttonPositive: "Allow",
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }

      // ✅ Android 12 and below
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "Allow access to storage to save image",
          buttonPositive: "Allow",
        }
      );

      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (error) {
      console.log("Permission error:", error);
      return false;
    }
  };

  /* ============================
     DOWNLOAD IMAGE
  ============================ */
  const downloadThoughtImage = async (imageUrl) => {
    if (!imageUrl) return;

    const hasPermission = await requestImagePermission();
    if (!hasPermission) {
      Alert.alert(
        "Permission Denied",
        "Image permission is required to download"
      );
      return;
    }

    try {
      const fileName = `thought_${Date.now()}.jpg`;
      const path =
        Platform.OS === "android"
          ? `${RNFS.DownloadDirectoryPath}/${fileName}`
          : `${RNFS.DocumentDirectoryPath}/${fileName}`;

      await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
      }).promise;

      Alert.alert("Downloaded", "Image saved successfully");
    } catch (error) {
      console.log("Download error:", error);
      Alert.alert("Error", "Download failed");
    }
  };

  /* ============================
     SHARE IMAGE
  ============================ */
  const shareThoughtImage = async (imageUrl) => {
    if (!imageUrl) return;

    try {
      const fileName = `thought_share_${Date.now()}.jpg`;
      const path = `${RNFS.CachesDirectoryPath}/${fileName}`;

      await RNFS.downloadFile({
        fromUrl: imageUrl,
        toFile: path,
      }).promise;

      await Share.open({
        url: `file://${path}`,
        failOnCancel: false,
      });
    } catch (error) {
      console.log("Share error:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={colors.background}
      />

      <Header />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        <View style={{ marginTop: 10, }}>
          <BasicSlider horizontalPadding={10}/>
        </View>

        <View style={{ marginTop: 0, }}>
           <View style={styles.homecontentHeader}>
              <Text style={[styles.homecontentTitle, { color: colors.textPrimary }]}>Categories</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("AllBusinessCategory")}>
                <Text style={[styles.homecontentLink, { color: colors.textPrimary }]}>See all</Text>
              </TouchableOpacity>
            </View>
          <BusinessCategory navigation={navigation} limit={8}/>
        </View>

        <View>
          <Text style={[styles.quotesHeading, { color: colors.textPrimary }]}>आज का सुविचार</Text>
          {/* 🔹 THOUGHT OF THE DAY */}
          {!thoughtLoading && thoughtOfTheDay?.image && (
            <View
              style={[
                styles.thoughtCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.divider,
                },
              ]}
            >
              <Image
                source={{ uri: thoughtOfTheDay.image }}
                style={styles.thoughtImage}
              />

              <View style={styles.thoughtActions}>
                {/* DOWNLOAD */}
                <TouchableOpacity
                  style={styles.actionWrapper}
                  onPress={() => downloadThoughtImage(thoughtOfTheDay.image)}
                >
                  <Text
                    style={[
                      styles.quotesRightText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Download
                  </Text>

                  <View
                    style={[
                      styles.quotesBoxRightSocialBox,
                      { backgroundColor: colors.primaryDark },
                    ]}
                  >
                    <Download size={18} color={colors.textWhite} />
                  </View>
                </TouchableOpacity>

                {/* SHARE */}
                <TouchableOpacity
                  style={[styles.actionWrapper, { marginTop: Spacing.md }]}
                  onPress={() => shareThoughtImage(thoughtOfTheDay.image)}
                >
                  <Text
                    style={[
                      styles.quotesRightText,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Share
                  </Text>

                  <View
                    style={[
                      styles.quotesBoxRightSocialBox,
                      { backgroundColor: colors.primaryDark },
                    ]}
                  >
                    <Share2 size={18} color={colors.textWhite}/>
                  </View>
                </TouchableOpacity>
              </View>




            </View>
          )}
        </View>

      </ScrollView>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 70,
  },

  sliderWrapper: {
    marginTop: 12,
  },

  homecontentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },

  homecontentTitle: {
    fontSize: FontSizes.xsmall,
    fontFamily: Fonts.quicksand.bold,
  },

  homecontentLink: {
    fontSize: FontSizes.xsmall,
    fontFamily: Fonts.quicksand.bold,
  },

  thoughtCard: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: 12,
    borderWidth: 1,
  },
  quotesHeading: {
    marginTop: Spacing.md,
    fontSize: FontSizes.large,
    fontFamily: Fonts.quicksand.bold,
    textAlign: 'center',
  },
  thoughtImage: {
    width: DeviceSize.wp(60),   // 30% of screen width
    height: DeviceSize.hp(24),  // 12% of screen height
    borderRadius: BorderRadius.medium,
  },

  thoughtActions: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  thoughtBtn: {
    paddingVertical: 6,
  },

  thoughtBtnText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },

  quotesRightText: {
    fontFamily: Fonts.quicksand.bold, // or quicksand.medium if preferred
    fontSize: FontSizes.xsmall,
    marginBottom: Spacing.xs,
    textAlign: "center",
  },

  quotesBoxRightSocialBox: {
    padding: Spacing.xs,
    borderRadius: BorderRadius.small,
    width: 40,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },

  actionWrapper: {
    alignItems: "center",
  },

});
