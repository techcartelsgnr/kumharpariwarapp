import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { ImagePlus, X } from "lucide-react-native";
import * as ImagePicker from "react-native-image-picker";

import AppHeader from "../../components/AppHeader";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import commanServices from "../../redux/services/commanServices";

import {
  useTheme,
  Spacing,
  Fonts,
  FontSizes,
  BorderRadius,
  DeviceSize,
} from "../../theme/theme";

/* =====================================================
   ADD POST SCREEN
===================================================== */

const AddPostScreen = () => {
  const navigation = useNavigation();
  const { colors } = useTheme();
  const { token } = useSelector((state) => state.auth);

  // 👇 DEFAULT PREVIEW (fallback)
  const [imageUri, setImageUri] = useState(
    "https://kumharpariwar.com/storage/news/default.png"
  );

  const [imageMeta, setImageMeta] = useState(null); // actual picked image
  const [title, setTitle] = useState("");
  const [desp, setDesp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* ===============================
     IMAGE PICK (YOUR REQUESTED LOGIC)
  =============================== */
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      const pickedImage = result.assets[0];
      const { uri, type, fileName } = pickedImage;

      setImageUri(uri); // preview
      setImageMeta({
        uri,
        type: type || "image/jpeg",
        name: fileName || `photo_${Date.now()}.jpg`,
      });

      console.log("📸 Picked Image:", {
        uri,
        type,
        fileName,
      });
    }
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async () => {
    setError("");

    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    if (!desp.trim()) {
      setError("Description is required");
      return;
    }

    setLoading(true);

    try {
      console.log("📤 Sending Data:");
      console.log("Title:", title);
      console.log("Description:", desp);
      console.log("Image Meta:", imageMeta);

      const res = await commanServices.addNewsByUser({
        token,
        title,
        desp,
        image: imageMeta, // ⬅️ THIS uploads the image
      });

      console.log("✅ API RESPONSE:", res);

      commanServices.showToast(
        res?.message || "Post added successfully"
      );

      navigation.goBack();
    } catch (e) {
      console.log("❌ API ERROR:", e);

      commanServices.showToast(
        e?.response?.data?.message || "Failed to add post"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
    >
      <AppHeader title="Add Post" />

      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* TITLE */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Title
        </Text>

        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter title"
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.input,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.divider,
            },
          ]}
        />

        {/* DESCRIPTION */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Description
        </Text>

        <TextInput
          multiline
          numberOfLines={10}
          value={desp}
          onChangeText={setDesp}
          textAlignVertical="top"
          placeholder="Write description..."
          placeholderTextColor={colors.textTertiary}
          style={[
            styles.textArea,
            {
              backgroundColor: colors.surface,
              color: colors.textPrimary,
              borderColor: colors.divider,
            },
          ]}
        />

        {/* IMAGE */}
        <Text style={[styles.label, { color: colors.textSecondary }]}>
          Image (Optional)
        </Text>

        {/* <TouchableOpacity
          style={[
            styles.imagePicker,
            { borderColor: colors.divider },
          ]}
          onPress={handleImagePick}
        >
          {imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <ImagePlus size={26} color={colors.textSecondary} />
              <Text
                style={[
                  styles.imageText,
                  { color: colors.textSecondary },
                ]}
              >
                Select Image
              </Text>
            </View>
          )}
        </TouchableOpacity> */}

        <TouchableOpacity
          style={[
            styles.imagePicker,
            { borderColor: colors.divider },
          ]}
          onPress={handleImagePick}
        >
          <View style={styles.imagePlaceholder}>
            <ImagePlus size={26} color={colors.textSecondary} />
            <Text
              style={[
                styles.imageText,
                { color: colors.textSecondary },
              ]}
            >
              Select Image
            </Text>
          </View>
        </TouchableOpacity>

        {/* PREVIEW BELOW */}
        {imageMeta?.uri ? (
          <View style={styles.previewWrapper}>
            <Image
              source={{ uri: imageUri }}
              style={styles.previewImage}
            />

            {/* ❌ Cancel icon */}
            <TouchableOpacity
              style={styles.cancelIcon}
              onPress={() => {
                setImageUri(null);
                setImageMeta(null);
              }}
            >
              <X size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : null}

      
        {error ? (
          <Text style={[styles.errorText, { color: colors.error }]}>
            {error}
          </Text>
        ) : null}

         {/* SUBMIT */}
        <View style={{ marginTop: Spacing.md }}>
          <ButtonWithLoader
            text="Submit"
            isLoading={loading}
            onPress={handleSubmit}
          />
        </View>

       
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddPostScreen;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  safeArea: { flex: 1, paddingBottom: 20, },
  container: { padding: Spacing.md },

  label: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    fontFamily: Fonts.quicksand.bold,
  },

  textArea: {
    height: 160,
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    fontFamily: Fonts.baloo?.bold || Fonts.quicksand.bold,
  },

  imagePicker: {
    paddingVertical: Spacing.xm,
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    justifyContent: "center",
    alignItems: "center",
    
  },

  previewImage: {
    width: '100%',
    height: DeviceSize.hp(20),  // 12% of screen height
    borderRadius: BorderRadius.large,
  },

  imagePlaceholder: { alignItems: "center", paddingVertical: Spacing.md, },

  imageText: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },

  previewWrapper: {
   marginTop: Spacing.sm,
  },

  cancelIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 6,
  },


  errorText: {
    fontFamily: Fonts.quicksand.medium,
    marginTop: Spacing.sm,
  },
});
