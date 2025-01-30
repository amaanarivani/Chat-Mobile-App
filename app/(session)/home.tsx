import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import { usePathname } from 'expo-router';

const home = () => {

    const pathname = usePathname()
    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "white" }}>
                <Header title="Chats" />
            </SafeAreaView>
            <TabNavigation pathname={pathname} />
        </>
    )
}

export default home;

const styles = StyleSheet.create({})