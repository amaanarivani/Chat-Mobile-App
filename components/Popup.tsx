import React from "react";
import { StyleSheet, Text } from "react-native";
import { Snackbar } from "react-native-paper";

const Popup = ({
    message,
    error,
    onDismissSnackBar,
}: {
    message: string;
    error: string;
    onDismissSnackBar: () => void;
}) => {
    return (
        <>
            {message || error ? (
                <Snackbar
                    style={{
                        position: "absolute",
                        width: "98%",
                        alignSelf: "center",
                        bottom: 80,
                        backgroundColor: message ? "green" : error ? "red" : "",
                        zIndex: 999,
                    }}
                    duration={2000}
                    visible={true}
                    onDismiss={onDismissSnackBar}
                    action={{
                        label: "",
                        labelStyle: {
                            color: "white",
                            fontSize: 15,
                            textDecorationLine: "underline",
                            textDecorationColor: "white",
                        },
                        icon: "close",
                        onPress: () => {
                            // Do something
                        },
                    }}
                >
                    {/* Apply different text color based on message or error */}
                    <Text style={[styles.snackbarText, { color: message ? "#fff" : "#fff" }]}>
                        {message || error}
                    </Text>
                </Snackbar>
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    snackbarText: {
        fontSize: 14, // Customize font size if needed
    },
});

export default Popup;
