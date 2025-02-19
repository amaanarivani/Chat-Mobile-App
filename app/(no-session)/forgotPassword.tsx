import { BackHandler, Image, Keyboard, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { useFocusEffect, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { instance } from '@/api/baseUrlConfig';
import Popup from '@/components/Popup';

const forgotPassword = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    const backHand = useRef<any>();
    useFocusEffect(useCallback(() => {

        backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {
            // BackHandler.exitApp();
            router.navigate("/(no-session)/signin")
            console.log("22");
            return true;
        })
        return () => {
            console.log("cl");

            backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {

                // try {

                //   if(state?.isSignIn){

                //     router.navigate("/(session)/home");
                //   }
                // } catch (error) {

                // }
                return true
            })
        }
    }, []))

    const handleCodeForgotPassword = async () => {
        try {
            Keyboard.dismiss();
            setLoading(true);
            const res = await instance.post(`/api/forget-password-otp`, {
                email: email.toLowerCase()
            })
            setMessage(res?.data?.message);
            setTimeout(() => {
                setLoading(false);
                router.navigate({ pathname: "/(no-session)/resetPassword", params: { item: email } })
            }, 2000);
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message)
            } else {
                setError("Something went wrong")
            }
            setLoading(false);
        }
    }


    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "#279EFF" }}>
                <View style={{ flexDirection: "row", justifyContent: "space-between", width: "95%", marginHorizontal: "auto", marginTop: 20 }}>
                    <Pressable onPress={() => router.back()}>
                        <Ionicons name="arrow-back-sharp" size={26} color="white" />
                    </Pressable>
                </View>
                <View style={{ marginTop: "10%", flexDirection: 'row', justifyContent: 'center' }}>
                    <Ionicons name="chatbubbles-outline" size={60} color="white" />
                    <Text style={{ fontSize: 60, fontWeight: "800", color: "white", marginStart: 5 }}>Convo</Text>
                </View>
                {/* <View style={{ width: "90%", backgroundColor: "#D1D1F0", padding: 6, marginHorizontal: "auto", marginTop: 30, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}></View> */}
                <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 30, }} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps={'handled'}>
                    {/* <View>
                    <Text style={{ fontSize: 30, fontWeight: "600", textAlign: "center" }}>Welcome Back!</Text>
                </View> */}
                    <View style={{ marginTop: 0 }}>
                        <Text style={{ fontSize: 25, fontWeight: "600", textAlign: "center", color: "black" }}>Reset Your Password</Text>
                    </View>
                    <View style={{ width: "100%", marginTop: 25 }}>
                        <Text style={{ fontSize: 15, marginStart: 4, fontWeight: "500" }}>Email Address</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="name@example.com"
                            placeholderTextColor="#767676"
                            value={email}
                            onChangeText={(e) => {
                                setEmail(e)
                            }}
                        />
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ backgroundColor: "#279EFF", padding: 20, borderRadius: 15 }}
                            onPress={handleCodeForgotPassword}
                        >
                            <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>
                                {
                                    loading ? "Please wait..." : "Submit"
                                }
                            </Text>
                        </Pressable>
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ backgroundColor: "#D9D9D9", padding: 20, borderRadius: 15 }} onPress={() => router.push("/(no-session)/signin")}>
                            <Text style={{ color: "black", textAlign: "center", fontSize: 17, fontWeight: "600" }}>Back to Login</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Popup
                message={message}
                error={error}
                onDismissSnackBar={() => {
                    setMessage("");
                    setError("");
                }}
            />
        </>
    )
}

export default forgotPassword;

const styles = StyleSheet.create({
    input: {
        width: "100%",
        borderRadius: 10,
        padding: 20,
        borderColor: "#D9D9D9",
        borderWidth: 1,
        backgroundColor: "white",
        marginTop: 5,
        // marginStart: 20
    },
})