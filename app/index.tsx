import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useRouter } from 'expo-router'

const index = () => {

    const router = useRouter();

    const checkLogin = () => {
        router.navigate("/(session)/home")
    }

    useEffect(() => {
        setTimeout(() => {
            checkLogin();
        }, 1000);
    }, [])

    return (
        <ImageBackground
            source={require('@/assets/images/splash-icon.png')}
            style={{ flex: 1, justifyContent: "center" }}
        >
        </ImageBackground>
    )
}

export default index;

const styles = StyleSheet.create({})