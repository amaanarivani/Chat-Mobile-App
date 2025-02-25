import { Platform, StyleSheet, Text, View } from 'react-native'
import React from 'react'

const NotificationCard = ({ data }: { data: any }) => {
    return (
        <View style={{marginTop: 10, backgroundColor: "#D9D9D9", padding: 15, marginHorizontal: 10, borderRadius: 10}}>
            <Text style={{fontSize: Platform.OS == "ios" ? 22 : 19, fontWeight: 600}}>{data?.title}</Text>
            <Text style={{fontSize: Platform.OS == "ios" ? 17 : 16, marginTop: 8, fontWeight: 500}}>{data?.body}</Text>
        </View>
    )
}

export default NotificationCard;

const styles = StyleSheet.create({})