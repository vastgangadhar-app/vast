// styles/common.js
import { StyleSheet } from "react-native";
import { hScale, wScale } from "./dimensions";

export const commonStyles = StyleSheet.create({
    screenContainer: {
        flex: 1,
    },
    contentContainer:{
        flex:1,
        paddingHorizontal:wScale(10),
        paddingVertical:hScale(10)
    }
});
