import { ActivityIndicator, Image, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '@/components/Header';
import { useFocusEffect, useLocalSearchParams } from 'expo-router';
import ChatSessionHeader from '@/components/ChatSessionHeader';
import ClientMessage from '@/components/ClientMessage';
import UserMessage from '@/components/UserMessage';
import { Feather, FontAwesome6 } from '@expo/vector-icons';
import { instance } from '@/api/baseUrlConfig';
import UseAppContext from '@/contextApi/UseContext';
import { DateTime } from 'luxon';

const chatSession = () => {
    const [receiverUserData, setReceiverUserData] = useState({ _id: '', name: '', email: '' })
    const [chatMessages, setChatMessages] = useState({ _id: "", chat_messages: [] });
    const [responseMessage, setResponseMessage] = useState("");
    const [showKeyboardAndroid, setShowKeyboardAndroid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [layoutY, setLayoutY] = useState(0);
    const scrollRef = useRef<any>();
    const shouldScrollDownRef = useRef<any>(false);
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData, socket } = UseAppContext();

    const { session_id } = useLocalSearchParams<{ session_id: any }>();
    console.log(session_id, "session_id");
    const { receiver_id } = useLocalSearchParams<{ receiver_id: any }>();
    console.log(receiver_id, "receiver_id");
    const { receiver_name } = useLocalSearchParams<{ receiver_name: any }>();
    console.log(receiver_name, "receiver_name");

    useFocusEffect(useCallback(() => {
        getAllChatMessages();
    }, []))

    useEffect(() => {
        try {
            console.log("emit socket", socket);

            if (socket && chatMessages?._id) {
                socket.emit("join_chat_room", { chat_id: chatMessages?._id, user_id: currentUser?._id })
                socket.on("live_message", (data: any) => {
                    console.log(data, "live_message");
                    shouldScrollDownRef.current = true;
                    setChatMessages((prev: any) => {
                        return {
                            ...prev,
                            chat_messages: [...prev?.chat_messages, data?.messageDoc]
                        }
                    })
                })
            }
        } catch (error) {

        }

        return () => {
            socket?.off("live_message")
        }
    }, [socket, chatMessages?._id])

    useEffect(() => {
        const showAndroid = Keyboard.addListener('keyboardDidShow', () => {
            // setShowKeyboardAndroid(true)
            scrollRef.current?.scrollTo({ x: 0, y: layoutY, animated: true })
        });
        // const hideAndroid = Keyboard.addListener('keyboardDidHide', () => {
        //   setShowKeyboardAndroid(false)
        //   scrollRef.current?.scrollTo({ x: 0, y: layoutY, animated: true })
        // });
        const showIOS = Keyboard.addListener('keyboardWillShow', () => {
            scrollRef.current?.scrollTo({ x: 0, y: layoutY, animated: true })
        });
    }, [layoutY])

    useEffect(() => {
        // console.log(layoutY, "-------scroll------", scrollRef, "-------scroll------");

        if (layoutY && scrollRef.current?.scrollTo && shouldScrollDownRef.current) {
            scrollRef.current?.scrollTo({ x: 0, y: layoutY, animated: true })
            shouldScrollDownRef.current = false;
        }
    }, [layoutY, scrollRef.current?.scrollTo])


    const getAllChatMessages = async () => {
        try {
            setLoading(true);
            shouldScrollDownRef.current = true;
            const res = await instance.post(`/api/get-all-chat-messages`, {
                session_id,
                currentDate: DateTime.now().toUTC().toISO()
            })
            console.log(res?.data?.result, "chat_messages");
            setChatMessages(res?.data?.result);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const sendMessages = async (messageToSend: string) => {
        try {
            const res = await instance.post(`/api/initiate-chat-session`, {
                initiate_user_id: currentUser?._id,
                client_user_id: receiver_id,
                message: messageToSend
            })
            console.log(res?.data?.result, "initiate chat doc");
            setChatMessages(res?.data?.result)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendMessages = async (messageToSend: string) => {
        try {
            shouldScrollDownRef.current = true;
            sendMessages(messageToSend);
            socket?.emit("user_message", { chat_id: chatMessages?._id, message: messageToSend, user_id: currentUser?._id, friend_id: receiver_id })
        } catch (error) {
            console.log(error);
        }
    }


    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "#F5F5F5" }}>
                <ChatSessionHeader title={receiver_name} />
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
                >
                    <ScrollView
                        // onScrollEndDrag={handleScroll}
                        scrollEventThrottle={16}
                        style={{
                            backgroundColor: "#F5F5F5",
                            flex: 1,
                            borderTopLeftRadius: 20,
                            borderTopRightRadius: 20,
                        }}
                        automaticallyAdjustKeyboardInsets={Platform.OS == "android" ? true : false}
                        keyboardShouldPersistTaps={"handled"}
                        showsVerticalScrollIndicator={false}
                        ref={scrollRef}
                    >
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
                                        setLayout={setLayoutY}
                                    />
                                ) : (
                                    <ClientMessage
                                        key={key}
                                        index={index}
                                        message={message}
                                        setLayout={setLayoutY}
                                    />
                                )
                            })
                        }

                    </ScrollView>
                    <View style={{
                        flexDirection: "row", width: "100%", backgroundColor: "#F5F5F5",
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