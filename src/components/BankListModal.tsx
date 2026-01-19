import React from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { BottomSheet } from "@rneui/themed";
import { FlashList } from "@shopify/flash-list";
import { SCREEN_HEIGHT, hScale, wScale } from "../utils/styles/dimensions";
import ClosseModalSvg2 from "../features/drawer/svgimgcomponents/ClosseModal2";

type BankItem = {
    idno: number;
    bankName: string;
};

type Props = {
    visible: boolean;
    onClose: () => void;
    data: BankItem[];
    onSelect: (item: BankItem) => void;
    headerColor?: string;
};

const BankListModal = ({
    visible,
    onClose,
    data,
    onSelect,
    headerColor = "#f2f2f2",
}: Props) => {
    return (
        <BottomSheet isVisible={visible}>
            <View style={styles.container}>
                
                {/* Header */}
                <View style={[styles.header, { backgroundColor: headerColor }]}>
                    <Text style={styles.title}>Select Your Bank</Text>
                    <TouchableOpacity onPress={onClose}>
                        <ClosseModalSvg2 />
                    </TouchableOpacity>
                </View>

                {/* List */}
                <FlashList
                    data={data}
                    keyExtractor={(item) => item.idno.toString()}
                    estimatedItemSize={50}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.item}
                            onPress={() => onSelect(item)}
                        >
                            <Text style={styles.itemText}>
                                {item.bankName}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </BottomSheet>
    );
};

export default BankListModal;
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        height: SCREEN_HEIGHT / 1.3,
        borderTopLeftRadius: hScale(15),
        borderTopRightRadius: hScale(15),
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: wScale(12),
        borderTopLeftRadius: hScale(15),
        borderTopRightRadius: hScale(15),
    },
    title: {
        fontSize: wScale(20),
        fontWeight: "bold",
        color: "#000",
        textAlign:'center',
        flex:1
    },
    item: {
        paddingVertical: hScale(18),
        borderBottomWidth: 0.5,
        borderBottomColor: "#ddd",
        marginHorizontal: wScale(10),
    },
    itemText: {
        fontSize: wScale(18),
        color: "#000",
    },
});
