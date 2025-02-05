import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TabNavigation from '@/components/TabNavigation'
import { useFocusEffect, usePathname } from 'expo-router'
import Header from '@/components/Header'
import { instance } from '@/api/baseUrlConfig'
import UseAppContext from '@/contextApi/UseContext'
import { ActivityIndicator } from 'react-native-paper'
import UserSuggestionCard from '@/components/UserSuggestionCard'

const addFriend = () => {
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    useFocusEffect(useCallback(() => {
        if (currentUser?._id) {
            getAllSuggestedUsers();
        }
    }, [currentUser?._id]))


    const getAllSuggestedUsers = async () => {
        try {
            const res = await instance.post(`/api/get-all-suggested-users`, {
                user_id: currentUser?._id
            })
            console.log(res?.data?.result, "suggested users");
            setSuggestedUsers(res?.data?.result);
        } catch (error: any) {
            console.log(error?.response?.data?.message);
        }
    }

    const pathname = usePathname();

    const renderItem = ({ item }: { item: any }) => (
        // <TouchableOpacity onPress={() => handlePress(item)}>
        <UserSuggestionCard data={item} />
        // </TouchableOpacity>
    );

    return (
        <>
            <SafeAreaView>
                <Header title="Add Friends" />
                <View style={{ marginTop: 10 }}>
                    <View>
                        <TextInput
                            style={styles.input}
                            placeholder='Search for friends'
                        />
                    </View>
                    <View style={{ flexDirection: "row", marginVertical: 15 }}>
                        <Text style={{ fontSize: 20, fontWeight: "bold", marginStart: "5%" }}>Suggested Users</Text>
                    </View>
                    <FlatList
                        data={suggestedUsers}
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

export default addFriend

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