import { KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useState } from 'react'
import Header from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import ChatSessionHeader from '@/components/ChatSessionHeader';
import ClientMessage from '@/components/ClientMessage';
import UserMessage from '@/components/UserMessage';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

const chatSession = () => {
    const [responseMessage, setResponseMessage] = useState("");
    const [showKeyboardAndroid, setShowKeyboardAndroid] = useState(false);

    const chatMessages = [
        {
            _id: 1,
            message_type: 1,
            message: "Hello"
        },
        {
            _id: 2,
            message_type: 2,
            message: "Hii"
        },
        {
            _id: 3,
            message_type: 1,
            message: "How are you?"
        },
        {
            _id: 4,
            message_type: 2,
            message: "I am fine"
        },
        {
            _id: 5,
            message_type: 2,
            message: "What about you?"
        },
        {
            _id: 6,
            message_type: 1,
            message: "Fine"
        },
    ]

    const { item } = useLocalSearchParams<{ item: any }>();
    console.log(item, "user_name");
    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
                <ChatSessionHeader title={item} />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
                >
                    <ScrollView>
                        {
                            chatMessages.map((messageData: any, index: any) => {
                                const key = messageData?._id || index;
                                return messageData?.message_type == 1 ? (
                                    <UserMessage
                                        key={key}
                                        message={messageData}
                                        index={index}
                                    />
                                ) : (
                                    <ClientMessage
                                        key={key}
                                        message={messageData}
                                        index={index}
                                    />
                                )
                            })
                        }
                    </ScrollView>
                    <View style={{
                        flexDirection: "row", width: "100%", backgroundColor: "#ffffff",
                        paddingBottom: showKeyboardAndroid ? 50 : 5
                    }}>
                        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                        <TextInput style={styles.input} placeholder='Type your message' onChangeText={(e) => {
                            setResponseMessage(e);
                            // handleTypingStart() 
                        }} value={responseMessage} />
                        <Pressable style={{ width: "20%", flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#279EFF", borderRadius: 30, marginHorizontal: "3%" }} onPress={() => {
                            console.log("send message pressed");
                            // if (responseMessage.trim()) {
                            //     handleSendMessages(responseMessage.trim())
                            // }
                            setResponseMessage("");
                        }}>
                            <Feather name="send" size={22} color="white" />
                            {/* <Text style={{color: "white"}}>Send</Text> */}
                        </Pressable>
                        {/* </TouchableWithoutFeedback> */}
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView >
        </>
    )
}

export default chatSession;

const styles = StyleSheet.create({
    input: {
        width: "70%",
        borderRadius: 30,
        padding: 20,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        backgroundColor: "white",
        // marginBottom: 10,
        marginStart: "5%"
        // marginStart: 20
    },
})