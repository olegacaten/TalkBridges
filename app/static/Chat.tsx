import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../core/user/';
import axios from 'axios';

type ChatProps = {
  route: any;
};

type MessageType = {
  id: string;
  text: string;
  sender_id: string;
  sender_name: string;
};

const Chat: React.FC<ChatProps> = ({ route }) => {
  const { chat } = route.params;
  const user = useSelector((state: RootState) => state.user);

  const [messages, setMessages] = useState<MessageType[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const messagesRef = useRef<MessageType[]>([]);
  messagesRef.current = messages;

  const scrollViewRef = useRef<ScrollView | null>(null);

const sendMessage = async () => {
  if (newMessage.trim() === '') return;

  const messageData = {
    sender_id: user.id,
    group_id: chat.id, 
    text: newMessage,
  };

  try {
    const apiResponse = await axios.post('https://olegacat.ru/send_message.php', messageData);

    if (apiResponse.data.success) {
      // Message sent successfully
      console.log('Message sent to the API:', apiResponse.data);
      const newMessageObject: MessageType = {
        id: String(messagesRef.current.length + 1),
        text: newMessage,
        sender_id: user.id,
        sender_name: user.name, 
      };
      setNewMessage('');
      setMessages([...messagesRef.current, newMessageObject]);
    } else {
      
      console.error('API request failed:', apiResponse.data.error);
    }
  } catch (error) {
   
    console.error('Error sending message to the API:', error);
  }
};

  useEffect(() => {
  
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [messages]);

  useEffect(() => {
    fetch(`https://olegacat.ru/get_messages.php?group_id=${chat.id}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          messagesRef.current = data.messages;
          setMessages(data.messages);
        } else {
        }
      })
      .catch((error) => {
      });
  }, [chat.id]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <View style={styles.chatContainer}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.chatContent}
          onContentSizeChange={() => {
            if (scrollViewRef.current) {
              scrollViewRef.current.scrollToEnd({ animated: true });
            }
          }}
        >
          {messages.map((message) => (
  <View
    key={`${message.id}-${message.sender_id}`}
    style={[
      styles.messageContainer,
      {
        alignSelf:
          message.sender_name === user.name ? 'flex-end' : 'flex-start',
        backgroundColor:
          message.sender_name === user.name ? '#EFEFEF' : '#D1E0FF', 
      },
    ]}
  >
    <Text style={styles.senderName}>{message.sender_name}</Text>
    <Text style={styles.messageText}>{message.text}</Text>
  </View>
))}

        </ScrollView>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={(text) => setNewMessage(text)}
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  chatContainer: {
    flex: 1,
  },
  chatContent: {
    paddingBottom: 10,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '80%',
  },
  messageText: {
    fontSize: 16,
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: 'blue',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  sendButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Chat;
