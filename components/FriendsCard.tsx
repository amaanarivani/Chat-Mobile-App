import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { instance } from '@/api/baseUrlConfig'
import UseAppContext from '@/contextApi/UseContext';
import Popup from './Popup';
import { useRouter } from 'expo-router';
import { Feather, FontAwesome6 } from '@expo/vector-icons';

const FriendsCard = ({ data, setLoading, loading, setError, setMessage }: { data: any, setLoading: any, loading: any, setError: any, setMessage: any }) => {
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();
    console.log(data, "data");

    const router = useRouter();

    const showRemoveFriendDialog = () => {
        Alert.alert('Are you Sure', `Do you want to remove ${data?.name} as your friend ?`, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Yes, remove',
                onPress: () => handleRemoveFriends()
            },
        ]);
    }

    const handleRemoveFriends = async () => {
        try {
            setLoading(true);
            const res = await instance.post(`/api/remove-friends`, {
                user_id: currentUser?._id,
                friend_id: data._id
            })
            setMessage(res?.data?.message);
            setLoading(false);
            setTimeout(() => {
                router.navigate('/(session)/home');
            }, 500);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    const handleOpenChatSession = async () => {
        router.navigate({ pathname: "/(session)/chatSession", params: { receiver_id: data?._id, receiver_name: data?.name } })
    }


    return (
        <>
            <View style={{ backgroundColor: "white", padding: 15, width: "93%", borderBottomWidth: 1, borderBottomColor: "#D9D9D9", marginBottom: 10, borderRadius: 10, marginHorizontal: "auto" }}>
                <View style={{ flexDirection: "row" }}>
                    <View style={{ marginTop: 5 }}>
                        <FontAwesome6 name="user-large" size={60} color="#00000" />
                        {/* <Image source={require("@/assets/images/avatar.png")} style={{ width: 70, height: 70, borderRadius: 100 }} /> */}
                    </View>
                    <View style={{ marginStart: 20 }}>
                        <View style={{ marginVertical: "auto" }}>
                            <Text style={{ marginStart: 10, fontSize: 17, fontWeight: "bold" }}>{data.name}</Text>
                            <Text style={{ marginStart: 10, fontSize: 13, marginTop: 5 }}>{data.email}</Text>
                        </View>

                        <View style={{ flexDirection: "row", marginTop: 10 }}>
                            <Pressable style={{ backgroundColor: "#279EFF", padding: 10, borderRadius: 10, flexDirection: "row" }}
                                onPress={handleOpenChatSession}
                            >
                                <Text style={{ fontSize: 15, color: "white" }}>
                                    {/* {
                                    loading ? "Loading..." : "Remove Friend"
                                } */}
                                    Message
                                </Text>
                                {/* <Feather name="send" size={24} color="white" /> */}
                            </Pressable>
                            <Pressable style={{ backgroundColor: "#279EFF", padding: 10, borderRadius: 10, marginStart: 20 }}
                                onPress={showRemoveFriendDialog} disabled={loading}
                            >

                                <Text style={{ fontSize: 15, color: "white" }}>
                                    {/* {
                                    loading ? "Loading..." : "Remove Friend"
                                } */}
                                    Remove Friend
                                </Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </View>
        </>
    )
}

export default FriendsCard;

const styles = StyleSheet.create({})