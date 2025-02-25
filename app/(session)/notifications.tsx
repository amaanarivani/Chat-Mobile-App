import { ActivityIndicator, BackHandler, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router';
import UseAppContext from '@/contextApi/UseContext';
import Header from '@/components/Header';
import { instance } from '@/api/baseUrlConfig';
import NotificationCard from '@/components/NotificationCard';

const Notifications = () => {
    const [loading, setLoading] = useState(false);
    const [notificationsData, setNotificationsData] = useState([]);

    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    const router = useRouter();
    const backHand = useRef<any>();
    useFocusEffect(useCallback(() => {

        backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {
            // BackHandler.exitApp();
            router.back();
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

    useEffect(() => {
        getAllUserNotifications();
    }, [])

    const getAllUserNotifications = async () => {
        try {
            setLoading(true);
            const res = await instance.post(`/api/get-all-user-notifications`, {
                user_id: currentUser?._id
            })
            console.log(res?.data?.notifications);
            setNotificationsData(res?.data?.notifications)
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.log(error);
        }
    }

    const renderItem = ({ item }: { item: any }) => (
        // <TouchableOpacity onPress={() => handlePress(item)}>
        <NotificationCard
            data={item}
        // setLoading={setLoading}
        // loading={loading}
        // setError={setError}
        // setMessage={setMessage}
        />
        // </TouchableOpacity>
    );

    return (
        <>
            <SafeAreaView style={{ backgroundColor: "#FFFFFF", flex: 1 }}>
                <Header title="Notifications" />
                <View style={{ marginTop: 5 }}>
                    {
                        loading ? <>
                            <ActivityIndicator size="large" color="#279EFF" style={{ marginTop: "50%" }} />
                        </> : <>
                            <FlatList
                                data={notificationsData}
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
                                        <Text style={{ fontSize: 20 }}>No Notifications Available!</Text>
                                    </View> : <></>
                                }
                            />
                        </>
                    }
                </View>
            </SafeAreaView>
        </>
    )
}

export default Notifications;

const styles = StyleSheet.create({})