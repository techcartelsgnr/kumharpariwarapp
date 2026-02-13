import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import AppHeader from '../../components/AppHeader';
import {
  useTheme,
  FontSizes,
  Fonts,
  Spacing,
  BorderRadius,
} from '../../theme/theme';
import { fetchKaryakarini } from '../../redux/slices/mainSlice';

const KaryKarniScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const dispatch = useDispatch();
  const navigation = useNavigation();

  const { token } = useSelector(state => state.auth);
  const {
    karyakarini,
    karyakariniLoading,
    karyakariniError,
  } = useSelector(state => state.main);

  /* =============================
     FETCH DATA
  ============================== */
  useEffect(() => {
    if (token) {
      dispatch(fetchKaryakarini({ token }));
    }
  }, [token]);

  /* =============================
     RENDER ITEM
  ============================== */
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: colors.cardBackground },
      ]}
      onPress={() =>
        navigation.navigate('KaryakariniMembers', {
          karyakariniId: item.id,
          title: item.name,
        })
      }
    >
      <Image
        source={{ uri: item.image }}
        style={styles.avatar}
        onError={() =>
          console.log('❌ Image load failed:', item.image)
        }
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

        {item.mobile ? (
          <Text
            style={[
              styles.text,
              { color: colors.textSecondary },
            ]}
          >
            📞 {item.mobile}
          </Text>
        ) : null}

        {item.email ? (
          <Text
            style={[
              styles.text,
              { color: colors.textSecondary },
            ]}
          >
            ✉️ {item.email}
          </Text>
        ) : null}

        {item.description ? (
          <Text
            style={[
              styles.description,
              { color: colors.textSecondary },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
        ) : null}
      </View>
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

      <AppHeader title="Karyakarini" />

      {/* LOADING */}
      {karyakariniLoading ? (
        <ActivityIndicator
          size="large"
          color={colors.primary}
          style={{ marginTop: Spacing.xl }}
        />
      ) : karyakariniError ? (
        <Text
          style={[
            styles.emptyText,
            { color: colors.error },
          ]}
        >
          {karyakariniError}
        </Text>
      ) : karyakarini.length === 0 ? (
        <Text
          style={[
            styles.emptyText,
            { color: colors.textSecondary },
          ]}
        >
          No members found
        </Text>
      ) : (
        <FlatList
          data={karyakarini}
          keyExtractor={item => String(item.id)}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default KaryKarniScreen;

/* =============================
   STYLES
============================= */
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  list: {
    padding: Spacing.md,
  },

  card: {
    flexDirection: 'row',
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderRadius: BorderRadius.large,
    alignItems: 'center',
  },

  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: Spacing.md,
    backgroundColor: '#ddd',
  },

  info: {
    flex: 1,
  },

  name: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: FontSizes.large,
    marginBottom: 2,
  },

  text: {
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.small,
    marginTop: 2,
  },

  description: {
    fontFamily: Fonts.quicksand.regular,
    fontSize: FontSizes.small,
    marginTop: 4,
  },

  emptyText: {
    marginTop: Spacing.xl,
    textAlign: 'center',
    fontFamily: Fonts.quicksand.medium,
    fontSize: FontSizes.normal,
  },
});
