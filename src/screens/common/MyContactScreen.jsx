import React, { useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
  Linking,
  TouchableOpacity
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { useTheme, Spacing, Fonts, FontSizes } from "../../theme/theme";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";

import { fetchMyContacts } from "../../redux/slices/commonSlice";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MyContactScreen() {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { token } = useSelector((state) => state.auth);

  const {
    contacts,
    contactsLoading,
    contactsPagination,
  } = useSelector((state) => state.common);

  /* ===============================
     INITIAL LOAD
  =============================== */
  useEffect(() => {
    if (token) {
      loadContacts(true);
    }
  }, [token]);

  /* ===============================
     LOAD CONTACTS
  =============================== */
  const loadContacts = (reset = false) => {
    if (!token || contactsLoading) return;

    dispatch(
      fetchMyContacts({
        token,
        page: reset ? 1 : contactsPagination.currentPage,
      })
    );
  };

  /* ===============================
     PULL TO REFRESH
  =============================== */
  const handleRefresh = useCallback(() => {
    loadContacts(true);
  }, []);

  /* ===============================
     INFINITE SCROLL
  =============================== */
  const handleLoadMore = () => {
    if (
      contactsPagination.currentPage <= contactsPagination.total &&
      !contactsLoading
    ) {
      loadContacts(token);
    }
  };

  /* ===============================
     RENDER CONTACT
  =============================== */
  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.cardBackground,
          borderColor: colors.divider,
        },
      ]}
    >
      <View style={styles.row}>
        <Image
          source={{ uri: item.image }}
          style={styles.avatar}
        />

        <View style={{ flex: 1, marginLeft: 10, }}>
          <Text style={[styles.name, { color: colors.textPrimary }]}>
            {item.name}
          </Text>

          {!!item.designation && (
            <Text style={[styles.designation, { color: colors.textSecondary }]}>
              Designation ➟ {item.designation}
            </Text>
          )}

          {!!item.location && (
            <Text style={[styles.location, { color: colors.textSecondary }]}>
              📍 {item.city}
            </Text>
          )}
        </View>
      </View>
      <View style={[styles.divider, { borderColor: colors.divider }]} />
      <View style={styles.rowContact}>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${item.call}`)}>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            📞 {item.call}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() =>
          Linking.openURL(`https://wa.me/${item.whatsapp}`)
        }>
          <Text style={[styles.meta, { color: colors.textSecondary }]}>
            💬 {item.whatsapp}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={[styles.divider, { borderColor: colors.divider }]} />
      <Text style={[styles.category, { color: colors.primary }]}>
        {item.business_categories_name} ➟ {item.business_sub_categories_name}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <AppHeader title="My Contacts" />

      <FlatList
        data={contacts}
        keyExtractor={(item, index) => `${item.id}_${index}`}
        renderItem={renderItem}
        contentContainerStyle={{ padding: Spacing.md, flexGrow: 1 }}

        refreshControl={
          <RefreshControl
            refreshing={contactsLoading}
            onRefresh={handleRefresh}
          />
        }

        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}

        ListEmptyComponent={
          !contactsLoading ? (
            <EmptyState title="No contacts found" />
          ) : null
        }

        ListFooterComponent={
          contactsLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={{ marginVertical: Spacing.md }}
            />
          ) : null
        }
      />
    </SafeAreaView>
  );
}

/* ===============================
   STYLES
=============================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    borderWidth: 1,
    borderRadius: 18,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
  },
  rowContact: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  divider: {
    borderWidth: 1,
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
  },

  topRow: {
    flexDirection: "row",
    marginBottom: Spacing.sm,
  },

  avatarWrapper: {
    marginRight: Spacing.sm,
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 16,
  },

  info: {
    flex: 1,
    justifyContent: "center",
  },

  name: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.medium,
  },

  designation: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 2,
  },

  location: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.xsmall,
    marginTop: 2,
  },

  categoryRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: Spacing.sm,
  },
  category:{
    textAlign: 'center',
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.xsmall,
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    marginBottom: 6,
  },

  badgeText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.xsmall,
  },

  contactRow: {
    borderTopWidth: 1,
    borderTopColor: "#00000010",
    paddingTop: Spacing.sm,
  },

  meta: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
    marginBottom: 2,
  },
});