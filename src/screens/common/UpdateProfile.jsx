import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  Platform,
  StatusBar,
  KeyboardAvoidingView,
} from "react-native";

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Phone, User, Mail, Pencil } from "lucide-react-native";
import * as ImagePicker from "react-native-image-picker";

import { useDispatch, useSelector } from "react-redux";

import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import AppHeader from "../../components/AppHeader";

import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

import { updateProfilePic } from "../../redux/slices/authSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Dropdown } from "react-native-element-dropdown";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

export default function UpdateProfile() {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { colors, isDarkMode } = useTheme();

  /* ✅ CORRECT SELECTOR */
  const { token, mobile, name, email, pending, image } = useSelector(
    (state) => state.auth
  );

  const cities = useSelector((state) => state.main?.cities ?? []);

  const [imageInfo, setImageInfo] = useState(null);
  const [imageUri, setImageUri] = useState(null);

  const [alternateNumber, setAlternateNumber] = useState("");
  const [gotra, setGotra] = useState("");
  const [address, setAddress] = useState("");
  const [stateValue, setStateValue] = useState("");
  const [city, setCity] = useState("");

  /* ✅ ERROR STATES */
  const [cityError, setCityError] = useState("");
  const [stateError, setStateError] = useState("");
  const [addressError, setAddressError] = useState("");

  const cityOptions = cities.map((c) => ({
    label: c.city,
    value: c.id,
  }));

  /* =============================
     IMAGE PICKER
  ============================= */
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      includeBase64: false,
    });

    if (result.assets?.length > 0) {
      const pickedImage = result.assets[0];

      setImageUri(pickedImage.uri);

      setImageInfo({
        uri:
          Platform.OS === "ios"
            ? pickedImage.uri.replace("file://", "")
            : pickedImage.uri,
        type: pickedImage.type || "image/jpeg",
        name: pickedImage.fileName || `photo_${Date.now()}.jpg`,
      });
    }
  };

  /* =============================
     VALIDATION
  ============================= */
  const isValid = () => {
    setCityError("");
    setStateError("");
    setAddressError("");

    if (!city) {
      setCityError("Please select city");
      return false;
    }

    if (!stateValue) {
      setStateError("Please select state");
      return false;
    }

    if (!address) {
      setAddressError("Please enter address");
      return false;
    }

    return true;
  };

  /* =============================
     UPDATE PROFILE
  ============================= */
  const handleUpdateProfile = async () => {
    if (!isValid()) return;

    const formData = new FormData();

    formData.append("alternate_number", alternateNumber);
    formData.append("gotra", gotra);
    formData.append("address", address);
    formData.append("state", stateValue);
    formData.append("city", city);

    if (imageInfo) {
      formData.append("image", imageInfo);
    }

    try {
      const res = await dispatch(
        updateProfilePic({ token, formData })
      ).unwrap();

      if (res.status_code === 200) {
        Toast.show({ text1: res.message, type: "success" });
        navigation.goBack();
      } else {
        Toast.show({ text1: res.message, type: "error" });
      }
    } catch (error) {
      Toast.show({ text1: "Update failed", type: "error" });
    }
  };

  /* =============================
     LOAD SAVED PROFILE
  ============================= */
  const getProfilePic = async () => {
    try {
      const userInfo = await AsyncStorage.getItem("userInfo");

      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        const user = parsed?.user || {};

        if (user?.image) setImageUri(user.image);

        setAddress(user.address || "");
        setAlternateNumber(user.alternate_number || "");
        setCity(user.city || "");
        setGotra(user.gotra || "");
        setStateValue(user.state || "");
      }
    } catch (error) { }
  };

  useFocusEffect(
    useCallback(() => {
      getProfilePic();
    }, [])
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAvoidingView>
        <StatusBar
          backgroundColor={colors.background}
          barStyle={isDarkMode ? "light-content" : "dark-content"}
        />
        {/* HEADER */}
        <AppHeader title="Update Profile" />
        <ScrollView contentContainerStyle={{ padding: Spacing.lg }}>

          {/* PROFILE IMAGE */}
          <View style={styles.profile}>
            {/* <TouchableOpacity onPress={handleImagePick}>
            <View style={styles.avatarWrapper}>
              {imageUri ? (
                <Image source={{ uri: imageUri || image }} style={styles.avatar} />
              ) : (
                <View
                  style={[
                    styles.avatar,
                    { backgroundColor: colors.surface },
                  ]}
                />
              )}
            </View>
          </TouchableOpacity> */}
            <View>
              <View style={styles.avatarWrapper}>
                {imageUri ? (
                  /* ✅ NEWLY PICKED IMAGE (PREVIEW) */
                  <Image source={{ uri: imageUri }} style={styles.avatar} />
                ) : image ? (
                  /* ✅ REDUX PROFILE IMAGE */
                  <Image source={{ uri: image }} style={styles.avatar} />
                ) : (
                  /* ✅ FALLBACK */
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: colors.surface },
                    ]}
                  />
                )}

                <TouchableOpacity
                  style={[
                    styles.editButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={handleImagePick}
                >
                  <Pencil size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* READ ONLY FIELDS */}
          <InputAuthField
            label="Name"
            value={name}
            icon={<User size={18} color={colors.textSecondary} />}
            editable={false}
          />

          <InputAuthField
            label="Email"
            value={email}
            icon={<Mail size={18} color={colors.textSecondary} />}
            editable={false}
          />

          <InputAuthField
            label="Mobile"
            value={mobile}
            icon={<Phone size={18} color={colors.textSecondary} />}
            editable={false}
          />

          {/* STATE */}
          <Dropdown
            style={[
              styles.dropdown,
              { backgroundColor: colors.cardBackground },
            ]}
            data={[{ label: "Rajasthan", value: "Rajasthan" }]}
            labelField="label"
            valueField="value"
            placeholder="Select State"
            value={stateValue}
            onChange={(item) => {
              setStateValue(item.value);
              setStateError("");
            }}
            containerStyle={{
              backgroundColor: colors.surface,
              borderRadius: BorderRadius.large,
              borderColor: colors.divider,
              borderWidth: 1,
            }}
            placeholderStyle={{
              fontFamily: Fonts.quicksand.bold,
              fontSize: FontSizes.small,
              color: colors.textTertiary,
            }}
            selectedTextStyle={{
              fontFamily: Fonts.quicksand.bold,
              fontSize: FontSizes.small,
              color: colors.textPrimary,
            }}
            itemTextStyle={{
              fontFamily: Fonts.quicksand.bold,
              fontSize: FontSizes.small,
              color: colors.textPrimary,
            }}
          />
          {stateError ? <Text style={styles.error}>{stateError}</Text> : null}

          {/* CITY */}
          <Dropdown
            style={[
              styles.dropdown,
              { backgroundColor: colors.cardBackground },
            ]}
            data={cityOptions}
            labelField="label"
            valueField="value"
            placeholder="Select City"
            value={city}
            onChange={(item) => {
              setCity(item.value);
              setCityError("");
            }}
            // containerStyle={{
            //   backgroundColor: colors.surface,
            //   borderRadius: BorderRadius.large,
            //   borderColor: colors.divider,
            //   borderWidth: 1,
            // }}
            placeholderStyle={{
              fontFamily: Fonts.quicksand.bold,
              fontSize: FontSizes.small,
              color: colors.textTertiary,
            }}
            selectedTextStyle={{
              fontFamily: Fonts.quicksand.bold,
              fontSize: FontSizes.small,
              color: colors.textPrimary,
            }}
            itemTextStyle={{
              fontFamily: Fonts.quicksand.bold,
              fontSize: FontSizes.small,
              color: colors.textPrimary,
            }}
          />
          {cityError ? <Text style={styles.error}>{cityError}</Text> : null}

          {/* EDITABLE FIELDS */}
          <InputAuthField
            label="Alternate Number"
            keyboardType="number-pad"
            value={alternateNumber}
            onChangeText={setAlternateNumber}
            maxLength={10}
          />

          <InputAuthField
            label="Gotra"
            value={gotra}
            onChangeText={setGotra}
          />

          <InputAuthField
            label="Address"
            value={address}
            onChangeText={(text) => {
              setAddress(text);
              // setAddressError("");
            }}
            error={addressError}
          />

          {/* BUTTON */}
          <ButtonWithLoader
            text="Save Changes"
            isLoading={pending}
            onPress={handleUpdateProfile}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/* =============================
   STYLES
============================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 20,
  },

  profile: {
    alignItems: "center",
    marginBottom: Spacing.lg,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: "relative",
  },
  editButton: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },

  dropdown: {
    height: 50,
    borderRadius: BorderRadius.large,
    padding: 14,
    marginBottom: 6,
  },

  error: {
    color: "#E74C3C",
    fontSize: FontSizes.xsmall,
    marginBottom: 8,
    fontFamily: Fonts.quicksand.medium,
  },
});