import { Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
// import { DateTime } from 'luxon';
// import { instance } from '@/api/baseUrlConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import CountryFlag from "react-native-country-flag";

const ChatCard = ({ data }: { data: any }) => {
    // const [nsMessage, setNsMessage] = useState(2);

    // useEffect(() => {

    //     getNotSeenCount();
    // }, [data?._id])

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

    return (
        <View style={{ backgroundColor: "white", padding: 10, width: "99%", borderBottomWidth: 1, borderBottomColor: "#D9D9D9" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginEnd: 5, marginVertical: "auto" }}>
                        {/* <FontAwesome6 name="user-large" size={Platform.OS == "android" ? 25 : 30} color="#B4B4B8" /> */}
                        <Image
                            source={require('@/assets/images/avatar.png')}
                            style={{ width: 40, height: 40 }}
                        />
                    </View>
                    <View style={{ marginStart: 2, marginVertical: "auto" }}>
                        <Text style={{ fontSize: Platform.OS == "android" ? 15 : 17, fontWeight: data?.nsMessage ? "800" : "500" }}>{data?.name}</Text>
                        <View style={{ flexDirection: "row", marginTop: 5 }}>
                            {
                                data?.lastMessage ? <>
                                    <View>
                                        <Text style={{ color: "gray", marginVertical: "auto", marginEnd: 5, fontSize: 15 }}>{data?.lastMessage}</Text>
                                    </View>
                                </> : <>
                                </>
                            }
                        </View>
                    </View>
                </View>
                <View style={{ marginVertical: "auto" }}>
                    {
                        data?.nsMessage ? <>
                            <View style={{ backgroundColor: "#6969D7", width: 25, borderRadius: 100, paddingVertical: 5, marginHorizontal: "auto" }}>
                                <Text style={{ color: "white", marginVertical: "auto", fontSize: 15, textAlign: "center" }}>{data?.nsMessage}</Text>
                            </View>
                        </> : <>
                        </>
                    }
                    <View style={{ marginTop: 10 }}>
                        <Text style={{ fontSize: 15, textAlign: "center" }}>
                            2 hours ago
                            {/* {DateTime.fromISO(data?.updated_at).toRelative()} */}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default ChatCard;

const styles = StyleSheet.create({})