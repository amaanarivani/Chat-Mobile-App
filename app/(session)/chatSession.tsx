import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '@/components/Header';
import { useLocalSearchParams } from 'expo-router';
import ChatSessionHeader from '@/components/ChatSessionHeader';

const chatSession = () => {

    const { item } = useLocalSearchParams<{ item: any }>();
    console.log(item, "user_name");
    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
                <ChatSessionHeader title={item} />
            </SafeAreaView>
        </>
    )
}

export default chatSession;

const styles = StyleSheet.create({})