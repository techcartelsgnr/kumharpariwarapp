import React, { useEffect, useState, useCallback } from "react";
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    RefreshControl,
    Image,
    TouchableOpacity,
} from "react-native";

import AppHeader from "../../components/AppHeader";
import EmptyState from "../../components/EmptyState";
import { useSelector, useDispatch } from "react-redux";
import mainServices from "../../redux/services/mainServices";
import { SafeAreaView } from "react-native-safe-area-context";

// ✅ THEME IMPORTS (as you asked)
import {
    FontSizes,
    Shadows,
    Fonts,
    BorderRadius,
    useTheme,
} from "../../theme/theme";
import { useNavigation } from "@react-navigation/native";

const HostelScreen = () => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    // 🔐 GET TOKEN FROM AUTH SLICE
    const { token } = useSelector(state => state.auth);
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadHostels();
    }, []);

    const loadHostels = async () => {
        setLoading(true);

        if (!token) {
            setHostels([]);
            setLoading(false);
            return;
        }
        console.log("HOSTEL TOKEN: LN-42-HostelScreen ", token);
        const data = await mainServices.getHostels(token);
        setHostels(data);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);

        // 👇 KEEP YOUR EXISTING CALL HERE
        dispatch(getHostels(token));

        setRefreshing(false);
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.card,
                {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    ...Shadows.light,
                },
            ]}
            onPress={() =>
                navigation.navigate("HostelDetail", {
                    hostelId: item.id,
                })
            }
        >
            {item.image ? (
                <Image
                    source={{ uri: item.image }}
                    style={styles.image}
                    resizeMode="cover"
                />
            ) : null}

            <Text
                style={[
                    styles.title,
                    { color: colors.textPrimary},
                ]}
            >
                {item.name}
            </Text>

            <Text
                style={[
                    styles.address,
                    { color: colors.textSecondary},
                ]}
            >
                {item.address}
            </Text>

            <Text
                style={[
                    styles.contact,
                    { color: colors.textSecondary },
                ]}
            >
                📞 {item.contact_call}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <AppHeader title="Hostels" />
            {loading && (
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    style={{ marginTop: 24 }}
                />
            )}

            {!loading && hostels.length === 0 && (
                <EmptyState
                    title="No Hostels Found"
                    message="Hostel information is not available right now."
                />
            )}

            {!loading && hostels.length > 0 && (
                <FlatList
                    data={hostels}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={{ padding: 16 }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[colors.primary]}
                            tintColor={colors.primary}
                        />
                    }
                />
            )}
        </SafeAreaView>
    );
};

export default HostelScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    card: {
        borderWidth: 1,
        borderRadius: BorderRadius.md,
        padding: 12,
        marginBottom: 14,
    },
    image: {
        width: "100%",
        height: 160,
        borderRadius: BorderRadius.sm,
        marginBottom: 10,
    },
    title: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.quicksand.bold,
        marginBottom: 4,
    },
    address: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.quicksand.bold,
        marginBottom: 4,
    },
    contact: {
        fontSize: FontSizes.small,
        fontFamily: Fonts.quicksand.bold,
    },
});