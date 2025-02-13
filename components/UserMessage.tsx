import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
// import { DateTime } from 'luxon';

const UserMessage = ({ message, index, setLayout, chatMessagesCount }: { message: any, index: any, setLayout: any, chatMessagesCount: any }) => {
    // console.log(index, "=======index-chatCount==", chatMessagesCount);
    return (
        <View key={index} style={{ flex: 1, alignItems: "flex-end" }} onLayout={(e) => {
            if (index == chatMessagesCount - 1) {
            setLayout(e.nativeEvent.layout.y)
            }
        }}>
            <View style={{ flexDirection: "row", marginTop: 30, paddingBottom: 10 }}>
                <View style={{}}>
                    <View style={{ backgroundColor: "#279EFF", padding: 15, marginVertical: "auto", borderRadius: 100, marginEnd: 10 }}>
                        <Text style={{ fontSize: 17, color: "white" }}>{message?.message}</Text>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default UserMessage;

const styles = StyleSheet.create({})