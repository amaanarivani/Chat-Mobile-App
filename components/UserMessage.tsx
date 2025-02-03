import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign } from '@expo/vector-icons';
// import { DateTime } from 'luxon';

const UserMessage = ({ message, index }: { message: any, index: any }) => {
    // console.log(index, "=======index-chatCount==", chatbotMessageCount);
    return (
        <View key={index} style={{ flex: 1, alignItems: "flex-end" }} onLayout={(e) => {
            // if (index == chatbotMessageCount - 1) {
            //     setLayout(e.nativeEvent.layout.y)
            // }
        }}>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
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