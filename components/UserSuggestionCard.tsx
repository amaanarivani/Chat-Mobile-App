import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { instance } from '@/api/baseUrlConfig'
import UseAppContext from '@/contextApi/UseContext';
import { useRouter } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';

const UserSuggestionCard = ({ data, setLoading, loading, setError, setMessage }: { data: any, setLoading: any, loading: any, setError: any, setMessage: any }) => {
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();
    const router = useRouter();

    const showAddFriendDialog = () => {
        Alert.alert('Are you Sure', `Do you want to add ${data?.name} as your friend ?`, [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            },
            {
                text: 'Yes, add',
                onPress: () => handleAddFriends()
            },
        ]);
    }

    const handleAddFriends = async () => {
        try {
            setLoading(true);
            const res = await instance.post(`/api/add-friends`, {
                user_id: currentUser?._id,
                friend_id: data._id
            })
            setMessage(res?.data?.message);
            setLoading(false);
            setTimeout(() => {
                router.navigate("/(session)/home")
            }, 500);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    }

    return (
        <View style={{ backgroundColor: "white", padding: 15, width: "93%", borderBottomWidth: 1, borderBottomColor: "#D9D9D9", marginBottom: 10, borderRadius: 10, marginHorizontal: "auto" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    {/* <Image source={require("@/assets/images/avatar.png")} style={{ width: 40, height: 40, borderRadius: 30 }} /> */}
                    <FontAwesome6 name="user-large" size={30} color="#00000" />
                    <View style={{ marginVertical: "auto" }}>
                        <Text style={{ marginStart: 10, fontSize: 17, fontWeight: "bold" }}>{data.name}</Text>
                        <Text style={{ marginStart: 10, fontSize: 13, marginTop: 5 }}>{data.email}</Text>
                    </View>
                </View>
                <View>
                    <Pressable style={{ backgroundColor: "#279EFF", padding: 10, borderRadius: 10 }} onPress={showAddFriendDialog} disabled={loading}>
                        <Text style={{ fontSize: 15, color: "white" }}>
                            {/* {
                                loading ? "Loading..." : "Add Friend"
                            } */}
                            Add Friend
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default UserSuggestionCard;

const styles = StyleSheet.create({})