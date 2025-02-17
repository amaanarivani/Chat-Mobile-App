import { BackHandler, Image, Keyboard, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useContext, useRef, useState } from 'react'
import { useFocusEffect, usePathname, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { instance } from '@/api/baseUrlConfig';
import Popup from '@/components/Popup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UseAppContext from '@/contextApi/UseContext';

const signin = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(true);

    const { setLoggedIn, setCurrentUser, currentUser, setLoadingData } = UseAppContext();

    const router = useRouter();
    const pathname = usePathname();

    const backHand = useRef<any>();
    useFocusEffect(useCallback(() => {

        backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {
            BackHandler.exitApp();
            // router.navigate("/(no-session)/welcome")
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

    const handleSigin = async () => {
        if (!email.trim() || !password.trim()) {
            setError("Email or Password is empty")
            return;
        }
        try {
            setLoading(true);
            const res = await instance.post(`/api/signin`, {
                email: email.toLowerCase(),
                password: password
            });

            // Check if the response status is 200
            if (res.status === 200) {
                setMessage(res.data.message)
                setTimeout(() => {
                    router.push("/(session)/home");
                }, 1000);
                AsyncStorage.setItem('user', JSON.stringify(res.data));
                AsyncStorage.setItem('token', JSON.stringify(res.data?.result?.token));
                setLoggedIn(true);
                // console.log(res?.data, "before setting current user");
                setCurrentUser(res?.data?.result);
                // handleSigninNotification(res?.data?.data)
                setLoadingData(false);
            }
            setEmail('');
            setPassword('');
            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            if (error?.response?.data?.message == "Email not verified") {
                setError(error.response.data.message);
                setIsEmailVerified(false);
            } else {
                setError(error?.response?.data?.message);
            }
        }
    };

    const handleVerifyEmail = async () => {
        try {
            const res = await instance.post(`/api/verify-email-login`, {
                // type: "email_verification",
                email: email.trim().toLowerCase()
            })
            setMessage(res?.data?.message);
            setTimeout(() => {
                router.navigate({ pathname: "/(no-session)/verifyEmailCode", params: { item: email.trim().toLowerCase() } })
            }, 2000);
        } catch (error: any) {
            if (error?.response?.data?.message) {
                console.log(error?.response?.data?.message, "resend verification code error");
                setError(error?.response?.data?.message)
            } else {
                setError("Something went wrong")
            }
        }
    }


    return (
        <>
            <SafeAreaView style={{ height: "100%", backgroundColor: "#279EFF" }}>
                <View style={{ backgroundColor: "#279EFF", height: Platform.OS == "android" ? 110 : 80, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, paddingTop: Platform.OS == "android" ? 30 : 0 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", width: "95%", marginHorizontal: "auto", marginTop: 20 }}>
                        <View>
                            <Pressable
                            // onPress={() => router.navigate("/(no-session)/welcome")}
                            >
                                <Ionicons name="arrow-back-sharp" size={26} color="white" />
                            </Pressable>
                        </View>
                        <View style={{ flexDirection: "row" }}>
                            <Text style={{ fontSize: 16, marginVertical: "auto", color: "white", fontWeight: 600 }}>Don't have an account yet?</Text>
                            <Pressable style={{ backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginStart: 5 }}
                                onPress={() => router.push("/(no-session)/signup")}
                            >
                                <Text style={{ color: "black" }}>signup</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
                <View style={{ marginTop: "10%", flexDirection: 'row', justifyContent: 'center' }}>
                    <Ionicons name="chatbubbles-outline" size={60} color="white" />
                    <Text style={{ fontSize: 60, fontWeight: "800", color: "white", marginStart: 5 }}>Convo</Text>
                </View>
                {/* <View style={{ width: "90%", backgroundColor: "#D1D1F0", padding: 6, marginHorizontal: "auto", marginTop: 30, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}></View> */}
                <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, marginTop: 30, height: "100%" }} automaticallyAdjustKeyboardInsets keyboardShouldPersistTaps={'handled'}>
                    <View style={{ marginTop: 0 }}>
                        <Text style={{ fontSize: 25, fontWeight: "600", textAlign: "center", color: "black" }}>Sign in to your Account</Text>
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
                    {
                        isEmailVerified ? <>
                        </> : <>
                            <Pressable style={{ marginTop: 5, marginStart: 5 }} onPress={handleVerifyEmail}>
                                <Text style={{ fontSize: 15, color: "blue" }}>Verify Email</Text>
                            </Pressable>
                        </>
                    }
                    <View style={{ width: "100%", marginTop: 15 }}>
                        <Text style={{ fontSize: 15, marginStart: 4, fontWeight: "500" }}>Password</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="********"
                            placeholderTextColor="#767676"
                            value={password}
                            onChangeText={(e) => {
                                setPassword(e)
                            }}
                            secureTextEntry={!passwordVisible ? true : false}
                        />
                        {
                            passwordVisible ? <>
                                <Pressable style={{ position: "absolute", right: 20, top: "45%" }} onPress={() => { setPasswordVisible(false) }}>
                                    {/* <Ionicons name="eye" size={30} color="black" /> */}
                                    <Ionicons name="eye" size={30} color="black" />
                                </Pressable>
                            </> : <>
                                <Pressable style={{ position: "absolute", right: 20, top: "45%" }} onPress={() => { setPasswordVisible(true) }}>
                                    <Ionicons name="eye-off" size={30} color="black" />
                                </Pressable>
                            </>
                        }
                    </View>
                    <View style={{ marginTop: 20 }}>
                        <Pressable style={{ backgroundColor: "#279EFF", padding: 20, borderRadius: 15 }} onPress={handleSigin}>
                            <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>
                                {
                                    loading ? "Please wait..." : "Signin"
                                }
                            </Text>
                        </Pressable>
                    </View>
                    <View>
                        <Text style={{ marginTop: 25, color: "gray", fontSize: 18, textAlign: "center", fontWeight: "600" }}
                            onPress={() => router.push("/(no-session)/forgotPassword")}
                        >Forgot your Password?</Text>
                    </View>
                </ScrollView>
            </SafeAreaView >
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

export default signin;

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