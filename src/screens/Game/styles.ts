import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10
    },

    player: {
        height: 50,
        width: 50,
        position: "absolute",
    },

    sword: {
        backgroundColor: "#ff0000",
        height: 40,
        width: 40,
        position: "absolute",
    },

    enemy: {
        height: 50,
        width: 50,
        position: "absolute",
    },

    controls: {
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        position: "absolute",
        bottom: 0,
        left: 0,
        padding: 24,
        paddingBottom: 60,
    },

    directionals: {
        alignItems: "center",
        paddingLeft: 10,
    },

    leftAndRightDirectionals: {
        flexDirection: "row",
        gap: 60,
        marginVertical: 10,
    },  

    directional: {
        height: 60,
        width: 60,
        backgroundColor: "#fff",
        opacity: 0.5,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },

    actions: {
        
    },

    swordAction: {
        height: 100,
        width: 100,
        backgroundColor: "#fff",
        opacity: 0.5,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
    }
})