import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View, StyleSheet, TextInput } from "react-native";
import { BottomSheet } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { useSelector } from "react-redux";
import { RootState } from "../reduxUtils/store";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";
import { colors } from "../utils/styles/theme";

const BankBottomSite = ({ isbank, setisbank, setBankName, bankdata,setBankId }) => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const color1 = `${colorConfig.secondaryColor}20`;
    const [searchQuery, setSearchQuery] = useState('');
    const filteredData = bankdata.filter(item =>
        item["bankName"].toLowerCase().includes(searchQuery.toLowerCase())
    );
    const adminbanks = () => {
        return (
            <FlashList
                data={filteredData}
                renderItem={({ item }) => (
                    <View>
                        <TouchableOpacity style={styles.operatorview}
                            onPress={() => {
                                setBankId(item['iINNo'])
                                setBankName(item['bankName']);
                                setisbank(false); // Close the BottomSheet
                            }}>
                            <Text ellipsizeMode='tail' numberOfLines={1}
                                style={styles.operatornametext}>
                                {item['bankName']}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                estimatedItemSize={30}
            />
        );
    }

    return (
        <BottomSheet
            isVisible={isbank}
        >
            <View style={styles.bottomsheetview}>
                <View style={[styles.StateTitle, { backgroundColor: color1 }]}>
                    <View style={styles.titleview}>
                        <Text style={styles.stateTitletext}>
                            Select Your Bank
                        </Text>
                    </View>
                    <TouchableOpacity
                        onPress={() => setisbank(false)}
                        activeOpacity={0.7}>
                        <ClosseModalSvg2 />
                    </TouchableOpacity>
                </View>
                <TextInput
                    placeholder="Search..."
                    value={searchQuery}
                    onChangeText={text => setSearchQuery(text)}
                    style={styles.searchBar}
                    placeholderTextColor={colors.black75}
                    cursorColor={'colors.black'}
                />
                {adminbanks()}
            </View>
        </BottomSheet>
    );
};

const styles = StyleSheet.create({
    operatornametext: {
        textTransform: "capitalize",
        fontSize: wScale(20),
        color: "#000",
        flex: 1,
        borderBottomColor: "#000",
        borderBottomWidth: wScale(0.5),
        paddingVertical: hScale(30),
        marginHorizontal: wScale(10)
    },
    bottomsheetview: {
        backgroundColor: '#fff',
        height: SCREEN_HEIGHT / 1.3,
        marginHorizontal: wScale(0),
        borderTopLeftRadius: hScale(15),
        borderTopRightRadius: hScale(15),
    },
    StateTitle: {
        paddingVertical: hScale(10),
        borderTopLeftRadius: hScale(15),
        borderTopRightRadius: hScale(15),
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: wScale(10),
        marginBottom: hScale(10)
    },
    stateTitletext: {
        fontSize: wScale(22),
        color: '#000',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    titleview: {
        flex: 1,
        alignItems: 'center'
    },
    searchBar: {
        borderColor: 'gray',
        borderWidth: wScale(1),
        paddingHorizontal: wScale(15),
        marginHorizontal: wScale(10),
        marginBottom: hScale(10),
        borderRadius: 5,
        color: colors.black75,
        fontSize: wScale(16),
    },
    operatorview: {
        flexDirection: 'row-reverse',
        alignItems: 'center',
        paddingHorizontal: wScale(10),
    },
});

export default BankBottomSite;
