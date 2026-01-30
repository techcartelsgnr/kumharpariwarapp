import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  RefreshControl,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";

import {
  useTheme,
  Fonts,
  FontSizes,
  Spacing,
  BorderRadius,
} from "../../theme/theme";

import { fetchContactsBySubCategory } from "../../redux/slices/mainSlice";

/* =====================================================
   CONTACTS LIST SCREEN
===================================================== */

const ContactsList = ({ route }) => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { subCategory } = route.params;
  const subCategoryId = subCategory?.id;

  const { token } = useSelector(state => state.auth);
  const {
    contacts,
    contactsLoading,
    contactsPagination,
  } = useSelector(state => state.main);

  const { currentPage, lastPage } = contactsPagination;

  /* ============================
     FETCH CONTACTS
  ============================ */
  const loadContacts = (page = 1) => {
    if (!token || !subCategoryId) return;

    dispatch(
      fetchContactsBySubCategory({
        token,
        subCategoryId,
        page,
      })
    );
  };

  useEffect(() => {
    loadContacts(1);
  }, [subCategoryId]);

  /* ============================
     PULL TO REFRESH
  ============================ */
  const onRefresh = useCallback(() => {
    loadContacts(1);
  }, [subCategoryId]);

  /* ============================
     CALL / WHATSAPP
  ============================ */
  const makeCall = (number) => {
    if (!number) return;
    Linking.openURL(`tel:${number}`);
  };

  const openWhatsApp = (number) => {
    if (!number) return;
    Linking.openURL(`https://wa.me/${number}`);
  };

  /* ============================
     PAGINATION UI
  ============================ */
  const renderPagination = () => {
    if (contacts.length === 0 || lastPage <= 1) return null;

    return (
      <View style={styles.pagination}>
        {/* PREV */}
        <TouchableOpacity
          disabled={currentPage === 1}
          onPress={() => loadContacts(currentPage - 1)}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === 1 && styles.disabled,
            ]}
          >
            Prev
          </Text>
        </TouchableOpacity>

        {/* PAGE NUMBERS */}
        {Array.from({ length: lastPage }, (_, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => loadContacts(i + 1)}
            style={[
              styles.pageBtn,
              currentPage === i + 1 && styles.activePage,
            ]}
          >
            <Text
              style={[
                styles.pageNumber,
                currentPage === i + 1 && styles.activeText,
              ]}
            >
              {i + 1}
            </Text>
          </TouchableOpacity>
        ))}

        {/* NEXT */}
        <TouchableOpacity
          disabled={currentPage === lastPage}
          onPress={() => loadContacts(currentPage + 1)}
        >
          <Text
            style={[
              styles.pageText,
              currentPage === lastPage && styles.disabled,
            ]}
          >
            Next
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* HEADER */}
      <AppHeader title={subCategory?.title || "Contacts"} />

      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={contactsLoading}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        {/* EMPTY STATE */}
        {!contactsLoading && contacts.length === 0 && (
          <EmptyState
            title="No contacts found"
            image={require("../../../assets/images/feedback.png")}
          />
        )}

        {/* CONTACTS LIST */}
        {contacts.map(item => (
          <View
            key={item.id}
            style={[
              styles.card,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.divider,
              },
            ]}
          >
            <Image
              source={{ uri: item.image }}
              style={styles.avatar}
            />

            <View style={styles.info}>
              <Text
                style={[
                  styles.name,
                  { color: colors.textPrimary },
                ]}
              >
                {item.name}
              </Text>

              <Text
                style={[
                  styles.designation,
                  { color: colors.textSecondary },
                ]}
              >
                {item.designation}
              </Text>

              <Text
                style={[
                  styles.location,
                  { color: colors.textTertiary },
                ]}
              >
                {item.location}
              </Text>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: colors.primary },
                  ]}
                  onPress={() => makeCall(item.call)}
                >
                  <Text style={styles.actionText}>Call</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    { backgroundColor: "#25D366" },
                  ]}
                  onPress={() => openWhatsApp(item.whatsapp)}
                >
                  <Text style={styles.actionText}>WhatsApp</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* PAGINATION */}
        {renderPagination()}
      </ScrollView>
    </View>
  );
};

export default ContactsList;

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    flexDirection: "row",
    padding: Spacing.md,
    marginHorizontal: Spacing.md,
    marginTop: Spacing.md,
    borderRadius: BorderRadius.large,
    borderWidth: 1,
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: Spacing.md,
  },

  info: {
    flex: 1,
  },

  name: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,
  },

  designation: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 2,
  },

  location: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 2,
  },

  actions: {
    flexDirection: "row",
    marginTop: Spacing.sm,
  },

  actionBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.medium,
    marginRight: 10,
  },

  actionText: {
    color: "#fff",
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },

  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: Spacing.lg,
  },

  pageBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  activePage: {
    backgroundColor: "#000",
  },

  pageText: {
    fontSize: FontSizes.small,
    marginHorizontal: 8,
  },

  pageNumber: {
    fontSize: FontSizes.small,
  },

  activeText: {
    color: "#fff",
  },

  disabled: {
    opacity: 0.4,
  },
});
