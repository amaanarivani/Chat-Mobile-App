import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { instance } from '@/api/baseUrlConfig'
import UseAppContext from '@/contextApi/UseContext';

const FriendsCard = ({ data }: { data: any }) => {
    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();
    console.log(data, "data");


    return (
        <View style={{ backgroundColor: "white", padding: 15, width: "93%", borderBottomWidth: 1, borderBottomColor: "#D9D9D9", marginBottom: 10, borderRadius: 10, marginHorizontal: "auto" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <Image source={require("@/assets/images/avatar.png")} style={{ width: 40, height: 40, borderRadius: 30 }} />
                    <View style={{ marginVertical: "auto" }}>
                        <Text style={{ marginStart: 10, fontSize: 17, fontWeight: "bold" }}>{data.name}</Text>
                        <Text style={{ marginStart: 10, fontSize: 13, marginTop: 5 }}>{data.email}</Text>
                    </View>
                </View>
                <View>
                    <Pressable style={{ backgroundColor: "#279EFF", padding: 10, borderRadius: 10 }}
                    // onPress={handleAddFriends}
                    >
                        <Text style={{ fontSize: 15, color: "white" }}>Message</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default FriendsCard;

const styles = StyleSheet.create({})