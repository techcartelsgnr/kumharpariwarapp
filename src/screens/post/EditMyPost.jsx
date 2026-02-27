import React, { useEffect, useState } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Text,
  SafeAreaView,
  Platform,
} from "react-native";

import * as ImagePicker from "react-native-image-picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import { Pencil } from "lucide-react-native";

import {
  useTheme,
  Spacing,
  FontSizes,
  Fonts,
  BorderRadius,
} from "../../theme/theme";

import AppHeader from "../../components/AppHeader";
import ButtonWithLoader from "../../components/ButtonWithLoader";

import { updateNewsByUserSlice } from "../../redux/slices/commonSlice";

export default function EditMyPost() {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();

  const { news } = route.params;
  const { token } = useSelector((state) => state.auth);
  const { updateNewsLoading } = useSelector((state) => state.common);

  const { colors } = useTheme();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [previewUri, setPreviewUri] = useState(null);

  useEffect(() => {
    if (news) {
      setTitle(news.title || "");
      setDescription(news.desp || "");
      setPreviewUri(news.image || null);
    }
  }, [news]);

  /* ===============================
     PICK IMAGE
  =============================== */
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibrary({
      mediaType: "photo",
      includeBase64: false,
    });

    if (result.assets && result.assets.length > 0) {
      const asset = result.assets[0];

      const imageData = {
        uri:
          Platform.OS === "ios"
            ? asset.uri.replace("file://", "")
            : asset.uri,
        type: asset.type || "image/jpeg",
        name: asset.fileName || `news_${Date.now()}.jpg`,
      };

      setImage(imageData);
      setPreviewUri(asset.uri);
    }
  };

  /* ===============================
     SUBMIT UPDATE
  =============================== */
  const handleUpdate = async () => {
    const response = await dispatch(
      updateNewsByUserSlice({
        token,
        news_id: news.id,
        title,
        desp: description,
        image,
      })
    );

    if (response.meta.requestStatus === "fulfilled") {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <AppHeader title="Edit Post" />

      <ScrollView contentContainerStyle={{ padding: Spacing.md }}>
        {/* TITLE */}
        <Text style={[styles.label, { color: colors.textPrimary }]}>
          Title
        </Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          multiline
          style={[
            styles.input,
            {
              backgroundColor: colors.cardBackground,
              color: colors.textPrimary,
              borderColor: colors.border,
            },
          ]}
          placeholder="Enter title"
          placeholderTextColor={colors.textTertiary}
        />

        {/* DESCRIPTION */}
        <Text
          style={[
            styles.label,
            { color: colors.textPrimary, marginTop: Spacing.md },
          ]}
        >
          Description
        </Text>
        <TextInput
          value={description}
          onChangeText={setDescription}
          multiline
          style={[
            styles.textArea,
            {
              backgroundColor: colors.cardBackground,
              color: colors.textPrimary,
              borderColor: colors.border,
            },
          ]}
          placeholder="Enter description"
          placeholderTextColor={colors.textTertiary}
        />

        {/* IMAGE */}
        <Text
          style={[
            styles.label,
            { color: colors.textPrimary, marginTop: Spacing.md },
          ]}
        >
          Upload Image
        </Text>

        <TouchableOpacity
          onPress={handleImagePick}
          style={styles.imageWrapper}
        >
          {previewUri ? (
            <Image
              source={{ uri: previewUri }}
              style={styles.image}
            />
          ) : (
            <View
              style={[
                styles.image,
                { backgroundColor: colors.surface },
              ]}
            />
          )}

          <View
            style={[
              styles.imageAction,
              { backgroundColor: colors.primary },
            ]}
          >
            <Pencil size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        {/* BUTTON */}
        <View style={{ marginTop: Spacing.lg }}>
          <ButtonWithLoader
            text="Save Changes"
            loading={updateNewsLoading}
            onPress={handleUpdate}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  label: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
    marginBottom: 6,
  },

  input: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    height: 90,
    textAlignVertical: "top",
    fontFamily: Fonts.quicksand.regular,
  },

  textArea: {
    borderWidth: 1,
    borderRadius: BorderRadius.medium,
    padding: Spacing.sm,
    height: 180,
    textAlignVertical: "top",
    fontFamily: Fonts.quicksand.regular,
  },

  imageWrapper: {
    alignSelf: "center",
    marginTop: Spacing.sm,
  },

  image: {
    width: 220,
    height: 180,
    borderRadius: BorderRadius.medium,
  },

  imageAction: {
    position: "absolute",
    right: -6,
    bottom: -8,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});