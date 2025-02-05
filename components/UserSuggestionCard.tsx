import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const UserSuggestionCard = ({ data }: { data: any }) => {
    return (
        <View style={{ backgroundColor: "white", padding: 15, width: "93%", borderBottomWidth: 1, borderBottomColor: "#D9D9D9", marginBottom: 10, borderRadius: 10, marginHorizontal: "auto" }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <View style={{ flexDirection: "row" }}>
                    <Image source={require("@/assets/images/avatar.png")} style={{ width: 50, height: 50, borderRadius: 30 }} />
                    <View>
                        <Text style={{ marginStart: 10, fontSize: 17, fontWeight: "bold" }}>{data.name}</Text>
                        <Text style={{ marginStart: 10, fontSize: 12, fontWeight: "bold", marginTop: 5 }}>{data.email}</Text>
                    </View>
                </View>
                <View>
                    <Pressable style={{ backgroundColor: "#279EFF", padding: 10, borderRadius: 10 }}>
                        <Text style={{ fontSize: 15, color: "white" }}>Add friend</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export default UserSuggestionCard;

const styles = StyleSheet.create({})