import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { RootStackParamList, BottomTabParamList } from "./types";

import LoginScreen from "@views/screens/LoginScreen";
import HomeScreen from "@views/screens/HomeScreen";
import ChatsScreen from "@views/screens/ChatsScreen";
import PostsScreen from "@views/screens/PostsScreen";
import ProfileScreen from "@views/screens/ProfileScreen";
import CustomTabBar from "./CustomTabBar";
import { BottomTabProvider } from "./BottomBarContext";
import { useAppSelector } from "@redux/hooks";
import { selectIsLoggedIn, selectAuthInitializing } from "@redux/slices/auth/auth.selector";
import { View, ActivityIndicator } from "react-native";
import { COLORS } from "@config/colors.config";

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<BottomTabParamList>();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chats" component={ChatsScreen} />
      <Tab.Screen name="Posts" component={PostsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

import { navigationRef } from "./RootNavigation";

export default function AppNavigator() {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);

  return (
    <BottomTabProvider>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {isLoggedIn ? (
            <Stack.Screen name="Main" component={TabNavigator} />
          ) : (
            <Stack.Screen name="Login" component={LoginScreen} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </BottomTabProvider>
  );
};
