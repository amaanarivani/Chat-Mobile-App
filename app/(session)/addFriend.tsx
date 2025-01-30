import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import TabNavigation from '@/components/TabNavigation'
import { usePathname } from 'expo-router'
import Header from '@/components/Header'

const addFriend = () => {

    const pathname = usePathname()
    return (
        <>
        <SafeAreaView>
            <Header title="Add Friends"/>
        </SafeAreaView>
        <TabNavigation pathname={pathname}/>
        </>
    )
}

export default addFriend

const styles = StyleSheet.create({})