import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown } from "react-native-element-dropdown";
import * as ImagePicker from "react-native-image-picker";
import { ImagePlus, X } from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import InputAuthField from "../../components/InputAuthField";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import commanServices from "../../redux/services/commanServices";

import {
  fetchBusinessCategories,
  fetchBusinessSubCategories,
} from "../../redux/slices/mainSlice";

import {
  useTheme,
  Spacing,
  Fonts,
  FontSizes,
  BorderRadius,
} from "../../theme/theme";

/* ===============================
   STATIC OPTIONS
================================ */
const genderOptions = [
  { label: "Male", value: "Male" },
  { label: "Female", value: "Female" },
  { label: "Other", value: "Other" },
];

const cityOptions = [
  { label: "Jaipur", value: "Jaipur" },
  { label: "Jodhpur", value: "Jodhpur" },
  { label: "Udaipur", value: "Udaipur" },
  { label: "Bikaner", value: "Bikaner" },
];

const AddContact = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { token } = useSelector(state => state.auth);
  const {
    businessCategories,
    businessSubCategories,
    loadingCategories,
    loadingSubCategories,
  } = useSelector(state => state.main);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    gender: "",
    location: "",
    category: "",
    subcategory: "",
    designation: "",
  });

  const [errors, setErrors] = useState({});
  const [imageUri, setImageUri] = useState(null);
  const [imageMeta, setImageMeta] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ===============================
     LOAD BUSINESS CATEGORIES (SAFE)
  =============================== */
  useEffect(() => {
    if (token) {
      dispatch(fetchBusinessCategories(token));
    }
  }, [dispatch, token]);

  /* ===============================
     MEMOIZED DROPDOWN DATA
  =============================== */
  const categoryOptions = useMemo(
    () =>
      businessCategories.map(item => ({
        label: item.name,
        value: item.id,
      })),
    [businessCategories]
  );

  const subCategoryOptions = useMemo(
    () =>
      businessSubCategories.map(item => ({
        label: item.title,
        value: item.id,
      })),
    [businessSubCategories]
  );

  /* ===============================
     IMAGE PICK
  =============================== */
  const handleImagePick = async () => {
    const res = await ImagePicker.launchImageLibrary({ mediaType: "photo" });

    if (res.assets?.length) {
      const img = res.assets[0];
      setImageUri(img.uri);
      setImageMeta({
        uri: img.uri,
        type: img.type || "image/jpeg",
        name: img.fileName || `contact_${Date.now()}.jpg`,
      });
    }
  };

  /* ===============================
     VALIDATION
  =============================== */
  const validate = () => {
    const e = {};
    Object.keys(form).forEach(key => {
      if (!form[key]) e[key] = `${key} is required`;
    });
    if (!imageMeta) e.image = "Image is required";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  /* ===============================
     SUBMIT
  =============================== */
  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await commanServices.addContact({
        token,
        ...form,
        image: imageMeta,
      });
      commanServices.showToast(res?.message || "Contact added");
      navigation.goBack();
    } catch {
      commanServices.showToast("Failed to add contact");
    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     DROPDOWN RENDER
  =============================== */
  const renderDropdown = ({
    label,
    data,
    value,
    onChange,
    placeholder,
    error,
    loading,
  }) => (
    <View style={{ marginBottom: Spacing.md }}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        {label}
      </Text>

      <Dropdown
        style={[
          styles.dropdown,
          {
            backgroundColor: colors.surface,
            borderColor: error ? colors.error : colors.divider,
          },
        ]}
        containerStyle={{
          backgroundColor: colors.surface,
          borderRadius: BorderRadius.large,
          borderColor: colors.divider,
          borderWidth: 1,
        }}
        itemContainerStyle={{ backgroundColor: colors.surface }}
        activeColor={colors.cardBackground}
        data={data}
        labelField="label"
        valueField="value"
        value={value}
        placeholder={placeholder}
        onChange={item => onChange(item.value)}
        disable={loading}
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

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <AppHeader title="Add Contact" />

      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        <InputAuthField
          label="Name"
          placeholder="Enter name"
          value={form.name}
          onChangeText={t => setForm(prev => ({ ...prev, name: t }))}
        />
        {errors.name && <Text style={styles.error}>{errors.name}</Text>}

        <InputAuthField
          label="Mobile"
          placeholder="Enter mobile"
          keyboardType="number-pad"
          maxLength={10}
          value={form.mobile}
          onChangeText={t => setForm(prev => ({ ...prev, mobile: t }))}
        />
        {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}


        {renderDropdown({
          label: "Gender",
          data: genderOptions,
          value: form.gender,
          placeholder: "Select Gender",
          onChange: item =>
            setForm(prev => ({
              ...prev,
              gender: item?.value ?? item, // ✅ FIX: always store correct value
            })),
          error: errors.gender,
        })}


        {/* {renderDropdown({
          label: "Gender",
          data: genderOptions,
          value: form.gender,
          placeholder: "Select Gender",
          onChange: v => setForm(prev => ({ ...prev, gender: v })),
          error: errors.gender,
        })} */}

        {/* {renderDropdown({
          label: "City",
          data: cityOptions,
          value: form.location,
          placeholder: "Select City",
          onChange: v => setForm(prev => ({ ...prev, location: v })),
          error: errors.location,
        })} */}

        <InputAuthField
          label="City"
          placeholder="Enter city"
          value={form.location}
          onChangeText={text =>
            setForm(prev => ({
              ...prev,
              location: text,
            }))
          }
        />
        {errors.location && (
          <Text style={styles.error}>{errors.location}</Text>
        )}

        {renderDropdown({
          label: "Business Category",
          data: categoryOptions,
          value: form.category,
          placeholder: "Select Category",
          loading: loadingCategories,
          onChange: v => {
            setForm(prev => ({ ...prev, category: v, subcategory: "" }));
            dispatch(fetchBusinessSubCategories({ token, businessId: v }));
          },
          error: errors.category,
        })}

        {renderDropdown({
          label: "Sub Business Category",
          data: subCategoryOptions,
          value: form.subcategory,
          placeholder: form.category ? "Select Sub Category" : "Select Category First",
          loading: loadingSubCategories,
          onChange: v => setForm(prev => ({ ...prev, subcategory: v })),
          error: errors.subcategory,
        })}

        <InputAuthField
          label="Designation"
          placeholder="Enter designation"
          value={form.designation}
          onChangeText={t => setForm(prev => ({ ...prev, designation: t }))}
        />
        {errors.designation && <Text style={styles.error}>{errors.designation}</Text>}

        <Text style={[styles.label, { color: colors.textSecondary }]}>Image *</Text>
        <TouchableOpacity
          style={[styles.imagePicker, { borderColor: colors.divider }]}
          onPress={handleImagePick}
        >
          <ImagePlus size={24} color={colors.textSecondary} />
          <Text style={{ color: colors.textSecondary, marginTop: 4 }}>Select Image</Text>
        </TouchableOpacity>
        {errors.image && <Text style={styles.error}>{errors.image}</Text>}

        {imageUri && (
          <View style={styles.previewWrapper}>
            <Image source={{ uri: imageUri }} style={styles.previewImage} />
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
        )}

        <View style={{ marginTop: Spacing.lg }}>
          <ButtonWithLoader text="Submit" isLoading={loading} onPress={handleSubmit} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddContact;

/* ===============================
   STYLES
================================ */
const styles = StyleSheet.create({
  container: { padding: Spacing.lg },
  label: { fontFamily: Fonts.quicksand.bold, marginBottom: 6 },
  error: { color: "red", fontSize: 12, marginBottom: 6 },
  dropdown: {
    height: 50,
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: 12,
  },
  imagePicker: {
    height: 60,
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
  },
  previewWrapper: { marginTop: Spacing.md },
  previewImage: { width: "100%", height: 180, borderRadius: 12 },
  cancelIcon: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 6,
    borderRadius: 20,
  },
});
