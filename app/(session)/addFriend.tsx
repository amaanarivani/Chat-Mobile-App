import { ActivityIndicator, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import TabNavigation from '@/components/TabNavigation'
import { useFocusEffect, usePathname } from 'expo-router'
import Header from '@/components/Header'
import { instance } from '@/api/baseUrlConfig'
import UseAppContext from '@/contextApi/UseContext'
import UserSuggestionCard from '@/components/UserSuggestionCard'
import Popup from '@/components/Popup'

const addFriend = () => {
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [suggestedUsers, setSuggestedUsers] = useState([]);
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    useFocusEffect(useCallback(() => {
        if (currentUser?._id) {
            getAllSuggestedUsers();
        }
    }, [currentUser?._id]))


    const getAllSuggestedUsers = async () => {
        try {
            setPageLoading(true);
            const res = await instance.post(`/api/get-all-suggested-users`, {
                user_id: currentUser?._id
            })
            console.log(res?.data?.result, "suggested users");
            setSuggestedUsers(res?.data?.result);
            setPageLoading(false);
        } catch (error: any) {
            console.log(error?.response?.data?.message);
            setPageLoading(false);
        }
    }

    const pathname = usePathname();

    const renderItem = ({ item }: { item: any }) => (
        // <TouchableOpacity onPress={() => handlePress(item)}>
        <UserSuggestionCard
            data={item}
            setLoading={setLoading}
            loading={loading}
            setError={setError}
            setMessage={setMessage}
        />
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
                    {
                        pageLoading ? <ActivityIndicator size="large" color="#279EFF" style={{ marginTop: "50%" }} /> :
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
                                    !pageLoading ? <View style={{ flex: 1, justifyContent: "center", alignItems: "center", width: "100%", marginTop: "50%" }}>
                                        <Text style={{ fontSize: 20 }}>No Suggestions</Text>
                                    </View> : <></>
                                }
                            />
                    }
                </View>
            </SafeAreaView>
            <TabNavigation pathname={pathname} />
            <Popup
                message={message}
                error={error}
                onDismissSnackBar={() => {
                    setMessage("");
                    setError("");
                }}
            />
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