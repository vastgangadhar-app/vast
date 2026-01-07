import React from "react";
import { ActivityIndicator, StyleSheet } from "react-native";
import { wScale } from "../utils/styles/dimensions";
import { colors } from "../utils/styles/theme";
const ShowLoader = () => {
    return (
        <ActivityIndicator
            size={wScale(60)}
            color={colors.black}
            style={styles.loaderStyle}
        />
    )
}
const styles = StyleSheet.create({
    loaderStyle: { position: "absolute", top: 0, bottom: 0, left: 0, right: 0, zIndex: 999 },

})
export default ShowLoader