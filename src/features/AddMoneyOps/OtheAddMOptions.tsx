import React from "react"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { hScale, wScale } from "../../utils/styles/dimensions"
import { commonStyles } from "../../utils/styles/commonStyles"
import BorderLine from "../../components/BorderLine"
import { useSelector } from "react-redux"
import { RootState } from "../../reduxUtils/store"

const OtheAddMOptions = () => {
    const {colorConfig}=useSelector((state:RootState)=>state.userInfo)
    return (
        <View style={[styles.main,{}]}>

            <View style={styles.container}>
                <TouchableOpacity style={styles.btn} onPress={undefined}>
                    <Text style={styles.btnText}>
                        IMPS
                    </Text>
                </TouchableOpacity>
                <BorderLine style={{ backgroundColor: '#FFF' }} height={'100%'} width={wScale(.5)} />
                <TouchableOpacity style={styles.btn} onPress={undefined}>
                    <Text style={styles.btnText}>
                        NEFT
                    </Text>
                </TouchableOpacity>
                <BorderLine style={{ backgroundColor: '#FFF' }} height={'100%'} width={wScale(.5)} />
                <TouchableOpacity style={styles.btn} onPress={undefined}>
                    <Text style={styles.btnText}>
                        RTGS
                    </Text>
                </TouchableOpacity>
                <BorderLine style={{ backgroundColor: '#FFF' }} height={'100%'} width={wScale(.5)} />
                <TouchableOpacity style={[styles.btn, { flex: 2 }]} onPress={undefined}>
                    <Text style={styles.btnText}>
                        Cash Deposit
                    </Text>
                </TouchableOpacity>

            </View>

        </View>
    )
}
const styles = StyleSheet.create({
    main: {
        width: '100%',
        backgroundColor: "rgba(255,255,255,0.4)",
        paddingVertical: hScale(10),
        marginTop: hScale(10),
        borderRadius: 5,
          },
    container: {
        paddingHorizontal: wScale(1),
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%'
    },
    btn: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: hScale(4)
    },
    btnText: {
        fontSize: wScale(18),
        color: '#fff',
        fontWeight: '400'
    }
})

export default OtheAddMOptions;