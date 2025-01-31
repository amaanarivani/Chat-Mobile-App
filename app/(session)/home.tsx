import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import { usePathname, useRouter } from 'expo-router';
import ChatCard from '@/components/ChatCard';

const home = () => {

    const pathname = usePathname();
    const router = useRouter();

    const chatData: any = [
        {
            _id: 1,
            name: "Amaan",
            nsMessage: 5,
            lastMessage: "Hey, how it's going"
        },
        {
            _id: 2,
            name: "John Brown",
            lastMessage: "Hey"
        },
        {
            _id: 3,
            name: "Bob Marley",
            nsMessage: 3,
            lastMessage: "ok"
        },
        {
            _id: 4,
            name: "Charles",
            lastMessage: "How are you"
        },
        {
            _id: 5,
            name: "Mohammad",
            nsMessage: 2,
            lastMessage: "Call me when you're free"
        },
        {
            _id: 6,
            name: "Sheikh",
            nsMessage: 1,
            lastMessage: "let's meet"
        },
        {
            _id: 8,
            name: "Abhishek",
            lastMessage: "let's go"
        },
        {
            _id: 7,
            name: "Steward",
            lastMessage: "Hello"
        },
    ]

    const handlePress = (item: any) => {
        console.log('Session Id', item?.chatbot_id?._id);
        router.navigate({ pathname: "/(session)/chatSession", params: { item: item?.name } })
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
                                <Text style={{ color: "black", fontSize: 20 }}>No Chat Available</Text>
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