import React from "react";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { useAuth0, Auth0Provider } from "react-native-auth0";
import config from "./auth0-configuration";

// Define types for configuration
interface Auth0Config {
  domain: string;
  clientId: string;
}

// Define type for user object
interface User {
  name: string;
  // Add other user properties as needed
}

// Define type for credentials
interface Credentials {
  accessToken: string;
  // Add other credential properties if needed
}

const Home: React.FC = () => {
  const { 
    authorize, 
    clearSession, 
    user, 
    error, 
    getCredentials, 
    isLoading 
  } = useAuth0<User>();

  const onLogin = async (): Promise<void> => {
    try {
      await authorize();
      let credentials = await getCredentials();
      Alert.alert("AccessToken: " + credentials?.accessToken);
    } catch (e: unknown) {
      console.log(e);
    }
  };

  const loggedIn = user !== undefined && user !== null;

  const onLogout = async (): Promise<void> => {
    try {
      await clearSession();
    } catch (e: unknown) {
      console.log("Log out cancelled");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user && <Text>You are logged in as {user.name}</Text>}
      {!user && <Text>You are not logged in</Text>}
      {error && <Text>{error.message}</Text>}
      <Button
        onPress={loggedIn ? onLogout : onLogin}
        title={loggedIn ? "Log Out" : "Log In"}
      />
    </View>
  );
};

const App: React.FC = () => {
  return (
    <Auth0Provider domain={config.domain} clientId={config.clientId}>
      <Home />
    </Auth0Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  header: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});

export default App;