import { AntDesign, Entypo, Feather, FontAwesome, FontAwesome5, FontAwesome6, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native"

const TabNavigation = ({ pathname }: { pathname: string }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => setMenuVisible(true);
    const closeMenu = () => setMenuVisible(false);

    return (
        <View style={{ borderTopColor: "#8f8f8f44", borderTopWidth: 0.5, position: "absolute", zIndex: 100, bottom: 0, height: 85, width: "100%", flexDirection: "row", justifyContent: "space-around", alignContent: "center", alignItems: "center", backgroundColor: '#ffff', }}>
            <Pressable onPress={() => { router.push("/(session)/home") }} style={{ width: "30%" }}>
                <View style={styles.tabItemV}>
                    {/* <Entypo name='home' color={pathname == "/home" ? "#279EFF" : "#8f8f8f"} size={30} /> */}
                    {/* <FontAwesome5 name="inbox" color={pathname == "/home" ? "#279EFF" : "#8f8f8f"} size={30} /> */}
                    <Entypo name="chat" color={pathname == "/home" ? "#279EFF" : "#8f8f8f"} size={34} />
                    <Text style={{ color: `${pathname == "/home" ? "#279EFF" : "#8f8f8f"}`, fontSize: 15, marginTop: 4 }} >Chats</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => { router.push("/(session)/addFriend") }} style={{ width: "30%" }}>
                <View style={styles.tabItemV}>
                    <MaterialIcons name="add-circle-outline" color={pathname == "/addFriend" ? "#279EFF" : "#8f8f8f"} size={38} />
                    <Text style={{ color: `${pathname == "/addFriend" ? "#279EFF" : "#8f8f8f"}`, fontSize: 15, marginTop: 1 }} >Add</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => { router.push("/(session)/myFriends") }} style={{ width: "30%" }}>
                <View style={styles.tabItemV}>
                    {/* <FontAwesome5 name="robot" color={pathname == "/chatbots" ? "#279EFF" : "#8f8f8f"} size={28} /> */}
                    <FontAwesome5 name="user-friends" color={pathname == "/myFriends" ? "#279EFF" : "#8f8f8f"} size={30} />
                    <Text style={{ color: `${pathname == "/myFriends" ? "#279EFF" : "#8f8f8f"}`, fontSize: 15, marginTop: 4 }} >Friends</Text>
                </View>
            </Pressable>

        </View>
    )
}
const styles = StyleSheet.create({
    tabItemV: {
        display: "flex",
        alignItems: 'center'
    }
})
export default TabNavigation;