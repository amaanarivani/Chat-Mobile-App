import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { usePathname } from 'expo-router'
import Header from '@/components/Header'
import TabNavigation from '@/components/TabNavigation'

const myFriends = () => {
    const pathname = usePathname()
    return (
        <>
        <SafeAreaView>
            <Header title="My Friends"/>
        </SafeAreaView>
        <TabNavigation pathname={pathname}/>
        </>
    )
}

export default myFriends

const styles = StyleSheet.create({})