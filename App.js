import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as Font from "expo-font";
import * as SplashScreen from "expo-splash-screen";

// Navigations
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// Screens
import HomeScreen from "./screens/Main/HomeScreen";
import DiagnoseScreen from "./screens/Main/DiagnoseScreen";
import HealthRecordScreen from "./screens/Main/HealthRecordScreen";
import AccountScreen from "./screens/Main/AccountScreen";
import VaccineRecordScreen from "./screens/StackScreens/VaccineRecordScreen";
import VetVisitRecordScreen from "./screens/StackScreens/VetVisitRecordScreen";

import GetStartedScreen from "./screens/Onboarding/GetStartedScreen";
import AuthScreen from "./screens/Onboarding/AuthScreen";
import SignUpScreen from "./screens/Onboarding/SignUpScreen";
import DogRegistrationScreen from "./screens/Onboarding/DogRegistrationScreen";
import UserProfile from "./screens/StackScreens/Profile/UserProfile";
import SwitchDogProfile from "./screens/StackScreens/Profile/SwitchDogProfile";
import ResetPasswordEmailVerification from "./screens/StackScreens/ResetPasswordEmailVerification";

import AuthContextProvider from "./store/auth-context";

const BottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Tab bar icons
import TabBarIcon from "./components/TabBarIcons/TabBarIcon";
import DiagnoseDetailsScreen from "./screens/StackScreens/DiagnoseDetailsScreen";
import Button from "./components/UI/Button";
import DogProfile from "./screens/StackScreens/Profile/DogProfile";
const unfocusedHomeIcon = require("./assets/BottomTabIcons/unfocused-home.png");
const unfocusedStethoscopeIcon = require("./assets/BottomTabIcons/unfocused-stethoscope.png");
const unfocusedHeartIcon = require("./assets/BottomTabIcons/unfocused-heart.png");
const unfocusedDogIcon = require("./assets/BottomTabIcons/unfocused-dog.png");

const focusedHomeIcon = require("./assets/BottomTabIcons/focused-home.png");
const focusedStethoscopeIcon = require("./assets/BottomTabIcons/focused-stethoscope.png");
const focusedHeartIcon = require("./assets/BottomTabIcons/focused-heart.png");
const focusedDogIcon = require("./assets/BottomTabIcons/focused-dog.png");

function BottomTabs() {
  return (
    <BottomTab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#F4F4F9",
          height: 115,
          paddingTop: 28,
          paddingBottom: 28,
        },
      }}
    >
      <BottomTab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              focusedIcon={focusedHomeIcon}
              unfocusedIcon={unfocusedHomeIcon}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Diagnose"
        component={DiagnoseScreen}
        options={{
          title: "",
          tabBarLabel: "Diagnose",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              focusedIcon={focusedStethoscopeIcon}
              unfocusedIcon={unfocusedStethoscopeIcon}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="HealthRecordStack"
        component={HealthRecordStack}
        options={{
          title: "",
          tabBarLabel: "Health Records",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              focusedIcon={focusedHeartIcon}
              unfocusedIcon={unfocusedHeartIcon}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="AccountStack"
        component={AccountStack}
        options={{
          title: "",
          tabBarLabel: "Account",
          headerShown: false,
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              focusedIcon={focusedDogIcon}
              unfocusedIcon={unfocusedDogIcon}
              size={size}
              focused={focused}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DiagnoseDetails"
        component={DiagnoseDetailsScreen}
        options={{
          title: "Back",
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
        }}
      />
    </Stack.Navigator>
  );
}

function HealthRecordStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HealthRecords"
        component={HealthRecordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VaccineRecord"
        component={VaccineRecordScreen}
        options={{
          headerTitle: "Vaccine Records",
          headerTitleAlign: "center",
          headerTintColor: "#333333",
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
          headerRight: () => <Button>Placeholder</Button>, // Add a placeholder button without the `onPress` to avoid flicker
        }}
      />

      <Stack.Screen
        name="VetVisitRecord"
        component={VetVisitRecordScreen}
        options={{
          headerTitle: "Vet Visit Record",
          headerTitleAlign: "center",
          headerTintColor: "#333333",
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
          headerRight: () => <Button>Placeholder</Button>, // Add a placeholder button without the `onPress` to avoid flicker
        }}
      />
    </Stack.Navigator>
  );
}

function AccountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Account"
        component={AccountScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
        options={{
          headerTitle: "Back",
          headerTintColor: "#333333",
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
        }}
      />

      <Stack.Screen
        name="DogProfile"
        component={DogProfile}
        options={{
          headerTitle: "Back",
          headerTintColor: "#333333",
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
        }}
      />

      <Stack.Screen
        name="SwitchDogProfile"
        component={SwitchDogProfile}
        options={{
          headerTitle: "Back",
          headerTintColor: "#333333",
          headerStyle: {
            backgroundColor: "#FFFFFF",
          },
        }}
      />

      <Stack.Screen
        name="VetVisitRecord"
        component={VetVisitRecordScreen}
        options={{
          headerTitle: "Vet Visit Record",
          headerTitleAlign: "center",
          headerTintColor: "#333333",
          headerStyle: {
            backgroundColor: "#F5F6F8",
          },
          headerRight: () => <Button>Placeholder</Button>, // Add a placeholder button without the `onPress` to avoid flicker
        }}
      />
    </Stack.Navigator>
  );
}

function RootStack() {
  return (
    <Stack.Navigator initialRouteName="AuthScreen">
      <Stack.Screen
        name="GetStarted"
        component={GetStartedScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="AuthScreen"
        component={AuthScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="ResetPasswordEmailVerification"
        component={ResetPasswordEmailVerification}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Signup"
        component={SignUpScreen}
        options={{
          title: "Back",
          headerStyle: { backgroundColor: "#F7F7F7" },
        }}
      />
      <Stack.Screen
        name="DogRegistration"
        component={DogRegistrationScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabs}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Keep the splash screen visible
        await SplashScreen.preventAutoHideAsync();

        // Load fonts or other resources
        await Font.loadAsync({
          "inter-regular": require("./font/Inter/static/Inter_18pt-Regular.ttf"),
          "inter-bold": require("./font/Inter/static/Inter_28pt-Bold.ttf"),
          "inter-semi-bold": require("./font/Inter/static/Inter_18pt-SemiBold.ttf"),
          "inter-medium": require("./font/Inter/static/Inter_18pt-Medium.ttf"),
        });

        // You can also load other resources like images or API data here
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the app that the resources are ready
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = async () => {
    if (appIsReady) {
      // Hide the splash screen once everything is ready
      await SplashScreen.hideAsync();
    }
  };

  if (!appIsReady) {
    // You can return null or a loading component here if you want
    return null;
  }

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <StatusBar style="dark" />
      <AuthContextProvider>
        <NavigationContainer>
          <RootStack />
        </NavigationContainer>
      </AuthContextProvider>
    </View>
  );
}
