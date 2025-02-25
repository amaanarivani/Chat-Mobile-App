import { baseURL, instance } from "@/api/baseUrlConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";
import { io } from "socket.io-client";

// Define a type for the context value
interface AppContextType {
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
    handleSetSocket: () => void;
    getAllUserNotificationsCount: () => void;
    currentUser: any; // Replace 'any' with a more specific type if needed
    socket: any;
    notifCount: any;
    setCurrentUser: Dispatch<SetStateAction<any>>;
    loadingData: boolean;
    setLoadingData: Dispatch<SetStateAction<boolean>>;
}

// Create the context with the appropriate type
const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [notifCount, setNotifCount] = useState<any>(0);
    const [socket, setSocket] = useState<any | null>(null);
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    // console.log(currentUser, "current user data after reload");

    useEffect(() => {
        handleCurrentUser();
        // getAllUserNotificationsCount();
    }, []);

    useEffect(() => {
        // handleCurrentUser();
        getAllUserNotificationsCount();
    }, [currentUser?._id]);

    const handleCurrentUser = async () => {
        setLoadingData(true);
        try {
            const user = await AsyncStorage.getItem('user');
            // console.log(user, "current user");

            if (user) {
                const parsedUser = JSON.parse(user);
                setCurrentUser(parsedUser.result);
                setLoggedIn(true);
                // console.log(parsedUser, "current user in context");
            } else {
                setCurrentUser(null);
                setLoggedIn(false);
            }
        } catch (error) {
            console.error("Failed to load user data from AsyncStorage:", error);
        } finally {
            setLoadingData(false);
        }
    };

    const logout = async () => {
        try {
            AsyncStorage.setItem('user', JSON.stringify({}));
            // AsyncStorage.removeItem('user');
            setLoggedIn(false);
            console.log('inside logout');
            setCurrentUser(null);
            router.push('/(no-session)/signin');
        } catch (error) {
            console.error("Failed to remove user data from AsyncStorage:", error);
        }
    };

    const handleSetSocket = async () => {

        console.log("in set socket")
        let socket: any = io(`${baseURL}`, { path: "/api/chatapp" });
        // console.log(socket, "connected")
        socket.on("connect", () => {
            console.log(socket.id, "socketid -- aauth context")
            socket.emit("user_online", { socket_id: socket.id, user_id: currentUser?._id })
            setSocket(socket)
        })
        // dispatch({ type: "SOCKET", payload: { socket, setNotificationData } })
        // console.log("otusodei ddjsoe --", user_id);


        // if (currentUser?._id) {
        //     // dispatch({ type: "CLEAR_NOTIFICATION", payload: {} })
        //     let res = await axios.post(process.env.apiUrl + `/api/get-user-notification/1`, { user_id, currentDate: DateTime.now().toUTC().toISO() }, { withCredentials: false })
        //     console.log(res, "notification data result....")
        //     let notificationlist = res?.data?.userNotification
        //     if (res?.data) {
        //         // setNotificationBadgeCount(res?.data?.nsCount)

        //         dispatch({ type: "SET_NOTIFICATION_DATA", payload: notificationlist })
        //         dispatch({ type: "SET_NOTIFICATION_COUNT", payload: res?.data?.notifCount })
        //         dispatch({ type: "SET_NOTIFICATION_BADGE_COUNT", payload: res?.data?.nsCount })

        //     }
        // }
    };

    const getAllUserNotificationsCount = async () => {
        try {
            console.log("inside notifyCount");

            const res = await instance.post(`/api/get-all-user-notifications-count`, {
                user_id: currentUser?._id
            })
            console.log(res?.data?.notifCount, "notifyCount");
            setNotifCount(res?.data?.notifCount)
        } catch (error) {

        }
    }

    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn, logout, currentUser, setCurrentUser, loadingData, setLoadingData, handleSetSocket, socket, getAllUserNotificationsCount, notifCount }}>
            {children}
        </AppContext.Provider>
    );
};

const UseAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("UseAppContext must be used within an AppProvider");
    }
    return context;
};

export default UseAppContext;
