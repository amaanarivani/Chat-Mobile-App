import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AntDesign, FontAwesome6 } from '@expo/vector-icons';
// import { DateTime } from 'luxon';

const ClientMessage = ({ message, index }: { message: any, index: any }) => {
    // console.log(index, "=======index-chatCount==", chatbotMessageCount);
    return (
        <View
            key={index}
            onLayout={(e) => {
                // if (index == chatbotMessageCount - 1) {

                //     setLayout(e.nativeEvent.layout.y)
                // }
            }}>
            <View style={{ flexDirection: "row", marginTop: 30 }}>
                {/* <View style={{ marginVertical: "auto", marginStart: 5, backgroundColor: "#C7C8CC", padding: 5, borderRadius: 100 }}> */}
                <View style={{ marginVertical: "auto", marginStart: 5, backgroundColor: "#ffffff", padding: 5, borderRadius: 100 }}>
                    {/* <FontAwesome6 name="user-large" size={22} color="#ffffff" style={{}} /> */}
                    <Image
                    source={require("@/assets/images/avatar.png")}
                    style={{width: 30, height: 30}}
                    />

                </View>
                <View style={{}}>
                    <View style={{ backgroundColor: "#D8D9DA", padding: 15, marginVertical: "auto", marginStart: 10, borderRadius: 100 }}>
                        <Text style={{ fontSize: 17, color: "black" }}>{message?.message}</Text>
                    </View>
                </View>
            </View>
            {/* <View style={{ marginStart: 50, marginTop: 10 }}>
                <Text style={{ fontSize: 13, color: "gray" }}>{DateTime.fromISO(message?.created_at).toFormat("hh:mm a")}</Text>
            </View> */}
        </View>
    )
}

export default ClientMessage;

const styles = StyleSheet.create({})