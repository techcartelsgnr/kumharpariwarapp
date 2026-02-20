import React, { useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    ActivityIndicator,
    TouchableOpacity,
    Linking,
    StatusBar,
} from "react-native";

import { useDispatch, useSelector } from "react-redux";
import { fetchHostelById } from "../../redux/slices/mainSlice";


import AppHeader from "../../components/AppHeader";
import { useTheme, FontSizes, BorderRadius } from "../../theme/theme";

const HostelDetail = ({ route }) => {
    const dispatch = useDispatch();
    const { hostelId } = route.params;
    const { token } = useSelector(state => state.auth);

    const { colors } = useTheme();

    const {
        hostelDetails,
        hostelLoading,
        hostelError,
    } = useSelector((state) => state.main);

    const hostel = hostelDetails?.[0];

    useEffect(() => {
        if (!token) return;

        dispatch(fetchHostelById({ token, id: hostelId }));

    }, [token]);


    // ✅ Actions
    const handleCall = () => {
        if (!hostel?.contactCall) return;
        Linking.openURL(`tel:${hostel.contactCall}`);
    };

    const handleWhatsapp = () => {
        if (!hostel?.contactWhatsapp) return;
        Linking.openURL(`https://wa.me/${hostel.contactWhatsapp}`);
    };

    // ✅ Loader
    if (hostelLoading) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    // ✅ Error State
    if (hostelError) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textPrimary }}>
                    {hostelError}
                </Text>
            </View>
        );
    }

    // ✅ Empty State
    if (!hostel) {
        return (
            <View style={[styles.center, { backgroundColor: colors.background }]}>
                <Text style={{ color: colors.textPrimary }}>
                    Hostel not found
                </Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <StatusBar barStyle="dark-content" />

            {/* ✅ Header */}
            <AppHeader title="Hostel Details" />

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* ✅ Image */}
                <Image
                    source={{ uri: hostel.image }}
                    style={styles.image}
                />

                {/* ✅ Content */}
                <View style={styles.content}>
                    <Text
                        style={[
                            styles.title,
                            { color: colors.textPrimary, fontSize: FontSizes.large },
                        ]}
                    >
                        {hostel.name}
                    </Text>

                    <Text
                        style={[
                            styles.address,
                            { color: colors.textSecondary },
                        ]}
                    >
                        📍 {hostel.address}
                    </Text>

                    {/* ✅ Contact Card */}
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.card,
                                borderRadius: BorderRadius.medium,
                            },
                        ]}
                    >
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Contact Person
                        </Text>

                        <Text style={[styles.value, { color: colors.textPrimary }]}>
                            {hostel.contactPerson}
                        </Text>
                    </View>

                    {/* ✅ Buttons */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    backgroundColor: colors.primary,
                                    borderRadius: BorderRadius.medium,
                                },
                            ]}
                            onPress={handleCall}
                        >
                            <Text style={styles.buttonText}>Call</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.button,
                                {
                                    backgroundColor: colors.success,
                                    borderRadius: BorderRadius.medium,
                                },
                            ]}
                            onPress={handleWhatsapp}
                        >
                            <Text style={styles.buttonText}>WhatsApp</Text>
                        </TouchableOpacity>
                    </View>

                    {/* ✅ Description */}
                    <View
                        style={[
                            styles.card,
                            {
                                backgroundColor: colors.card,
                                borderRadius: BorderRadius.medium,
                            },
                        ]}
                    >
                        <Text style={[styles.label, { color: colors.textSecondary }]}>
                            Description
                        </Text>

                        <Text style={[styles.value, { color: colors.textPrimary }]}>
                            {hostel.description?.replace(/<[^>]*>/g, "")}
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
};

export default HostelDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 220,
    },
    content: {
        padding: 16,
    },
    title: {
        fontWeight: "600",
        marginBottom: 6,
    },
    address: {
        marginBottom: 16,
    },
    card: {
        padding: 14,
        marginBottom: 14,
    },
    label: {
        fontSize: 13,
        marginBottom: 4,
    },
    value: {
        fontSize: 15,
        fontWeight: "500",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 14,
    },
    button: {
        flex: 0.48,
        padding: 12,
        alignItems: "center",
    },
    buttonText: {
        color: "#FFF",
        fontWeight: "600",
    },
});
