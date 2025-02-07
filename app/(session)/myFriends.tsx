import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useState } from 'react'
import { useFocusEffect, usePathname } from 'expo-router'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'
import UserSuggestionCard from '@/components/UserSuggestionCard'
import { instance } from '@/api/baseUrlConfig'
import UseAppContext from '@/contextApi/UseContext'
import FriendsCard from '@/components/FriendsCard'

const myFriends = () => {
    const [myFriends, setMyFriends] = useState([]);
    const pathname = usePathname();

    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    useFocusEffect(useCallback(() => {
        if (currentUser?._id) {
            getAllMyFriends();
        }
    }, [currentUser?._id]))


    const getAllMyFriends = async () => {
        try {
            const res = await instance.post(`/api/get-all-my-friends`, {
                user_id: currentUser?._id
            })
            console.log(res?.data?.result, "my friends");
            setMyFriends(res?.data?.result);
        } catch (error: any) {
            console.log(error?.response?.data?.message);
        }
    }

    const renderItem = ({ item }: { item: any }) => (
        // <TouchableOpacity onPress={() => handlePress(item)}>
        <FriendsCard data={item} />
        // </TouchableOpacity>
    );
    return (
        <>
            <SafeAreaView>
                <Header title="My Friends" />
                <View style={{ marginTop: 10 }}>
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder='Search for friends'
                        />
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginStart: "5%" }}>Contacts</Text>
                    </View>
                    <FlatList
                        data={myFriends}
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

export default myFriends

const styles = StyleSheet.create({
    input: {
        width: "90%",
        borderRadius: 15,
        padding: 20,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        backgroundColor: "white",
        marginHorizontal: "auto"
        // marginBottom: 10,
        // marginStart: "5%"
        // marginStart: 20
    },
})