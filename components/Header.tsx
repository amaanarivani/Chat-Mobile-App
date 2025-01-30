import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Feather, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserAccount from './UserAccount';

const Header = ({ title }: { title: any }) => {

  const router = useRouter();
  return (
    <View style={{ backgroundColor: "#6969D7", height: 130, borderBottomLeftRadius: 50, borderBottomRightRadius: 50 }}>
      <View style={{ padding: 15, flexDirection: "row", justifyContent: "space-between" }}>
        {
          title == "Chats" ? <>
            <View></View>
          </> : <>
            <Pressable onPress={() => router.back()}>
              <Ionicons name="arrow-back-sharp" size={26} color="white" />
            </Pressable>
          </>
        }

        <View>
          <View style={{ flexDirection: "row", marginStart: 10 }}>
            <Text style={{ color: "white", fontSize: 24, marginStart: 5, marginVertical: "auto", fontWeight: "600", textAlign: "center" }}>{title}</Text>
          </View>
        </View>
        <Pressable style={{ backgroundColor: "white", padding: 5, borderRadius: "100%", marginVertical: "auto" }}
        // onPress={() => router.navigate("/(session)/userAccount")}
        >
          <UserAccount />
        </Pressable>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder='Search'
        />
      </View>
    </View>
  )
}

export default Header;

const styles = StyleSheet.create({
  input: {
    width: "80%",
    borderRadius: 10,
    padding: 15,
    borderColor: "#D9D9D9",
    borderWidth: 1,
    backgroundColor: "white",
    // marginTop: 5,
    marginHorizontal: "auto",
    // marginStart: 20
  },
})