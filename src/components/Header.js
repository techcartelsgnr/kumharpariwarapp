import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  Share,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { RFValue } from "react-native-responsive-fontsize";

// lucide icons
import { Menu, Bell, Share2 } from "lucide-react-native";

// ✅ THEME (ONLY FROM CONTEXT)

import { DeviceSize, Fonts, useTheme } from "../theme/theme";

import { useDispatch, useSelector } from "react-redux";


const { width: screenWidth } = DeviceSize;

const Header = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { name } = useSelector((state) => state.auth);

  return (
    <View
      style={[
        styles.headerbox,
        {
          backgroundColor: colors.cardBackground,
          borderBottomColor: colors.divider,
        },
      ]}
    >
      {/* ================= LEFT SECTION ================= */}
      <View style={styles.headerAlign}>
        <TouchableOpacity
          style={{ paddingRight: 8 }}
          onPress={() => navigation.toggleDrawer()}
          activeOpacity={0.7}
        >
          {/* <Menu size={22} color={colors.textPrimary} /> */}
          <Image
            source={require('../../assets/homeicon/menu.png')}
            style={styles.menuImage}
            
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.headerTopText,
            { color: colors.textPrimary },
          ]}
        >
          Hi,
        </Text>

        <Text
          style={[
            styles.headerText,
            { color: colors.textPrimary },
          ]}
          numberOfLines={1}
        >
          {name}
        </Text>
      </View>

      {/* ================= RIGHT SECTION ================= */}
      <View style={styles.rightIcons}>
        <TouchableOpacity style={{ paddingRight: 8 }} onPress={() => navigation.navigate("NotificationScreen")}>
          <Bell size={21} color={colors.textPrimary} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () =>
            await Share.share({ message: "Welcome to Kumhar Pariwar" })
          }
        >
          <Share2 size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Header;

/* =====================================================
   🔹 STYLES
===================================================== */
const styles = StyleSheet.create({
  headerbox: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  headerAlign: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
menuImage:{
  height: 24,
  width: 24,
},
  rightIcons: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerTopText: {
    fontFamily: Fonts.quicksand.bold,
    fontSize: RFValue(12),
  },

  headerText: {
    paddingLeft: screenWidth * 0.01,
    fontFamily: Fonts.quicksand.bold,
    fontSize: RFValue(11),
    maxWidth: screenWidth * 0.3,
  },
});
