import { instance } from '@/api/baseUrlConfig';
import Popup from '@/components/Popup';
import UseAppContext, { AppProvider } from '@/contextApi/UseContext';
import { Entypo } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { BackHandler, Image, ImageBackground, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native';

function Index(props: any) {
    const [message, setMessage] = useState<string>("");
    const [error, setError] = useState<string>("");
    const router = useRouter();
    const backHand = useRef<any>();
    const [loadingsignIn, setLoadingsignIn] = useState(false);

    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    const checkLogin = async () => {
        try {
            setLoadingsignIn(true);
            let userLogin: any = await AsyncStorage.getItem("user")
            const user: any = JSON.parse(userLogin);
            console.log(user?.result?.name, "check user");
            if (user?.result) {
                router.push('/(session)/home');
            }
            else {
                router.push('/(no-session)/signin')
            }
            setLoadingsignIn(false);
        } catch (error) {
            console.log(error);
            setLoadingsignIn(false);
        }
    }
    useFocusEffect(() => {
        // if (!hasFetched.current) {
        //     checkLogin()
        //     hasFetched.current = true;
        // }
        checkLogin()
    })

    useFocusEffect(() => {
        backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {
            BackHandler.exitApp();
            return true;
        });
        return () => {
            console.log("This route is now unfocused.-onsignin");
        };
    });


    return (
        <>
            <AppProvider>
                <ImageBackground
                    source={require('@/assets/images/splash-icon.png')}
                    style={{ flex: 1, justifyContent: "center" }}
                ></ImageBackground>
                <Popup
                    message={message}
                    error={error}
                    onDismissSnackBar={() => {
                        setMessage("");
                        setError("");
                    }}
                />
            </AppProvider>
        </>
    );
};

export default Index;

const styles = StyleSheet.create({
})
