import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
import { DateTime } from 'luxon';
// import { instance } from '@/api/baseUrlConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { instance } from '@/api/baseUrlConfig';
import UseAppContext from '@/contextApi/UseContext';
import { useFocusEffect } from 'expo-router';

const ChatCard = ({ data }: { data: any }) => {
    const [receiverUserData, setReceiverUserData] = useState({ _id: '', name: '', email: '' })
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    let receiver_id = data.users.filter((userId: any) => userId !== currentUser?._id)[0] || "";
    // console.log(receiver_id, "receiver user id");


    // const [nsMessage, setNsMessage] = useState(2);

    // useFocusEffect(useCallback(() => {
    //     if (receiver_id) {
    //         getReceiverUserData();
    //     }
    // }, [receiver_id]))

    // const getNotSeenCount = async () => {

    //     try {
    //         let authToken = await AsyncStorage.getItem('token');
    //         const res = await instance.post('/api/chat-message-nscount', {
    //             session_id: data?._id
    //         }, { headers: { Authorization: `Bearer ${authToken}` } })
    //         setNsMessage(res?.data?.nsCount)

    //     } catch (error: any) {
    //         console.log(error);
    //     }
    // }

    // const getReceiverUserData = async () => {
    //     try {
    //         const res = await instance.post(`/api/get-custom-single-user`, {
    //             user_id: receiver_id
    //         })
    //         setReceiverUserData(res?.data?.result)
    //     } catch (error) {
    //         console.log(error);
    //     }
    // }

    return (
        <View style={{ backgroundColor: "white", padding: 15, width: "99%", borderBottomWidth: 1, borderBottomColor: "#D9D9D9" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginEnd: 10, marginVertical: "auto" }}>
                        <Image
                            source={require('@/assets/images/avatar.png')}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                    <View style={{ marginStart: 2, marginVertical: "auto" }}>
                        <Text style={{ fontSize: Platform.OS == "android" ? 15 : 17, fontWeight: data?.nsMessage ? "800" : "500" }}>{data?.receiver?.name}</Text>
                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                            <View>
                                <Text style={{ color: "gray", marginVertical: "auto", marginEnd: 5, fontSize: 15 }}>{data?.lastMessage?.message}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ marginVertical: "auto" }}>
                    {/* {
                        data?.nsMessage ? <> */}
                    <View style={{ backgroundColor: "#279EFF", width: Platform.OS == "android" ? 32 : 28, borderRadius: "100%", paddingVertical: 6, marginHorizontal: "auto" }}>
                        <Text style={{ color: "white", marginVertical: "auto", fontSize: 15, textAlign: "center" }}>4</Text>
                    </View>
                    {/* </> : <>
                        </>
                    } */}
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 15, textAlign: "center" }}>
                            {DateTime.fromISO(data?.updated_at).toRelative()}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ChatCard;

const styles = StyleSheet.create({})