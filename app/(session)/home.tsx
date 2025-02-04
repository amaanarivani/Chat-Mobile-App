import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import ChatCard from '@/components/ChatCard';
import { instance } from '@/api/baseUrlConfig';
import UseAppContext from '@/contextApi/UseContext';
import { ActivityIndicator } from 'react-native-paper';

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
            const res = await instance.post(`/api/get-all-chat-session`, {
                user_id: currentUser?._id
            })
            console.log(res?.data?.result, "chat data from server");
            setChatData(res?.data?.result)
        } catch (error) {
            console.log(error);
        }
    }

    const handlePress = async (item: any) => {
        let receiver_id = item.users.filter((userId: any) => userId !== currentUser?._id)[0] || "";
        console.log('receiver Id', receiver_id);
        let receiver_name;
        try {
            const res = await instance.post(`/api/get-custom-single-user`, {
                user_id: receiver_id
            })
            receiver_name = res?.data?.result?.name;
        } catch (error) {
            console.log(error);
        }
        router.navigate({ pathname: "/(session)/chatSession", params: { receiver_id: receiver_id, receiver_name: receiver_name } })
        // Perform your action here (e.g., navigation, state update)
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
                            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", marginTop: "50%" }}>
                                <ActivityIndicator animating={true} color="#279EFF" size='large' />
                            </View>
                        }
                    />
                </View>
            </SafeAreaView>
            <TabNavigation pathname={pathname} />
        </>
    )
}

export default home;

const styles = StyleSheet.create({})