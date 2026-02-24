import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    StatusBar,
    RefreshControl,
    Linking,
    TouchableOpacity
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import AppHeader from '../../components/AppHeader';
import {
    useTheme,
    FontSizes,
    Fonts,
    Spacing,
    BorderRadius,
} from '../../theme/theme';
import { fetchKaryakariniMembers } from '../../redux/slices/mainSlice';

const KaryakariniMembers = ({ route }) => {
    const { colors, isDarkMode } = useTheme();
    const dispatch = useDispatch();
    const { token } = useSelector(state => state.auth);
    const [refreshing, setRefreshing] = useState(false);

    const {
        karyakariniMembers = [],
        karyakariniMembersLoading,
        karyakariniMembersError,
    } = useSelector(state => state.main);

    const { karyakariniId, title } = route.params;

    /* =============================
       FETCH MEMBERS
    ============================== */
    useEffect(() => {
        if (token && karyakariniId) {
            dispatch(
                fetchKaryakariniMembers({
                    token,
                    karyakariniId,
                })
            );
        }
    }, [token, karyakariniId]);


    const onRefresh = () => {
        setRefreshing(true);

        dispatch(
            fetchKaryakariniMembers({
                token,
                karyakariniId,
            })
        ).finally(() => {
            setRefreshing(false);
        });
    };


    /* =============================
       RENDER ITEM
    ============================== */
    const renderItem = ({ item }) => (
        <View
            style={[
                styles.card,
                { backgroundColor: colors.cardBackground },
            ]}
        >
            <Image source={{ uri: item.image }} style={styles.avatar} />

            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.textPrimary }]}>
                    {item.name}
                </Text>

                {item.designation && (
                    <Text
                        style={[
                            styles.designation,
                            { color: colors.primary },
                        ]}
                    >
                        {item.designation}
                    </Text>
                )}

                {item.mobile && (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`tel:${item.mobile}`)}
                    >
                        <Text style={[styles.text, { color: colors.textSecondary }]}>
                            📞 {item.mobile}
                        </Text>
                    </TouchableOpacity>

                )}

                {item.email && (
                    <TouchableOpacity
                        onPress={() => Linking.openURL(`mailto:${item.email}`)}
                    >

                        <Text style={[styles.text, { color: colors.textSecondary }]}>
                            ✉️ {item.email}
                        </Text>
                    </TouchableOpacity>

                )}
            </View>
        </View>
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

            <AppHeader title={title || 'Members'} />

            {karyakariniMembersLoading ? (
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={{ marginTop: Spacing.xl }}
                />
            ) : karyakariniMembersError ? (
                <Text style={[styles.emptyText, { color: colors.error }]}>
                    {karyakariniMembersError}
                </Text>
            ) : karyakariniMembers.length === 0 ? (
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
                    data={karyakariniMembers}
                    keyExtractor={item => String(item.id)}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default KaryakariniMembers;

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
        width: 65,
        height: 65,
        borderRadius: 32,
        marginRight: Spacing.md,
        backgroundColor: '#ddd',
    },

    info: {
        flex: 1,
    },

    name: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.large,
    },

    designation: {
        fontFamily: Fonts.quicksand.medium,
        fontSize: FontSizes.small,
        marginVertical: 2,
    },

    text: {
        fontFamily: Fonts.quicksand.medium,
        fontSize: FontSizes.small,
        marginTop: 2,
    },

    emptyText: {
        marginTop: Spacing.xl,
        textAlign: 'center',
        fontFamily: Fonts.quicksand.medium,
        fontSize: FontSizes.normal,
    },
});
