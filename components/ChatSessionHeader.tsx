import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserAccount from './UserAccount';

const ChatSessionHeader = ({ title }: { title: any }) => {

    const router = useRouter();
    return (
        <View style={{ backgroundColor: "#279EFF", height: Platform.OS == "android" ? 110 : 90, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, paddingTop: Platform.OS == "android" ? 30 : 0 }}>    
            <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between" }}>
                <Pressable onPress={() => router.back()}>
                    <Ionicons name="arrow-back-sharp" size={26} color="white" />
                </Pressable>

                <View>
                    <View style={{  }}>
                        <Text style={{ color: "white", fontSize: 20, marginStart: 5, marginVertical: "auto", fontWeight: "600", textAlign: "center" }}>{title}</Text>
                        <View style={{flexDirection: "row", marginHorizontal: "auto"}}>
                            <Text style={{ color: "#90EE90", marginEnd: 5, fontSize: 10, marginTop: 6 }}>&#9679;</Text>
                            <Text style={{ color: "white", fontSize: 13, textAlign: "center", marginTop: 5 }}>Online</Text>
                        </View>
                    </View>
                </View>
                <Pressable style={{ backgroundColor: "white", padding: 5, borderRadius: "100%", marginVertical: "auto" }}
                // onPress={() => router.navigate("/(session)/userAccount")}
                >
                    <UserAccount />
                </Pressable>
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