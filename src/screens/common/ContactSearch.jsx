import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Linking,
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import { Briefcase, MapPin, Search, Phone, MessageCircle } from "lucide-react-native";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";

import {
  useTheme,
  Spacing,
  Fonts,
  FontSizes,
  BorderRadius,
  Shadows,
} from "../../theme/theme";

import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";

import {
  fetchBusinessCategories,
  fetchCities,
  fetchSearchResults,      // ✅ NEW SEARCH THUNK
} from "../../redux/slices/mainSlice";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import InputField from "../../components/InputField";

/* =====================================================
   CONTACT SEARCH SCREEN
===================================================== */

export default function ContactSearch() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { token } = useSelector(state => state.auth);

  const {
    businessCategories,
    cities,
    citiesLoading,

    searchResults,          // ✅ FROM REDUX
    searchLoading,
    searchPagination,
  } = useSelector(state => state.main);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [searchText, setSearchText] = useState("");

  /* ===============================
     LOAD INITIAL DATA
  =============================== */
  useEffect(() => {
    if (token) {
      dispatch(fetchBusinessCategories(token));
      dispatch(fetchCities({ token }));
    }
  }, [token]);

  /* ===============================
     DROPDOWN OPTIONS
  =============================== */
  const categoryOptions = useMemo(
    () =>
      businessCategories.map(item => ({
        label: item.name,
        value: item.id,
      })),
    [businessCategories]
  );

  const cityOptions = useMemo(
    () =>
      cities.map(item => ({
        label: item.label,
        value: item.id,     // ✅ IMPORTANT → send city_id
      })),
    [cities]
  );

  /* ===============================
     SEARCH CONTACTS
  =============================== */
  const handleSearch = useCallback(() => {
    dispatch(
      fetchSearchResults({
        token,
        keyword: searchText,
        city_id: selectedCity,
        category_id: selectedCategory,
        page: 1,
      })
    );
  }, [selectedCategory, selectedCity, searchText]);

  /* ===============================
     LOAD MORE (PAGINATION)
  =============================== */
  const loadMore = () => {
    if (!searchPagination) return;

    if (searchPagination.currentPage < searchPagination.lastPage) {
      dispatch(
        fetchSearchResults({
          token,
          keyword: searchText,
          city_id: selectedCity,
          category_id: selectedCategory,
          page: searchPagination.currentPage + 1,
        })
      );
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="Search Contact" />

      <View style={styles.filterWrapper}>
        {/* CATEGORY */}
        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.surface,
            },
          ]}
          data={categoryOptions}
          labelField="label"
          valueField="value"
          placeholder="Business Category"
          value={selectedCategory}
          onChange={item => setSelectedCategory(item.value)}
          renderLeftIcon={() => (
            <Briefcase size={18} color={colors.textSecondary} style={{ marginRight: 5 }} />
          )}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          itemTextStyle={styles.itemText}
          itemContainerStyle={styles.itemContainer}
        />

        {/* CITY */}
        <Dropdown
          style={[
            styles.dropdown,
            {
              backgroundColor: colors.surface,
            },
          ]}
          data={cityOptions}
          labelField="label"
          valueField="value"
          placeholder="Select City"
          value={selectedCity}
          onChange={item => setSelectedCity(item.value)}
          disable={citiesLoading}
          renderLeftIcon={() => (
            <MapPin size={18} color={colors.textSecondary} style={{ marginRight: 5 }} />
          )}
          placeholderStyle={styles.placeholder}
          selectedTextStyle={styles.selectedText}
          itemTextStyle={styles.itemText}
          itemContainerStyle={styles.itemContainer}
        />


        {/* <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Search name or mobile"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          /> */}
        <InputField
          label="Search name or mobile"
          placeholderTextColor={colors.textSecondary}
          value={searchText}
          onChangeText={setSearchText}
          icon={<Search size={18} color={colors.textSecondary} />}

        />


        {/* BUTTON */}

        <ButtonWithLoader text="Search Now" onPress={handleSearch} />
      </View>

      {/* RESULTS */}
      {searchLoading && searchResults.length === 0 ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : (
        <FlatList
          data={searchResults}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ flexGrow: 1 }}
          onEndReached={loadMore}
          onEndReachedThreshold={0.3}

          renderItem={({ item }) => (

            <TouchableOpacity
              style={[
                styles.contactCard,
                {
                  backgroundColor: colors.cardBackground,
                  borderColor: colors.border,
                },
              ]}
              onPress={() =>
                navigation.navigate("ContactDetail", { contact: item })
              }
            >
              {/* LEFT → IMAGE */}
              <Image
                source={{
                  uri: item.image,
                }}
                style={styles.dcontactLeftImage}
              />

              {/* CENTER → DETAILS */}
              <View style={styles.dcontactCenter}>
                <Text style={[styles.contactName, { color: colors.textPrimary }]}>
                  {item.name}
                </Text>

                <Text style={{ color: colors.textSecondary }}>
                  {item.designation}
                </Text>
              </View>

              {/* RIGHT → ACTIONS */}
              <View style={styles.dcontactRightSocial}>

                {/* CALL */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => Linking.openURL(`tel:${item.call}`)}
                >
                  <Phone size={18} color="#FFF" />
                </TouchableOpacity>

                {/* WHATSAPP */}
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: colors.success },
                  ]}
                  onPress={() =>
                    Linking.openURL(`https://wa.me/${item.whatsapp}`)
                  }
                >
                  <MessageCircle size={18} color="#FFF" />
                </TouchableOpacity>

              </View>
            </TouchableOpacity>
          )}

          ListEmptyComponent={
            !searchLoading && (
              <EmptyState
                title="No Record Found"
                image={require("../../../assets/images/feedback.png")}
              />
            )
          }
        />
      )}
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: { flex: 1, paddingBottom: 50, },

  filterWrapper: { padding: Spacing.md },

  dropdown: {
    height: 50,
    // borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: 12,
    marginBottom: Spacing.sm,
    alignItems: 'center',
  },

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: 12,
    marginBottom: Spacing.md,
    height: 55,
  },

  input: {
    flex: 1,
    marginLeft: 10,
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.normal,
  },

  placeholder: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },

  selectedText: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
  },

  button: {
    height: 55,
    borderRadius: BorderRadius.large,
    alignItems: "center",
    justifyContent: "center",
    ...Shadows.medium,
  },

  buttonText: {
    color: "#FFF",
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
  },

  contactCard: {
    flexDirection: "row",              // ✅ ROW LAYOUT
    alignItems: "center",
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },


  contactName: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,
    marginBottom: 4,
  },

  itemText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
  },

  itemContainer: {
    paddingVertical: 5,
    paddingHorizontal: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
  },

  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  dcontactSocialIcon: {

    padding: 5,
    // marginLeft: 8,
    borderRadius: 5,
  },
  dcontactRightSocial: {
    flexDirection: "row",
  },
  dcontactLeftImage: {
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: Spacing.md,
  },
  dcontactCenter: {
    flex: 1,                           // ✅ TAKES AVAILABLE SPACE
  },
  actionButton: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  },
});
