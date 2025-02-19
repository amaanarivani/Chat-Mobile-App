import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign, Entypo } from '@expo/vector-icons';
// import { DateTime } from 'luxon';

const AnnouncementMessage = ({ message, index, setLayout, chatMessagesCount }: { message: any, index: any, setLayout: any, chatMessagesCount: any }) => {
    // console.log(index, "=======index-chatCount==", chatMessagesCount);
    return (
        <View key={index} style={{ flex: 1, alignItems: "center" }} onLayout={(e) => {
            if (index == chatMessagesCount - 1) {
                setLayout(e.nativeEvent.layout.y)
            }
        }}>
            <View style={{ marginTop: 30, paddingBottom: 10 }}>
                <View style={{ flexDirection: "row", backgroundColor: "#2C3930", padding: 12, marginVertical: "auto", borderRadius: 10, marginEnd: 10 }}>
                    <Entypo name="megaphone" size={22} color="white" style={{marginVertical: "auto", marginEnd: 5}} />
                    <Text style={{ fontSize: 15, color: "white", marginVertical: "auto" }}>{message?.message}</Text>
                </View>
            </View>
        </View>
    )
}

export default AnnouncementMessage;

const styles = StyleSheet.create({})