import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import AppHeader from "../../components/AppHeader";
import ButtonWithLoader from "../../components/ButtonWithLoader";
import { submitSuggestion } from "../../redux/slices/authSlice";
import {
    useTheme,
    Spacing,
    Fonts,
    FontSizes,
    BorderRadius,
} from "../../theme/theme";

/* =========================
   STATIC OPTIONS
========================= */

const suggestionOptions = [
    { id: 1, name: "App Related Issue" },
    { id: 2, name: "New Feature Suggestion" },
    { id: 3, name: "New Contact Addition" },
];

const SuggestionScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const { colors, isDarkMode } = useTheme();

    const { token, suggestionLoading } = useSelector(
        (state) => state.auth
    );

    const [serviceType, setServiceType] = useState(null);
    const [suggestionText, setSuggestionText] = useState("");
    const [error, setError] = useState("");

    /* =========================
       SUBMIT HANDLER
    ========================= */

    const handleSubmit = async () => {
        setError("");

        if (!serviceType) {
            setError("Please select suggestion type");
            return;
        }

        if (!suggestionText.trim()) {
            setError("Please enter your suggestion");
            return;
        }

        const res = await dispatch(
            submitSuggestion({
                token,
                service_type: serviceType.name,
                suggestion: suggestionText,
            })
        );

        if (submitSuggestion.fulfilled.match(res)) {
            // ✅ toast is already handled globally
            navigation.goBack(); // ⬅️ GO BACK AFTER SUCCESS
        } else {
            setError(res.payload || "Failed to submit suggestion");
        }
    };

    return (
        <SafeAreaView
            style={[styles.safeArea, { backgroundColor: colors.background }]}
        >
            <AppHeader title="Suggestions" />

            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* DROPDOWN */}
                <Text
                    style={[
                        styles.label,
                        { color: colors.textSecondary },
                    ]}
                >
                    Suggestion Type
                </Text>

                <Dropdown
                    style={[
                        styles.dropdown,
                        {
                            backgroundColor: isDarkMode
                                ? colors.surface
                                : colors.cardBackground,
                            borderColor: colors.divider,
                        },
                    ]}
                    placeholderStyle={[
                        styles.placeholderStyle,
                        { color: colors.textTertiary },
                    ]}
                    selectedTextStyle={[
                        styles.selectedTextStyle,
                        { color: colors.textPrimary },
                    ]}
                    data={suggestionOptions}
                    maxHeight={200}
                    labelField="name"
                    valueField="id"
                    placeholder="Select suggestion type"
                    value={serviceType?.id}
                    onChange={(item) => setServiceType(item)}
                />

                {/* TEXT INPUT */}
                <TextInput
                    multiline
                    numberOfLines={15}
                    placeholder="Description"
                    placeholderTextColor={colors.textTertiary}
                    value={suggestionText}
                    onChangeText={setSuggestionText}
                    keyboardType="default"
                    style={[
                        styles.textArea,
                        {
                            backgroundColor: colors.surface,
                            color: colors.textPrimary,
                            borderColor: colors.divider,
                        },
                    ]}
                    textAlignVertical="top"
                />

                {/* ERROR */}
                {error ? (
                    <Text
                        style={[
                            styles.errorText,
                            { color: colors.error },
                        ]}
                    >
                        {error}
                    </Text>
                ) : null}

                {/* SUBMIT BUTTON */}
                <View style={{ marginTop: Spacing.lg }}>
                    <ButtonWithLoader
                        text="Submit"
                        isLoading={suggestionLoading}
                        onPress={handleSubmit}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default SuggestionScreen;

/* =========================
   STYLES
========================= */

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },

    container: {
        padding: Spacing.lg,
    },

    label: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.small,
        marginBottom: 6,
    },

    dropdown: {
        borderWidth: 1,
        borderRadius: BorderRadius.large,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        marginBottom: Spacing.md,
    },

    placeholderStyle: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.small,
    },

    selectedTextStyle: {
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.small,
    },

    textArea: {
        height: 200,
        borderWidth: 1,
        borderRadius: BorderRadius.large,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
        fontFamily: Fonts.quicksand.bold,
        fontSize: FontSizes.small,
        marginBottom: Spacing.md,
    },


    errorText: {
        fontFamily: Fonts.quicksand.medium,
        fontSize: FontSizes.small,
        marginTop: Spacing.sm,
    },
});
