import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
} from "react-native";
import { socket } from "../../App";
import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from '../core/user/';
import { useFocusEffect } from "@react-navigation/native"; 
type ChatsProps = {
  route: any;
  navigation: any;
};

type TypeChatData = {
  group_name: string;
  last_message: string;
  id: string;
  timestamp: string;
  owner_name: string;
};

const Chats: React.FC<ChatsProps> = ({ route, navigation }) => {
  const { name } = route.params;
  console.log(name);
  const useTypeSelector: TypedUseSelectorHook<RootState> = useSelector;
  const user = useTypeSelector((item) => item.user);
  const [chatData, setChatData] = useState<TypeChatData[]>([]);
  const [searchArr, setSearchArr] = useState<TypeChatData[]>([]);
  const [isFound, setIsFound] = useState(true);
  const [chatName, setChatName] = useState("");

  const fetchChatData = () => {
    fetch("https://olegacat.ru/get_all_groups.php")
      .then((response) => response.json())
      .then((data: { success: boolean; groups: TypeChatData[] }) => {
        if (data.success) {
          const sortedChats = data.groups.sort((a, b) =>
            b.timestamp.localeCompare(a.timestamp)
          );
          setChatData(sortedChats);
        } else {
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchChatData();
    }, []) 
  );


  const navigateToChat = (chat: TypeChatData) => {
    socket.emit("join", chat.id);
    socket.emit("get_chat", chat.id);
    navigation.navigate("Chat", { chat, chatId: chat.id });
  };

  const search = (e: string) => {
    let filtered = chatData.filter((item) => item.group_name.includes(e));
    if (!filtered.length) return setIsFound(false);
    setSearchArr(filtered);
    setIsFound(true);
  };

  const handleDeleteChat = (chat: TypeChatData) => {
    if (user.name === chat.owner_name) {
      fetch("https://olegacat.ru/delete_chat.php", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chatId: chat.id }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Remove the deleted chat from chatData state
            setChatData((prevChatData) =>
              prevChatData.filter((item) => item.id !== chat.id)
            );
          } else {
            console.error("Failed to delete chat:", data.error);
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      Alert.alert(
        "Permission Denied",
        "You do not have permission to delete this chat."
      );
    }
  };

  const renderItem = ({ item }: { item: TypeChatData }) => (
    <TouchableOpacity
      id={`${item.id}`}
      onPress={() => navigateToChat(item)}
      style={styles.chatItem}
    >
      <View style={styles.profileCircle}></View>
      <View style={styles.chatContent}>
        <Text style={styles.chatName}>{item.group_name}</Text>
        <Text style={styles.lastMessage}>{item.last_message}</Text>
        <Text style={styles.lastMessage}>owner_name:{item.owner_name}</Text>
      </View>
      <Text style={styles.timestamp}>{item.timestamp}</Text>
      {user.name === item.owner_name && (
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteChat(item)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );

  const addChat = () => {
    const trimmedChatName = chatName.trim();
  
    if (!trimmedChatName) {
      console.error("Chat name cannot be empty.");
      return;
    }
  
    fetch(`https://olegacat.ru/create_group.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        group_name: trimmedChatName, 
        owner_id: user.id,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setChatName("");
  
          fetch("https://olegacat.ru/get_all_groups.php")
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                setChatData(data.groups);
              } else {
              }
            })
            .catch((error) => {
              console.error("Error:", error);
            });
        } else {
          console.error("Failed to create chat:", data.error);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };
  return (
    <View style={styles.container}>
      <View style={styles.profileContainer}>
        {/* Profile Circle */}
        <View style={styles.profileCircle}></View>
        {/* Profile Name */}
        <Text style={styles.title}>NAME:{user.name}</Text>
        <Text style={styles.title}> ID:{user.id}</Text>
      </View>

      <Text style={styles.title}>Chats</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.NameChat}
          placeholder="Name chat"
          onChangeText={(t) => setChatName(t)}
        />
        <View style={styles.addButton}>
          <Button title="Add" onPress={addChat} />
        </View>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search for chats..."
        placeholderTextColor="#999"
        onChangeText={search}
      />

      {/* Chat List */}
      <FlatList
        data={
          !isFound
            ? [
                {
                  id: "1",
                  group_name: "",
                  last_message: "",
                  timestamp: "",
                  owner_name: "",
                },
              ]
            : searchArr.length
            ? searchArr
            : chatData
        }
        renderItem={
          !isFound
            ? () => <Text style={styles.isFoundText}>Nothing found</Text>
            : renderItem
        }
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row", 
    alignItems: "center",
    marginBottom: 20, 
  },
  NameChat: {
    flex: 1, 
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10, 
  },
  addButton: {
    minWidth: 100,
  },

  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  isFoundText: {
    textAlign: "center",
    fontSize: 30,
  },
  profileContainer: {
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 20, 
  },

  profileCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "blue",
    alignSelf: "flex-start",
  },
  title: { fontSize: 24, fontWeight: "bold", marginVertical: 20 },

  searchBar: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
  },
  chatContent: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  lastMessage: {
    color: "#666",
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  deleteButton: {
    backgroundColor: "red", 
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  deleteButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Chats;
