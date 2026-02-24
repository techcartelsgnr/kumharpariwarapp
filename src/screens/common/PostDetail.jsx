import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  RefreshControl,
  useWindowDimensions,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import { useTheme, FontSizes, BorderRadius, Fonts, DeviceSize, Spacing } from "../../theme/theme";
import RenderHTML from "react-native-render-html";
import { SafeAreaView } from "react-native-safe-area-context";


/* =====================================================
   POST DETAIL SCREEN
===================================================== */

export default function PostDetail({ route }) {
  const { colors } = useTheme();
  const { post } = route.params;
  const { width } = useWindowDimensions();

  const [refreshing, setRefreshing] = useState(false);

  // const cleanDescription = post.description?.replace(/<[^>]*>/g, "");
  const description = post.description || "";


  // ✅ Pull To Refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // Simulate refresh (since no API call)
    setTimeout(() => {
      setRefreshing(false);
    }, 800);

  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* ✅ Header */}
      <AppHeader title="Post Details" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}     // Android
            tintColor={colors.primary}    // iOS
          />
        }
      >
        {/* ✅ Image */}
        <Image source={{ uri: post.image }} style={styles.image} />

        {/* ✅ Content */}
        <View style={styles.content}>
          <Text
            style={[
              styles.title,
              {
                color: colors.textPrimary,
                fontSize: FontSizes.large,
              },
            ]}
          >
            {post.title}
          </Text>

          <Text
            style={[
              styles.date,
              { color: colors.textSecondary },
            ]}
          >
            {post.createdDate}
          </Text>

          {/* ✅ Description Card */}
          <View
            style={[
              styles.background,
              {
                backgroundColor: colors.background,
                borderRadius: BorderRadius.medium,
              },
            ]}
          >

            <RenderHTML
              contentWidth={width}
              source={{ html: post.description }}
              baseStyle={{
                color: colors.textPrimary,
                fontSize: FontSizes.small,
                backgroundColor: colors.background,
                lineHeight: 20,
              }}
              tagsStyles={{
                p: {
                  fontSize: FontSizes.small,
                  fontFamily: Fonts.quicksand.bold,
                  color: colors.textPrimary,
                  lineHeight: 22,
                },
                b: {
                  fontWeight: "800",
                },
                span: {
                  fontWeight: "500",
                  backgroundColor: colors.card,
                },
                strong: {
                  fontWeight: "900",
                },
                i: {
                  fontFamily: Fonts.quicksand.medium,
                },
                u: { textDecorationLine: "underline" },
              }}
            />
            {/* <Text
              style={[
                styles.description,
                { color: colors.textPrimary },
              ]}
            >
              {cleanDescription}
            </Text> */}
          </View>
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

  image: {
   width: DeviceSize.width,          // ✅ full screen width
  height: DeviceSize.hp(26),        // ✅ responsive height
  resizeMode: "cover",
  },

  content: {
    padding: Spacing.md,
  },

  title: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.bold,
    marginBottom: Spacing.xs,
  },

  date: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
    marginBottom: Spacing.smt,
  },

  card: {
    padding: Spacing.sm,
  },

  description: {
    fontSize: FontSizes.small,
    fontFamily: Fonts.quicksand.medium,
    lineHeight: 22,
  },
});







// import React, { useEffect, useState } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   Image,
//   ScrollView,
//   ActivityIndicator,
//   StatusBar,
// } from "react-native";

// import { useSelector } from "react-redux";

// import AppHeader from "../../components/AppHeader";
// import EmptyState from "../../components/EmptyState";
// import { useTheme, FontSizes, BorderRadius } from "../../theme/theme";
// import { getNewsDetail } from "../../services/mainServices";

// export default function PostDetail({ route }) {
//   const { colors } = useTheme();

//   const { newsId } = route.params;
//   const { token } = useSelector(state => state.auth);

//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch News Detail
//   const fetchPostDetail = async () => {
//     try {
//       const { news } = await getNewsDetail(token, newsId);
//       setPost(news?.[0] || null);
//     } catch (err) {
//       setError("Unable to load post");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) return;
//     fetchPostDetail();
//   }, [token]);

//   // ✅ Loader
//   if (loading) {
//     return (
//       <View style={[styles.center, { backgroundColor: colors.background }]}>
//         <ActivityIndicator size="large" color={colors.primary} />
//       </View>
//     );
//   }

//   // ✅ Error State
//   if (error) {
//     return (
//       <View style={[styles.center, { backgroundColor: colors.background }]}>
//         <Text style={{ color: colors.textPrimary }}>{error}</Text>
//       </View>
//     );
//   }

//   // ✅ Empty State
//   if (!post) {
//     return (
//       <View style={[styles.center, { backgroundColor: colors.background }]}>
//         <EmptyState
//           title="Post not found"
//           image={require("../../../assets/images/feedback.png")}
//         />
//       </View>
//     );
//   }

//   return (
//     <View style={[styles.container, { backgroundColor: colors.background }]}>
//       <StatusBar barStyle="dark-content" />

//       {/* ✅ Header */}
//       <AppHeader title="Post Details" />

//       <ScrollView showsVerticalScrollIndicator={false}>
//         {/* ✅ Image */}
//         <Image source={{ uri: post.image }} style={styles.image} />

//         {/* ✅ Content */}
//         <View style={styles.content}>
//           <Text
//             style={[
//               styles.title,
//               { color: colors.textPrimary, fontSize: FontSizes.large },
//             ]}
//           >
//             {post.title}
//           </Text>

//           <Text
//             style={[
//               styles.date,
//               { color: colors.textSecondary },
//             ]}
//           >
//             {post.createdDate}
//           </Text>

//           <View
//             style={[
//               styles.card,
//               {
//                 backgroundColor: colors.card,
//                 borderRadius: BorderRadius.medium,
//               },
//             ]}
//           >
//             <Text
//               style={[
//                 styles.description,
//                 { color: colors.textPrimary },
//               ]}
//             >
//               {post.description.replace(/<[^>]*>/g, "")}
//             </Text>
//           </View>
//         </View>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },

//   center: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },

//   image: {
//     width: "100%",
//     height: 220,
//   },

//   content: {
//     padding: 16,
//   },

//   title: {
//     fontWeight: "600",
//     marginBottom: 6,
//   },

//   date: {
//     fontSize: 13,
//     marginBottom: 14,
//   },

//   card: {
//     padding: 14,
//   },

//   description: {
//     fontSize: 15,
//     lineHeight: 22,
//   },
// });
