import { BackHandler, Image, Keyboard, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { instance } from '@/api/baseUrlConfig';
import Popup from '@/components/Popup';

const resetPassword = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('');
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [cnfPassword, setCnfPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCodeVerified, setIsCodeVerified] = useState(false);
    const [code, setCode] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [cnfPasswordVisible, setCnfPasswordVisible] = useState(false);

    const CELL_COUNT = 5;
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue })

    const router = useRouter();

    const { item } = useLocalSearchParams<{ item: any }>();
    // const parsedItem = JSON.parse(item)
    console.log(item, "params item");

    useEffect(() => {
        if (item) {
            setEmail(item);
        }
    }, [item]);

    const backHand = useRef<any>();
    useFocusEffect(useCallback(() => {

        backHand.current = BackHandler.addEventListener("hardwareBackPress", () => {
            // BackHandler.exitApp();
            router.navigate("/(no-session)/forgotPassword")
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

    const VerifyResetPasswordCode = async () => {
        Keyboard.dismiss();
        try {
            setIsSubmitting(true);
            const res = await instance.post(`/api/verify-email`, {
                email: email.toLowerCase(),
                code: code
            })
            setMessage(res.data.message);
            // setEmail("");
            // setCodeSignup("");
            setIsSubmitting(false);
            setIsCodeVerified(true);
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message)
            } else {
                setError("Something went wrong")
            }
            setIsSubmitting(false);
        }
    }

    const handleResetPassword = async () => {
        Keyboard.dismiss();
        if (!password.trim() || !cnfPassword.trim()) {
            return setError("All fields are required")
        }
        if (password.trim() != cnfPassword.trim()) {
            return setError("Password doesn't matched")
        }
        try {
            setIsSubmitting(true);
            const res = await instance.post(`/api/forget-password`, {
                email: email.toLowerCase(),
                password: password.trim(),
                // confirmPassword: cnfPassword.trim(),
                // code: code
            })
            setMessage(res?.data?.message);
            setEmail("");
            setCode("");
            setPassword("");
            setCnfPassword("");
            setTimeout(() => {
                setIsSubmitting(false);
                router.navigate("/(no-session)/signin")
                setIsCodeVerified(false);
            }, 2000);
        } catch (error: any) {
            if (error?.response?.data?.message) {
                setError(error?.response?.data?.message)
            } else {
                setError("Something went wrong")
            }
            setIsSubmitting(false);
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

                    {
                        isCodeVerified ? <>
                            <View>
                                <View style={{ marginTop: 0 }}>
                                    <Text style={{ fontSize: 25, fontWeight: "600", textAlign: "center", color: "black" }}>Create New Password</Text>
                                </View>
                                <View style={{ width: "100%", marginTop: 15 }}>
                                    <Text style={{ fontSize: 15, marginStart: 4, fontWeight: "500" }}>New Password</Text>
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
                                <View style={{ width: "100%", marginTop: 15 }}>
                                    <Text style={{ fontSize: 15, marginStart: 4, fontWeight: "500" }}>Confirm New Password</Text>
                                    <TextInput
                                        style={styles.input}
                                        placeholder="********"
                                        placeholderTextColor="#767676"
                                        value={cnfPassword}
                                        onChangeText={(e) => {
                                            setCnfPassword(e)
                                        }}
                                        secureTextEntry={!cnfPasswordVisible ? true : false}
                                    />
                                    {
                                        cnfPasswordVisible ? <>
                                            <Pressable style={{ position: "absolute", right: 20, top: "45%" }} onPress={() => { setCnfPasswordVisible(false) }}>
                                                {/* <Ionicons name="eye" size={30} color="black" /> */}
                                                <Ionicons name="eye" size={30} color="black" />
                                            </Pressable>
                                        </> : <>
                                            <Pressable style={{ position: "absolute", right: 20, top: "45%" }} onPress={() => { setCnfPasswordVisible(true) }}>
                                                <Ionicons name="eye-off" size={30} color="black" />
                                            </Pressable>
                                        </>
                                    }
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Pressable style={{ backgroundColor: "#279EFF", padding: 20, borderRadius: 15 }}
                                        onPress={handleResetPassword}
                                    >
                                        <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>
                                            {
                                                isSubmitting ? "Please wait..." : "Submit"
                                            }
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        </> : <>
                            {/* reset Password code verification */}
                            <View>
                                <View style={{ marginTop: 0 }}>
                                    <Text style={{ fontSize: 25, fontWeight: "600", textAlign: "center", color: "black" }}>OTP Verification</Text>
                                </View>
                                <Text style={{ fontSize: 15, marginTop: 20 }}>We've sent OTP to your email. Enter the OTP below to verify.</Text>
                                <CodeField
                                    ref={ref}
                                    {...props}
                                    // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                                    value={code}
                                    onChangeText={(e: any) => {
                                        setCode(e);
                                    }}
                                    cellCount={CELL_COUNT}
                                    rootStyle={styles.codeFieldRoot}
                                    keyboardType="number-pad"
                                    textContentType="oneTimeCode"
                                    renderCell={({ index, symbol, isFocused }: { index: any, symbol: any, isFocused: any }) => (
                                        <Text
                                            key={index}
                                            style={[styles.cell, isFocused && styles.focusCell]}
                                            onLayout={getCellOnLayoutHandler(index)}
                                        >
                                            {symbol || (isFocused ? <Cursor /> : null)}
                                        </Text>
                                    )}
                                />
                                <View style={{ marginTop: 20 }}>
                                    <Pressable style={{ backgroundColor: "#279EFF", padding: 20, borderRadius: 15 }}
                                        onPress={VerifyResetPasswordCode}
                                    >
                                        <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>
                                            {
                                                isSubmitting ? "Please wait..." : "Verify"
                                            }
                                        </Text>
                                    </Pressable>
                                </View>
                                <View style={{ marginTop: 20 }}>
                                    <Pressable style={{ backgroundColor: "#D9D9D9", padding: 20, borderRadius: 15 }} onPress={() => router.push("/(no-session)/signin")}>
                                        <Text style={{ color: "black", textAlign: "center", fontSize: 17, fontWeight: "600" }}>Back to Login</Text>
                                    </Pressable>
                                </View>
                            </View>
                        </>
                    }

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

export default resetPassword;

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
    codeFieldRoot: {
        marginTop: 20
    },
    cell: {
        width: 60,
        height: 60,
        lineHeight: Platform.OS == "ios" ? 55 : 38,
        fontSize: 24,
        borderWidth: 1,
        borderRadius: 10,
        borderColor: '#7C7D7E44',
        textAlign: 'center', textAlignVertical: "center",
    },
    focusCell: {
        borderColor: '#FC6011',
        color: "#7C7D7E"
    },
})