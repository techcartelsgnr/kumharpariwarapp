import React, { useRef, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  View,
  Animated,
  Image,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { fetchSlider } from '../redux/slices/commonSlice';
import { useTheme, DeviceSize, BorderRadius } from '../theme/theme';

export default function BasicSlider({ horizontalPadding = 0 }) {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { token } = useSelector(state => state.auth);
  const { sliderImages, sliderLoading } =
    useSelector(state => state.common);

  const scrollX = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  /* ======================================
     📐 DEVICE SIZE
  ====================================== */
  const SLIDER_WIDTH =
    DeviceSize.width - horizontalPadding * 2;
  const SLIDER_HEIGHT = DeviceSize.hp(23);

  /* ======================================
     🔥 FETCH SLIDER (REDUX)
  ====================================== */
  useEffect(() => {
    if (token && sliderImages.length === 0) {
      dispatch(fetchSlider(token));
    }
  }, [token]);

  /* ======================================
     🔥 AUTO SCROLL
  ====================================== */
  useEffect(() => {
    if (sliderImages.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex =
        (currentIndex + 1) % sliderImages.length;

      scrollViewRef.current?.scrollTo({
        x: nextIndex * SLIDER_WIDTH,
        animated: true,
      });

      setCurrentIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIndex, sliderImages.length]);

  /* ======================================
     🔥 MANUAL SCROLL
  ====================================== */
  const handleScrollEnd = (e) => {
    const index = Math.round(
      e.nativeEvent.contentOffset.x / SLIDER_WIDTH
    );
    setCurrentIndex(index);
  };

  if (sliderLoading || !sliderImages.length) return null;

  return (
    <>
      <View
        style={{
          height: SLIDER_HEIGHT,
          paddingHorizontal: horizontalPadding,
        }}
      >
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScrollEnd}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {sliderImages.map(item => (
            <View key={item.id} style={{ width: SLIDER_WIDTH }}>
              <Image
                source={{ uri: item.img }}
                style={[
                  styles.card,
                  { height: SLIDER_HEIGHT },
                ]}
              />
            </View>
          ))}
        </ScrollView>
      </View>

      {/* DOTS */}
      <View style={styles.indicatorContainer}>
        {sliderImages.map((_, index) => {
          const width = scrollX.interpolate({
            inputRange: [
              SLIDER_WIDTH * (index - 1),
              SLIDER_WIDTH * index,
              SLIDER_WIDTH * (index + 1),
            ],
            outputRange: [8, 18, 8],
            extrapolate: 'clamp',
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  width,
                  backgroundColor: colors.primary,
                },
              ]}
            />
          );
        })}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '100%',
    esizeMode: "contain",
    borderRadius: BorderRadius.large, // ✅ ADD THIS
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
