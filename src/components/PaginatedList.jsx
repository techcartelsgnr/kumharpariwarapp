import React, { useEffect, useState } from "react";
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import EmptyState from "./EmptyState";
import { FontSizes, Fonts, useTheme, } from "../theme/theme";

const PaginatedList = ({
  data = [],
  renderItem,
  pageSize = 10,
  keyExtractor,
  emptyTitle = "No Data Found",
}) => {
  const [page, setPage] = useState(1);
  const [visibleData, setVisibleData] = useState([]);

  const { colors } = useTheme();
  const totalPages = Math.ceil(data.length / pageSize);

  /* ============================
     UPDATE PAGE DATA
  ============================ */
  useEffect(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    setVisibleData(data.slice(start, end));
  }, [page, data]);

  /* ============================
     RESET WHEN DATA CHANGES
  ============================ */
  useEffect(() => {
    setPage(1);
  }, [data]);

  /* ============================
     EMPTY STATE
  ============================ */
  if (!data.length) {
    return <EmptyState title={emptyTitle} />;
  }

  /* ============================
     PAGE BUTTON
  ============================ */
  const PageButton = ({ number }) => (
    <TouchableOpacity
      onPress={() => setPage(number)}
      style={[
        styles.pageBtn,
        page === number && styles.activePage,
      ]}
    >
      <Text
        style={[
          styles.pageText,
          { color: colors.textPrimary },
          page === number && styles.activeText,
        ]}
      >
        {number}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* LIST */}
      <FlatList
        data={visibleData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
      />

      {/* PAGINATION */}
      {totalPages > 1 && (
        <View style={styles.pagination}>
          {/* PREVIOUS */}
          <TouchableOpacity
            disabled={page === 1}
            onPress={() => setPage(p => Math.max(1, p - 1))}
          >
            <Text
              style={[
                styles.navText,
                { color: colors.textPrimary },
                page === 1 && styles.disabled,
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>

          {/* PAGE NUMBERS */}
          {Array.from({ length: totalPages }, (_, i) => (
            <PageButton key={i} number={i + 1} />
          ))}

          {/* NEXT */}
          <TouchableOpacity
            disabled={page === totalPages}
            onPress={() =>
              setPage(p => Math.min(totalPages, p + 1))
            }
          >
            <Text
              style={[
                styles.navText,
                { color: colors.textPrimary },
                page === totalPages && styles.disabled,
              ]}
            >
              Next
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default PaginatedList;

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 10,
  },

  pageBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginHorizontal: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  activePage: {
    backgroundColor: "#000",
  },

  pageText: {
    color: "#fff",
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.xsmall,
  },

  activeText: {
    color: "#fff",
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },

  navText: {
    color: "#fff",
    marginHorizontal: 8,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },

  disabled: {
    opacity: 0.4,
    color: "#fff",
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.small,
  },
});
