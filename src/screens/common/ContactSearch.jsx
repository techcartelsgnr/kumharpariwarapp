import React, { useEffect, useMemo, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { Dropdown } from "react-native-element-dropdown";
import { Briefcase, MapPin, Search } from "lucide-react-native";

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
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
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
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
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

        {/* SEARCH INPUT */}
        <View
          style={[
            styles.searchBox,
            {
              backgroundColor: colors.cardBackground,
              borderColor: colors.border,
            },
          ]}
        >
          <Search size={18} color={colors.textSecondary} />

          <TextInput
            style={[styles.input, { color: colors.textPrimary }]}
            placeholder="Search name or mobile"
            placeholderTextColor={colors.textSecondary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        {/* BUTTON */}
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={handleSearch}
        >
          <Text style={styles.buttonText}>SEARCH NOW</Text>
        </TouchableOpacity>
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
              <Text style={[styles.contactName, { color: colors.textPrimary }]}>
                {item.name}
              </Text>

              <Text style={{ color: colors.textSecondary }}>
                {item.call}
              </Text>

              <Text style={{ color: colors.textSecondary }}>
                {item.designation}
              </Text>
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
  container: { flex: 1 },

  filterWrapper: { padding: Spacing.md },

  dropdown: {
    height: 55,
    borderWidth: 1,
    borderRadius: BorderRadius.large,
    paddingHorizontal: 12,
    marginBottom: Spacing.sm,
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
    marginHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
    padding: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },

  contactName: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
    marginBottom: 4,
  },

  itemText: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.bold,
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
});
