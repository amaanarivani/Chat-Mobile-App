import { ActivityIndicator, Image, ImageBackground, Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
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
import axios from 'axios';
import AnnouncementMessage from '@/components/AnnouncementMessage';

const chatSession = () => {
    const [receiverUserData, setReceiverUserData] = useState({ _id: '', name: '', email: '' })
    const [chatMessages, setChatMessages] = useState<any>([]);
    const [chatId, setChatId] = useState('');
    const [responseMessage, setResponseMessage] = useState("");
    const [showKeyboardAndroid, setShowKeyboardAndroid] = useState(false);
    const [loading, setLoading] = useState(false);
    const [layoutY, setLayoutY] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
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
            // console.log("emit socket", socket);

            if (socket && chatId) {
                socket.emit("join_chat_room", { chat_id: chatId, user_id: currentUser?._id })
                socket.on("live_message", (data: any) => {
                    console.log(data, "live_message");
                    shouldScrollDownRef.current = true;
                    setChatMessages((prev: any) => {
                        return [...prev, data?.messageDoc]

                    })
                })
            }
        } catch (error) {

        }

        return () => {
            socket?.off("live_message")
        }
    }, [socket, chatId])

    useEffect(() => {
        const showAndroid = Keyboard.addListener('keyboardDidShow', () => {
            // setShowKeyboardAndroid(true)
            scrollRef.current?.scrollTo({ x: 0, y: layoutY, animated: true })
        });
        // const hideAndroid = Keyboard.addListener('keyboardDidHide', () => {
        //     setShowKeyboardAndroid(false)
        //     scrollRef.current?.scrollTo({ x: 0, y: layoutY, animated: true })
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


    const getAllChatMessages = async (pageNum = 1) => {
        try {
            console.log("1---", pageNum, session_id);
            if (pageNum == 1) {
                console.log("3");
                setLoading(true);
                shouldScrollDownRef.current = true;
            }
            console.log("99");
            let date = DateTime.now().toUTC().toISO()
            const res = await instance.post(`/api/get-all-chat-messages/${pageNum}`, {
                session_id,
                current_date: date
            })
            console.log("4");
            console.log(res?.data?.result, "chat_messages");
            setChatId(res?.data?.chat_id);
            let data = res?.data?.result;
            if (data && data?.length > 0) {
                console.log("5");
                setHasMore(true);
                setChatMessages((prev: any) => ([...data, ...prev]));
                setPage(pageNum);
            }
            console.log("6");
            setLoading(false);
            setTimeout(() => {
                setHasMore(false);
            }, 1000);
        } catch (error) {
            console.log("7");
            console.log(error);
            setLoading(false);
            // setHasMore(false);
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
            setChatMessages(res?.data?.result?.chat_messages)
            setChatId(res?.data?.result?._id)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendMessages = async (messageToSend: string) => {
        try {
            shouldScrollDownRef.current = true;
            sendMessages(messageToSend);
            socket?.emit("user_message", { chat_id: chatId, message: messageToSend, user_id: currentUser?._id, friend_id: receiver_id })
        } catch (error) {
            console.log(error);
        }
    }

    const handleScroll = (event: any) => {
        const { contentOffset } = event.nativeEvent;
        if (contentOffset.y <= 0) {
            setHasMore(true);
            getAllChatMessages(page + 1);
            console.log("You're at the top!");
        }
    };


    return (
        <>
            <ImageBackground source={require("@/assets/images/chat-screen.jpg")} style={{ flex: 1, height: "100%" }}>
                <SafeAreaView style={{ height: "100%", backgroundColor: "" }}>
                    <ChatSessionHeader title={receiver_name} />
                    <KeyboardAvoidingView
                        style={{ flex: 1 }}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
                    // keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0} // Adjust as needed
                    >
                        <ScrollView
                            onScrollEndDrag={handleScroll}
                            scrollEventThrottle={16}
                            style={{
                                backgroundColor: "",
                                flex: 1,
                                borderTopLeftRadius: 20,
                                borderTopRightRadius: 20,
                            }}
                            automaticallyAdjustKeyboardInsets={Platform.OS == "android" ? true : false}
                            keyboardShouldPersistTaps={"handled"}
                            showsVerticalScrollIndicator={false}
                            ref={scrollRef}
                        >
                            {
                                hasMore ? <>
                                    <View style={{
                                        padding: 10,
                                        backgroundColor: "#E8E8E8",
                                        borderTopLeftRadius: 20,
                                        borderTopRightRadius: 20,
                                    }}>
                                        {/* <Text style={{ fontSize: 20, textAlign: "center" }}>Loading...</Text> */}
                                        <ActivityIndicator size="small" color="#0000ff" />
                                    </View>
                                </> : <>
                                </>
                            }
                            {loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", marginTop: "50%" }}>
                                <ActivityIndicator animating={true} color="#279EFF" size='large' />
                            </View> :
                                chatMessages.map((message: any, index: number) => {
                                    const key = message?.id || index;
                                    return message.user_id == currentUser?._id && message?.message_type == 15 ? (
                                        <UserMessage
                                            key={key}
                                            index={index}
                                            message={message}
                                            setLayout={setLayoutY}
                                            chatMessagesCount={chatMessages.length}
                                        />
                                    ) : message.user_id != currentUser?._id && message?.message_type == 15 ? (
                                        <ClientMessage
                                            key={key}
                                            index={index}
                                            message={message}
                                            setLayout={setLayoutY}
                                            chatMessagesCount={chatMessages.length}
                                        />
                                    ) : message?.message_type == 16 ? (
                                        <AnnouncementMessage
                                            key={key}
                                            index={index}
                                            message={message}
                                            setLayout={setLayoutY}
                                            chatMessagesCount={chatMessages.length}
                                        />
                                    ) : <></>
                                })
                            }

                        </ScrollView>
                    </KeyboardAvoidingView>
                </SafeAreaView >
            </ImageBackground>
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