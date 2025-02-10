import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import Header from '@/components/Header';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import ChatSessionHeader from '@/components/ChatSessionHeader';
import ClientMessage from '@/components/ClientMessage';
import UserMessage from '@/components/UserMessage';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { instance } from '@/api/baseUrlConfig';
import UseAppContext from '@/contextApi/UseContext';

const chatSession = () => {
    const [receiverUserData, setReceiverUserData] = useState({ _id: '', name: '', email: '' })
    const [chatMessages, setChatMessages] = useState({ chat_messages: [] });
    const [responseMessage, setResponseMessage] = useState("");
    const [showKeyboardAndroid, setShowKeyboardAndroid] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    const { receiver_id } = useLocalSearchParams<{ receiver_id: any }>();
    console.log(receiver_id, "receiver_id");
    const { receiver_name } = useLocalSearchParams<{ receiver_name: any }>();
    console.log(receiver_name, "receiver_name");

    useFocusEffect(useCallback(() => {
        getAllChatMessages();
    }, []))

    const getAllChatMessages = async () => {
        try {
            setLoading(true);
            const res = await instance.post(`/api/get-all-chat-messages`, {
                user_id: currentUser?._id,
                client_user_id: receiver_id
            })
            console.log(res?.data?.result, "chat_messages");
            setChatMessages(res?.data?.result);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleSendMessages = async (messageToSend: string) => {
        try {
            const res = await instance.post(`/api/send-chat-messages`, {
                initiate_user_id: currentUser?._id,
                client_user_id: receiver_id,
                message: messageToSend
            })
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
                <ChatSessionHeader title={receiver_name} />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
                >
                    <ScrollView>
                        {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", marginTop: "50%" }}>
                            <ActivityIndicator animating={true} color="#279EFF" size='large' />
                        </View> :
                            chatMessages?.chat_messages?.map((message: any, index: number) => {
                                const key = message?.id || index;
                                return message.user_id == currentUser?._id ? (
                                    <UserMessage
                                        key={key}
                                        index={index}
                                        message={message}
                                    />
                                ) : (
                                    <ClientMessage
                                        key={key}
                                        index={index}
                                        message={message}
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
                            if (responseMessage.trim()) {
                                handleSendMessages(responseMessage.trim())
                            }
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