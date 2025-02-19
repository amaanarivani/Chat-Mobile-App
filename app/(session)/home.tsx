import { ActivityIndicator, BackHandler, FlatList, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import ChatCard from '@/components/ChatCard';
import { instance } from '@/api/baseUrlConfig';
import UseAppContext from '@/contextApi/UseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

const home = () => {
    const [chatData, setChatData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData, handleSetSocket, socket } = UseAppContext();

    const pathname = usePathname();
    const router = useRouter();

    useFocusEffect(useCallback(() => {
        getAllChatSession()
    }, []))

    useFocusEffect(useCallback(() => {
        if (currentUser?._id && !socket) {
            handleSetSocket();
        }
    }, [currentUser?._id, socket]))

    useEffect(() => {
        if (currentUser?._id) {
            console.log('1');

            const handleNotifications = async () => {
                try {
                    console.log('2');
                    Notifications.setNotificationHandler({
                        handleNotification: async () => {
                            getAllChatSessionNotification();
                            return {
                                shouldShowAlert: true,
                                shouldPlaySound: true,
                                shouldSetBadge: false,
                            }
                        },
                    });
                    console.log('3');
                    Notifications.addNotificationResponseReceivedListener((response: any) =>
                        // instance.post('/user/log-data', { data: 'Notification response received' })
                        console.log("inside addNotificationResponseReceivedListener")
                    );

                    Notifications.addNotificationReceivedListener((notification: any) =>
                        // instance.post('/user/log-data', { data: 'Notification received' })
                        console.log("inside addNotificationReceivedListener")
                    );

                    await getNotificationToken();
                } catch (error: any) {
                    // await instance.post('/user/log-data', { data: `Error: ${error.message}` });
                    console.log(error, "error in handleNotifications function");
                }
            };

            handleNotifications();
        }
    }, [currentUser?._id]);

    const getNotificationToken = async () => {
        try {
            if (Platform.OS === 'android') {
                await Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    sound: 'notification_sound.mp3',
                    importance: Notifications.AndroidImportance.HIGH,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            if (Device.isDevice) {
                const { status: existingStatus } = await Notifications.getPermissionsAsync();
                let finalStatus = existingStatus;
                if (existingStatus !== 'granted') {
                    const { status } = await Notifications.requestPermissionsAsync(
                        {
                            ios: {
                                allowAlert: true,
                                allowBadge: true,
                                allowSound: true,
                            }
                        }
                    );
                    finalStatus = status;
                }
                if (finalStatus !== 'granted') return;

                const token = (await Notifications.getExpoPushTokenAsync({ projectId: "ea9534c4-62e7-4cd6-90e4-ca67fa292ec1" })).data;
                console.log(token, "expo-notification-token");

                // setExpoPushToken(token);
                let authToken = await AsyncStorage.getItem('token');

                await instance.post('/api/add-user-notification-token', {
                    user_id: currentUser?._id,
                    token,
                }, { headers: { Authorization: `Bearer ${authToken}` } });
            }
        } catch (error: any) {
            // await instance.post('/user/log-data', { data: `Error: ${error.message}` });
            console.log(error?.response?.data?.message, "error in getNotificationToken function");
        }
    };

    const backHand = useRef<any>();
    useFocusEffect(useCallback(() => {

        backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {
            BackHandler.exitApp();
            //   router.navigate("/(no-session)/signin")
            console.log("22");
            return true;
        })
        return () => {
            console.log("cl");

            backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {

                // try {

                //   if(state?.isSignIn){

                //     router.navigate("/(session)/home");
                //   }
                // } catch (error) {

                // }
                return true
            })
        }
    }, []))



    const getAllChatSession = async () => {
        console.log(currentUser?._id, "user id to send");
        try {
            setLoading(true);
            let authToken = await AsyncStorage.getItem("token");
            const res = await instance.post(`/api/get-all-chat-session`, {
                user_id: currentUser?._id
            }, { headers: { Authorization: `Bearer ${authToken}` } });
            // console.log(res?.data?.result, "chat data from server");
            setChatData(res?.data?.result)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }


    const getAllChatSessionNotification = async () => {
        console.log(currentUser?._id, "user id to send");
        try {
            // setLoading(true);
            let authToken = await AsyncStorage.getItem("token");
            const res = await instance.post(`/api/get-all-chat-session`, {
                user_id: currentUser?._id
            }, { headers: { Authorization: `Bearer ${authToken}` } });
            // console.log(res?.data?.result, "chat data from server");
            setChatData(res?.data?.result)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handlePress = async (item: any) => {
        if (item?.has_friends) {
            router.navigate({ pathname: "/(session)/chatSession", params: { receiver_id: item?.receiver?._id, receiver_name: item?.receiver?.name, session_id: item?._id } })
        } else {
            router.navigate({ pathname: "/(session)/chatSessionHistory", params: { receiver_id: item?.receiver?._id, receiver_name: item?.receiver?.name, session_id: item?._id } })
        }
    };

    const renderItem = ({ item }: { item: any }) => (
        <TouchableOpacity onPress={() => handlePress(item)}>
            <ChatCard data={item} />
        </TouchableOpacity>
    );

    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
                <Header title="Chats" />
                <View style={{ marginTop: 10 }}>
                    {
                        loading ? <ActivityIndicator size="large" color="#279EFF" style={{ marginTop: "50%" }} /> :
                            <FlatList
                                data={chatData}
                                renderItem={renderItem}
                                keyExtractor={(item, index) => String(index)}
                                // contentContainerStyle={{ marginBottom: 100}}
                                horizontal={false}
                                style={{ marginBottom: 220 }}
                                showsVerticalScrollIndicator={false}
                                keyboardShouldPersistTaps={"handled"}
                                // onRefresh={handleRefresh}
                                // refreshing={refreshing}
                                automaticallyAdjustKeyboardInsets
                                // onEndReached={handleLoadMore} // Trigger load more when reaching the end
                                onEndReachedThreshold={0.5} // Adjust threshold as needed
                                // ListFooterComponent={
                                //     loading && !refreshing ? (
                                //         <View style={{ padding: 10 }}>
                                //             <ActivityIndicator size="small" color="#0000ff" />
                                //         </View>
                                //     ) : null
                                // }
                                ListEmptyComponent={
                                    !loading ? <View style={{ padding: 10 }}>
                                        <Text style={{fontSize: 20, textAlign: 'center', marginTop: "50%"}}>No Chats Available</Text>
                                    </View> : <></>
                                }
                            />
                    }
                </View>
            </SafeAreaView>
            <TabNavigation pathname={pathname} />
        </>
    )
}

export default home;

const styles = StyleSheet.create({})