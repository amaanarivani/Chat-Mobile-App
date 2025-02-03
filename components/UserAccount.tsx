import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { FontAwesome, FontAwesome5, FontAwesome6 } from '@expo/vector-icons';

const UserAccount = () => {
    return (
        <>
            {/* <FontAwesome5 name="user-alt" size={25} color="#279EFF" /> */}
            <FontAwesome6 name="user-large" size={25} color="#00000" />
        </>
    )
}

export default UserAccount;

const styles = StyleSheet.create({})