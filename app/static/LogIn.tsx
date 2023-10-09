import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../core/user";
import { setUser } from "../core/user/slices/UserSlice";

type HomeScreenProps = {
  navigation: any;
};

const LogIn: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [username, setName] = useState("");
  const useAppDispatch = () => useDispatch<AppDispatch>();
  const dispatch = useAppDispatch();

  const handleLogin = async () => {
    if (username.trim() === "") return Alert.alert("You must enter the name");

    fetch(`http://olegacat.ru/get_user_login.php?username=${username}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          const { id, username } = data.user;
          dispatch(setUser({ id: id, name: username }));
          navigation.navigate("Chats", { username, id });
          console.log(`Logged in as ${username}, ${id}`);
        } else {
          createUser();
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const createUser = () => {
    fetch("https://olegacat.ru/create_user.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          fetch(`http://olegacat.ru/get_user_login.php?username=${username}`)
            .then((response) => response.json())
            .then((userData) => {
              if (userData.success) {
                const { id, username } = data.user;
                navigation.navigate("Chats", { id, username });
              } else {
                Alert.alert("User creation failed");
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          Alert.alert("User creation failed");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to ChatApp</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your name"
        onChangeText={setName}
        value={username.toLowerCase()}
      />
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.5}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Log In</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "blue",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default LogIn;
