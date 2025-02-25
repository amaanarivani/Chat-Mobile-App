import { Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import UserAccount from './UserAccount';
import { Badge } from 'react-native-paper';
import UseAppContext from '@/contextApi/UseContext';

const Header = ({ title }: { title: any }) => {
  const { setLoggedIn, setCurrentUser, currentUser, setLoadingData, notifCount } = UseAppContext();

  const router = useRouter();
  return (
    <View style={{ backgroundColor: "#279EFF", height: Platform.OS == "android" ? 110 : 80, borderBottomLeftRadius: 50, borderBottomRightRadius: 50, paddingTop: Platform.OS == "android" ? 30 : 0 }}>
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

        <View style={{ marginStart: 20 }}>
          <View style={{ flexDirection: "row", marginStart: 10, }}>
            <Text style={{ color: "white", fontSize: 24, marginStart: 5, marginVertical: "auto", fontWeight: "600", textAlign: "center" }}>{title}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row" }}>
          <Pressable onPress={() => router.navigate("/(session)/notifications")}>
            {
              notifCount > 0 ? <>
                <Badge size={25} style={{ position: "absolute", zIndex: 1, top: -10, right: -2, fontSize: 10, backgroundColor: "#D32F2F", color: "white" }}>{notifCount}</Badge>
              </> : <>
              </>
            }
            <FontAwesome name="bell" size={28} color="white" style={{ marginEnd: 10, marginVertical: "auto" }} />
          </Pressable>
          <Pressable style={{ backgroundColor: "white", padding: 5, borderRadius: "100%", marginVertical: "auto", marginStart: 10 }}
            onPress={() => router.navigate("/(session)/userAccount")}
          >
            <UserAccount />
          </Pressable>
        </View>
      </View>
      {/* <View>
        <TextInput
          style={styles.input}
          placeholder='Search'
        />
      </View> */}
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