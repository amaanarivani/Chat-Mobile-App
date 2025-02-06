import { Image, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Entypo, Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserAccount from './UserAccount';

const ChatSessionHeader = ({ title }: { title: any }) => {

    const router = useRouter();
    return (
        <View style={{ backgroundColor: "#279EFF", height: Platform.OS == "android" ? 110 : 90, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, paddingTop: Platform.OS == "android" ? 30 : 0 }}>
            <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <Pressable style={{ marginStart: 10 }} onPress={() => router.back()}>
                        <Ionicons name="arrow-back-sharp" size={26} color="white" />
                    </Pressable>
                </View>

                <View style={{  }}>
                    <View style={{ flexDirection: "row" }}>
                        <Image
                            source={require("@/assets/images/avatar.png")}
                            style={{ width: 30, height: 30, borderRadius: 100, marginVertical: "auto" }}
                        />
                        <Text style={{ color: "white", fontSize: 20, marginStart: 5, marginVertical: "auto", fontWeight: "600", textAlign: "center" }}>{title}</Text>
                    </View>
                    <View style={{ flexDirection: "row", marginHorizontal: "auto" }}>
                        <Text style={{ color: "#90EE90", marginEnd: 5, fontSize: 10, marginTop: 6 }}>&#9679;</Text>
                        <Text style={{ color: "white", fontSize: 13, textAlign: "center", marginTop: 5 }}>Online</Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    {/* <Ionicons name="call" size={28} color="white" style={{marginEnd: 10, marginTop: 5}} /> */}
                    <Entypo name="dots-three-vertical" size={24} color="white" style={{ marginTop: 5 }} />
                    {/* <Pressable style={{ backgroundColor: "white", padding: 5, borderRadius: "100%", marginVertical: "auto" }}
                    // onPress={() => router.navigate("/(session)/userAccount")}
                    >
                        <UserAccount />
                    </Pressable> */}
                </View>
            </View>
        </View>
    )
}

export default ChatSessionHeader;

const styles = StyleSheet.create({
    input: {
        width: "80%",
        borderRadius: 10,
        padding: 15,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        backgroundColor: "white",
        // marginTop: 5,
        marginHorizontal: "auto",
        // marginStart: 20
    },
})