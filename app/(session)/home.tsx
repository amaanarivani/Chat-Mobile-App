import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import ChatCard from '@/components/ChatCard';
import { instance } from '@/api/baseUrlConfig';
import UseAppContext from '@/contextApi/UseContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

const home = () => {
    const [chatData, setChatData] = useState([]);
    const [loading, setLoading] = useState(false);
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    const pathname = usePathname();
    const router = useRouter();

    useFocusEffect(useCallback(() => {
        getAllChatSession()
    }, []))


    const getAllChatSession = async () => {
        console.log(currentUser?._id, "user id to send");
        try {
            setLoading(true);
            const authToken = await AsyncStorage.getItem("token");
            const res = await instance.post(`/api/get-all-chat-session`, {
                user_id: currentUser?._id
            }, { headers: { Authorization: `Bearer ${authToken}` } });
            console.log(res?.data?.result, "chat data from server");
            setChatData(res?.data?.result)
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handlePress = async (item: any) => {
        router.navigate({ pathname: "/(session)/chatSession", params: { receiver_id: item?.receiver?._id, receiver_name: item?.receiver?.name } })
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
                                    !loading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", marginTop: "50%" }}>
                                        <Text style={{ fontSize: 20 }}>No Chats</Text>
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