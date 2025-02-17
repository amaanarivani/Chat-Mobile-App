import { Image, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { instance } from '@/api/baseUrlConfig';
import Popup from '@/components/Popup';

const verifyEmailCode = () => {
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [value, setValue] = useState('');
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [codeSignup, setCodeSignup] = useState('');

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
    }, [item])

    const handleVerifyEmail = async () => {
        try {
            setIsSubmitting(true);
            const res = await instance.post(`/api/verify-email`, {
                email: email.trim().toLowerCase(),
                code: codeSignup
            })
            setMessage(res.data.message);
            setEmail("");
            setCodeSignup("");
            setIsSubmitting(false);
            setTimeout(() => {
                // setVerifyEmail(false);
                router.push("/(no-session)/signin")
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
                    {/* <View>
                    <Text style={{ fontSize: 30, fontWeight: "600", textAlign: "center" }}>Welcome Back!</Text>
                </View> */}
                    <View style={{ marginTop: 0 }}>
                        <Text style={{ fontSize: 25, fontWeight: "600", textAlign: "center", color: "black" }}>Verify Your Email</Text>
                    </View>
                    <Text style={{ fontSize: 15, marginTop: 20 }}>Please enter the 5-digit security code that was sent to your email address</Text>
                    <CodeField
                        ref={ref}
                        {...props}
                        // Use `caretHidden={false}` when users can't paste a text value, because context menu doesn't appear
                        value={codeSignup}
                        onChangeText={(e: any) => {
                            setCodeSignup(e);
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
                            onPress={handleVerifyEmail}
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

export default verifyEmailCode;

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