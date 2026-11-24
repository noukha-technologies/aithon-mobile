import React, { useEffect, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import AppText from "@views/components/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ICONS
import {
  ActiveHomeIcon,
  InActiveHomeIcon,
  ActiveChatIcon,
  InActiveChatIcon,
  ActivePostIcon,
  InActivePostIcon,
  ActiveProfileIcon,
  InActiveProfileIcon
} from "@assets/images/svg/svg_index";

import { COLORS } from "@config/colors.config";
import { useBottomTab } from "./BottomBarContext";

interface Props {
  state: any;
  descriptors: any;
  navigation: any;
}

const CustomTabBar = ({ state, descriptors, navigation }: Props) => {
  const insets = useSafeAreaInsets();
  const { isTabBarVisible } = useBottomTab();

  // Animated values for smooth transitions
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  // Animate tab bar slide in/out with fade
  useEffect(() => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: isTabBarVisible ? 0 : 120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: isTabBarVisible ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [isTabBarVisible, translateY, opacity]);

  const inactiveIcons: any = {
    Home: InActiveHomeIcon,
    Chats: InActiveChatIcon,
    Posts: InActivePostIcon,
    Profile: InActiveProfileIcon,
  };

  const activeIcons: any = {
    Home: ActiveHomeIcon,
    Chats: ActiveChatIcon,
    Posts: ActivePostIcon,
    Profile: ActiveProfileIcon,
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingBottom: Math.max(insets.bottom, 0) }, // Stick to bottom, handle safe area padding inside wrapper if needed, or outside
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}
    >
      <View style={styles.tabWrapper}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const IconComponent = isFocused
            ? activeIcons[route.name]
            : inactiveIcons[route.name];

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              {/* Active Indicator at Top */}
              {isFocused && <View style={styles.topActiveIndicator} />}

              <View style={styles.contentContainer}>
                <View style={styles.iconWrapper}>
                  {IconComponent && <IconComponent width={24} height={24} />}
                </View>

                <AppText style={[
                  styles.label,
                  { color: isFocused ? COLORS.primary : "#4F4F4F" }
                ]}>
                  {route.name}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </Animated.View>
  );
};

export default CustomTabBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 5,
  },

  tabWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 0,
  },

  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start", // Top align for the indicator
    height: 60, // Fixed height for tab bar content
    position: "relative",
  },

  contentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8, // Push content down slightly from top edge/indicator
  },

  topActiveIndicator: {
    position: 'absolute',
    top: 0,
    width: 40,
    height: 3,
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 3,
    borderBottomRightRadius: 3,
  },

  iconWrapper: {
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },

  label: {
    fontSize: 10,
    fontWeight: "500",
    textAlign: "center",
  },
});