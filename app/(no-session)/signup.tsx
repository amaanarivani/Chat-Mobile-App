import { BackHandler, Image, Keyboard, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View, ViewStyle } from 'react-native'
import React, { useCallback, useRef, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { instance } from '@/api/baseUrlConfig';
// import { Provider } from '@/contextApi/AuthContext';
import Popup from '@/components/Popup';
import { Modal, Portal } from 'react-native-paper';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';

const signup = () => {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cnfPassword, setCnfPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [verifyEmail, setVerifyEmail] = useState(false);
  const [value, setValue] = useState('');
  const [codeSignup, setCodeSignup] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [cnfPasswordVisible, setCnfPasswordVisible] = useState(false);

  const CELL_COUNT = 5;
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue })
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

  const modalCloseSignup = () => {
    setVerifyEmail(false);
    // setShowSignUp(false);
    setIsSubmitting(false);
  }


  const containerStyle: ViewStyle = {
    width: '90%',
    alignSelf: 'center' as const,
    justifyContent: 'center' as const,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  };

  const handleSignUp = async () => {
    Keyboard.dismiss();

    setError("");
    setMessage("");
    // setVisibleSnack(false);
    if (
      name.trim() == "" ||
      email.trim().toLowerCase() == "" ||
      password.trim() == ""
      // address.trim() == "" ||
      // phone.trim() == ""
    ) {
      setError("All fields are required.");
      // setVisibleSnack(true);
      return;
    }
    if (
      !email
        .trim()
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setError("Please enter a valid email.");
      // setVisibleSnack(true);
      return;
    }
    if (password.trim()) {
      if (
        !password
          .trim()
          .match(
            /^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,16}$/gm
          )
      ) {
        let abspass = password.trim();
        let special = false;
        let smallChar = false;
        let capitalChar = false;
        let numeric = false;
        let emptySpace = false;

        if (abspass.length < 8 || abspass.length > 16) {
          setError("Password length should be from 8 to 16 characters");
          // setVisibleSnack(true);
          return;
        }

        let chararr = abspass.split("");

        for (let i = 0; i < chararr.length; i++) {
          let chcode = chararr[i].charCodeAt(0);
          if (chcode == 32) {
            emptySpace = true;
            break;
          }

          if (!special) {
            if (
              chcode == 33 ||
              chcode == 64 ||
              chcode == 35 ||
              chcode == 36 ||
              chcode == 37 ||
              chcode == 38 ||
              chcode == 42
            ) {
              special = true;
            }
          }
          if (!smallChar) {
            if (chcode >= 97 && chcode <= 122) {
              smallChar = true;
            }
          }
          if (!capitalChar) {
            if (chcode >= 65 && chcode <= 90) {
              capitalChar = true;
            }
          }

          if (!numeric) {
            if (chcode >= 48 && chcode <= 57) {
              numeric = true;
            }
          }
        }
        if (emptySpace) {
          setError("Space not allowed in password");
          // setVisibleSnack(true);
          return;
        }

        if (!special) {
          setError("Atleast one special character is required in password");
          // setVisibleSnack(true);
        }

        if (!smallChar) {
          setError("Atleast one small character is required in password");
          // setVisibleSnack(true);
        }

        if (!capitalChar) {
          setError("Atleast one capital character is required in password");
          // setVisibleSnack(true);
        }

        if (!numeric) {
          setError("Atleast one number is required in password");
          // setVisibleSnack(true);
        }
        return;
      }
    }
    if (password.trim() != cnfPassword.trim()) {
      setError("Password not matched.");
      // setVisibleSnack(true);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

      const res = await instance.post(`/api/signup`, {
        email: email.trim().toLowerCase(),
        name,
        password,
        // landmark: address,
        // phone,
        // request_origin: "app",
      });
      setMessage(res.data.message);
      setTimeout(() => {
        router.navigate({ pathname: "/(no-session)/verifyEmailCode", params: { item: email } })
      }, 2000);
      // setVerifyEmail(true);
      // showModal();
      setName("");
      // setEmail("");
      setPassword("");
      setCnfPassword("")
      // setPhone("");
      // setAddress("");
      setLoading(false);
      // setTimeout(() => {
      //   hideCreateAccountModal();
      //   showModalVerify();
      // }, 3000);
    } catch (err: any) {
      let errMsg = err?.response?.data?.message
        ? err?.response?.data?.message
        : err + "";
      setError(errMsg);
      // setVisibleSnack(true);
      setLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    Keyboard.dismiss();
    try {
      setIsSubmitting(true);
      const res = await instance.post(`/api/verify-email-code`, {
        email: email,
        code: codeSignup
      })
      setMessage(res.data.message);
      setEmail("");
      setCodeSignup("");
      setIsSubmitting(false);
      setTimeout(() => {
        setVerifyEmail(false);
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
      {/* <Provider> */}
      <SafeAreaView style={{ height: "100%", backgroundColor: "#279EFF" }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", width: "95%", marginHorizontal: "auto", marginTop: 20 }}>
          <View>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back-sharp" size={26} color="white" />
            </Pressable>
          </View>
          <View style={{ flexDirection: "row" }}>
            <Text style={{ fontSize: 16, marginVertical: "auto", color: "white", fontWeight: 600 }}>Already have an account?</Text>
            <Pressable style={{ backgroundColor: "white", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 25, marginStart: 5 }} onPress={() => router.push("/(no-session)/signin")}>
              <Text style={{ color: "black" }}>signin</Text>
            </Pressable>
          </View>
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
            <Text style={{ fontSize: 25, fontWeight: "600", textAlign: "center", color: "black" }}>Sign up to your Account</Text>
          </View>
          <View style={{ width: "100%", marginTop: 15 }}>
            <Text style={{ fontSize: 15, marginStart: 4, fontWeight: "500" }}>Name</Text>
            <TextInput
              style={styles.input}
              placeholder="John Brown"
              placeholderTextColor="#767676"
              value={name}
              onChangeText={(e) => {
                setName(e)
              }}
            />
          </View>
          <View style={{ width: "100%", marginTop: 15 }}>
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
          <View style={{ width: "100%", marginTop: 15 }}>
            <Text style={{ fontSize: 15, marginStart: 4, fontWeight: "500" }}>Confirm Password</Text>
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
          <View style={{ marginTop: 15 }}>
            <Pressable style={{ backgroundColor: "#279EFF", padding: 20, borderRadius: 15 }} onPress={handleSignUp} disabled={loading}>
              {
                loading ? <>
                  <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>Loading...</Text>
                </> : <>
                  <Text style={{ color: "white", textAlign: "center", fontSize: 17 }}>Sign up</Text>
                </>
              }
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
      {/* </Provider> */}

      {/* Email otp Verification modal */}
      {/* <Portal>
        <Modal visible={verifyEmail}
          contentContainerStyle={containerStyle}
        >
          <Text style={{ fontSize: 20, fontWeight: "600" }}>Verify your email</Text>
          <Text style={{ fontSize: 15, }}>Please enter the 5-digit security code that was sent to your email address</Text>
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
          <View style={{ flexDirection: "row", marginTop: 15 }}>
            <Pressable style={{ backgroundColor: "#6969D7", padding: 15, borderRadius: 10, marginEnd: 10 }}
              onPress={handleVerifyEmail}
            >
              <Text style={{ color: "white" }}>
                {
                  isSubmitting ? "Loading...." : "Verify"
                }
              </Text>
            </Pressable>
            <Pressable style={{ borderWidth: 1, borderColor: "#D9D9D9", padding: 15, borderRadius: 10, marginEnd: 10 }}
              onPress={modalCloseSignup}
            >
              <Text>Cancel</Text>
            </Pressable>
          </View>
        </Modal>
      </Portal > */}
    </>
  )
}

export default signup;

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