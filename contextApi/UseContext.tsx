import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from "react";

// Define a type for the context value
interface AppContextType {
    loggedIn: boolean;
    setLoggedIn: Dispatch<SetStateAction<boolean>>;
    logout: () => void;
    currentUser: any; // Replace 'any' with a more specific type if needed
    setCurrentUser: Dispatch<SetStateAction<any>>;
    loadingData: boolean;
    setLoadingData: Dispatch<SetStateAction<boolean>>;
}

// Create the context with the appropriate type
const AppContext = createContext<AppContextType | null>(null);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<any | null>(null);
    const [loadingData, setLoadingData] = useState(true);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const router = useRouter();

    // console.log(currentUser, "current user data after reload");

    useEffect(() => {
        handleCurrentUser();
    }, []);

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

    return (
        <AppContext.Provider value={{ loggedIn, setLoggedIn, logout, currentUser, setCurrentUser, loadingData, setLoadingData }}>
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
