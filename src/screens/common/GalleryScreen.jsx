import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Dimensions,
  PanResponder,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, ChevronLeft, ChevronRight } from 'lucide-react-native';
import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from '../../theme/theme';
import AppHeader from '../../components/AppHeader';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGallery } from '../../redux/slices/commonSlice';

const { width, height } = Dimensions.get('window');

const GalleryScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  // 🔐 GET TOKEN FROM AUTH SLICE
      const { token } = useSelector(state => state.auth);

  const {
    gallery,
    galleryLoading,
  } = useSelector(state => state.common);

  const [refreshing, setRefreshing] = useState(false);

  // Full screen
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* =============================
     FETCH GALLERY (REDUX)
  ============================== */
  useEffect(() => {
    dispatch(fetchGallery({token}));
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    dispatch(fetchGallery()).finally(() => setRefreshing(false));
  };

  /* =============================
     FULL SCREEN SWIPE
  ============================== */
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > 70 && currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
      } else if (
        gestureState.dx < -70 &&
        currentIndex < gallery.length - 1
      ) {
        setCurrentIndex(prev => prev + 1);
      }
    },
  });

  const openFullScreen = index => {
    setCurrentIndex(index);
    setIsFullScreen(true);
  };

  const closeFullScreen = () => setIsFullScreen(false);

  /* =============================
     RENDER ITEM
  ============================== */
  const renderGalleryItem = ({ item, index }) => (
    <TouchableOpacity
      style={[
        styles.galleryItem,
        index % 3 !== 2 && styles.itemSpacing,
      ]}
      onPress={() => openFullScreen(index)}
    >
      <Image
        source={{ uri: item.img }}
        style={styles.galleryImage}
        onError={() =>
          console.log('❌ Image failed:', item.img)
        }
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      <StatusBar
        backgroundColor={colors.background}
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
      />

      <AppHeader title="Gallery" />

      {/* GRID */}
      {!isFullScreen && (
        <>
          {galleryLoading ? (
            <ActivityIndicator
              size="large"
              color={colors.primary}
              style={{ marginTop: Spacing.xl }}
            />
          ) : gallery.length === 0 ? (
            <Text
              style={[
                styles.emptyText,
                { color: colors.textSecondary },
              ]}
            >
              No images found {token}
            </Text>
          ) : (
            <FlatList
              data={gallery}
              renderItem={renderGalleryItem}
              keyExtractor={item => String(item.id)}
              numColumns={3}
              contentContainerStyle={styles.galleryContainer}
              refreshing={refreshing}
              onRefresh={onRefresh}
              showsVerticalScrollIndicator={false}
            />
          )}
        </>
      )}

      {/* FULL SCREEN */}
      {isFullScreen && (
        <View
          style={[
            styles.fullScreenContainer,
            { backgroundColor: colors.background },
          ]}
          {...panResponder.panHandlers}
        >
          {/* Close */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={closeFullScreen}
          >
            <X size={30} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Image */}
          <Image
            source={{ uri: gallery[currentIndex]?.img }}
            style={styles.fullScreenImage}
          />

          {/* Left */}
          {currentIndex > 0 && (
            <TouchableOpacity
              style={styles.leftNav}
              onPress={() =>
                setCurrentIndex(prev => prev - 1)
              }
            >
              <ChevronLeft size={40} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Right */}
          {currentIndex < gallery.length - 1 && (
            <TouchableOpacity
              style={styles.rightNav}
              onPress={() =>
                setCurrentIndex(prev => prev + 1)
              }
            >
              <ChevronRight size={40} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          {/* Counter */}
          <Text
            style={[
              styles.counter,
              { color: colors.textSecondary },
            ]}
          >
            {currentIndex + 1} / {gallery.length}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default GalleryScreen;

/* =============================
   STYLES
============================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  galleryContainer: {
    padding: Spacing.sm,
  },

  galleryItem: {
    flex: 1,
    margin: Spacing.xs,
    borderRadius: BorderRadius.large,
    overflow: 'hidden',
  },

  itemSpacing: {
    marginRight: Spacing.xs,
  },

  galleryImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },

  emptyText: {
    marginTop: Spacing.xl,
    textAlign: 'center',
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.normal,
  },

  fullScreenContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width,
    height,
    justifyContent: 'center',
    alignItems: 'center',
  },

  fullScreenImage: {
    width,
    height,
    resizeMode: 'contain',
  },

  closeButton: {
    position: 'absolute',
    top: Spacing.xl,
    right: Spacing.lg,
    zIndex: 99,
  },

  leftNav: {
    position: 'absolute',
    left: Spacing.md,
    top: height / 2 - 20,
  },

  rightNav: {
    position: 'absolute',
    right: Spacing.md,
    top: height / 2 - 20,
  },

  counter: {
    position: 'absolute',
    bottom: Spacing.lg,
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.normal,
  },
});
