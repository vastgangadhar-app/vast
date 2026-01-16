import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { APP_URLS } from "../../../utils/network/urls";
import useAxiosHook from "../../../utils/network/AxiosClient";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import DateRangePicker from "../../../components/DateRange";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome6 from "react-native-vector-icons/FontAwesome6";
import Entypo from "react-native-vector-icons/Entypo";
import NoDatafound from "../../drawer/svgimgcomponents/Nodatafound";
import ShowLoader from "../../../components/ShowLoder";
import BorderLine from "../../../components/BorderLine";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import { RootState } from "../../../reduxUtils/store";
import { useSelector } from "react-redux";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PaddingSvg2 from "../../drawer/svgimgcomponents/PaddingSvg2";
import FailedSvg from "../../drawer/svgimgcomponents/Failedimg";
import { useNavigation } from "../../../utils/navigation/NavigationService";

const RadiantPrepayReport = () => {
    const { colorConfig, } = useSelector((state: RootState) => state.userInfo);

    const today = new Date().toISOString().split("T")[0];
    const [loading, setLoading] = useState(true);

    const [selectedDate, setSelectedDate] = useState({
        from: today,
        to: today,
    });

    const [status, setStatus] = useState("");
    const [data, setData] = useState([]);
    const { post } = useAxiosHook();
    const normalizeDate = (date) => {
        return new Date(date).toISOString().split("T")[0];
    };


    const fetchData = async (from, to, status) => {
        setLoading(true)
        try {
            const url = `${APP_URLS.RadiantPrepayReport}?from=${from}&to=${to}&Status=${status}`;

            const response = await post({ url });
            console.log("API CALL:", url, from, to, 'res====', response);

            const list = Array.isArray(response)
                ? response
                : response?.data || [];

            setData(list.length > 0 ? list : list);
        } catch (error) {
            console.log("API Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const cleanFrom = normalizeDate(selectedDate.from);
        const cleanTo = normalizeDate(selectedDate.to);

        fetchData(cleanFrom, cleanTo, status);
    }, [selectedDate, status]);

    const navigation = useNavigation();
    const PDFRepordata = async (requestId,action="view") => {
        try {
            const url = `${APP_URLS.RadiantPDFReport}${requestId}`;
            console.log("PDF URL:", url, 'rrr', requestId);
            const response = await post({ url })
            console.log(response, 'rrresssppoonnss');
            if (response?.StatusCode === 200 && response?.Content?.length) {
                navigation.navigate("PrepaySlipSummary", {
                    slipData: response.Content[0],
                    action
                });
            } else {
                alert("No data found");
            }

        } catch (error) {
            console.log("PDF Error:", error);
        }
    };

    const renderItem = ({ item }) => {


        const STATUS_CONFIG = {
            pending: { color: "#fa9507", bg: "#FCF9F5" },
            failed: { color: "red", bg: "#F9E4E2" },
            success: { color: "#4b853e", bg: "#e8f5e1" },
            refund: { color: "blue", bg: "#E5E5F8" },
        };

        const rawStatus = item.sts?.toLowerCase();

        const resolvedStatus = rawStatus?.startsWith("r")
            ? "refund"
            : rawStatus;

        const { color, bg } =
            STATUS_CONFIG[resolvedStatus] ?? { color: "#555", bg: "#eee" };

        return (
            <View
                style={[
                    styles.card, {
                        backgroundColor: bg,
                        borderColor: color,
                    },
                ]}
            >
                <View
                    style={[
                        styles.row,
                        { backgroundColor: color },
                        styles.headerRow
                    ]} >


                    <View style={styles.item}>
                        <Text style={styles.timeLabel}>Trans / Request Insert Time</Text>
                        <Text style={[styles.timeVabel, { letterSpacing: 0 }]}>
                            {item.Insertdate}
                        </Text>
                    </View>
                    <View style={styles.item2}>
                        <Text style={styles.timeLabel}>
                            Cash Pickup / Collection Time
                        </Text>
                        <Text style={styles.timeVabel}>{item.Updatedate}</Text>
                    </View>
                </View>

                <View
                    style={[
                        styles.rMargin, { borderColor: color, },]} >

                    <View
                        style={[styles.row,]}
                    >
                        <View style={styles.item}>
                            <Text style={styles.label}>RCE ID</Text>
                            <Text style={styles.value}>{item.CEID}</Text>
                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.label}>Transaction Mode</Text>
                            <Text style={styles.value}>PrePay</Text>
                        </View>
                    </View>
                    <View style={[styles.whitePati,]}>



                        <View
                            style={[
                                styles.row,
                                { backgroundColor: `${colorConfig.secondaryColor}33`, borderRadius: 88, paddingHorizontal: wScale(10) }

                            ]}
                        >
                            <View style={styles.item}>
                                <Text style={styles.label}>Transaction Status</Text>

                                <Text style={styles.value}>{item.sts}</Text>
                            </View>

                            <View style={styles.item2}>
                                {resolvedStatus === "success" ? (
                                    <View
                                        style={[styles.check, { backgroundColor: "green" },]}>
                                        <CheckSvg size={15} />
                                    </View>
                                ) : resolvedStatus === "pending" ? (<PaddingSvg2 size={25} />)
                                    : resolvedStatus === "failed" ? (<FailedSvg size={25} />
                                    ) : resolvedStatus === "refund" ? (<MaterialCommunityIcons name="clock" color="#000" size={24} />
                                    ) : <MaterialCommunityIcons name="clock" color="#000" size={25} />

                                }
                            </View>
                        </View>

                    </View>


                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Requst ID</Text>
                        </View>
                        <View style={styles.item2}>
                            <Text style={styles.value}>{item.RequestID}</Text>
                        </View>
                    </View>

                    <BorderLine height={.5} width={'100%'} />

                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Transaction ID</Text>
                        </View>
                        <View style={styles.item2}>
                            <Text style={styles.value}>{item.transid || 'NULL'}</Text>

                        </View>
                    </View>
                    <BorderLine height={.5} width={'100%'} />

                    <View style={styles.row}>
                        <View style={styles.item}>

                            <Text style={styles.label}>Shop ID</Text>

                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.value}>{item.Shop_id || 'NULL'}</Text>
                        </View>
                    </View>

                    <BorderLine height={.5} width={'100%'} />
                    <View style={styles.row}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Client Name</Text>

                        </View>

                        <View style={styles.item2}>
                            <Text style={styles.value}>{item.Clientname || 'NULL'}</Text>
                        </View>
                    </View>

                    <View
                        style={[
                            styles.row,
                            styles.rowExtra
                        ]}>
                        <View style={styles.item}>
                            <Text style={styles.label}>Previous Balance</Text>
                            <Text style={styles.value}>{item.RemainPre}</Text>
                        </View>

                        <BorderLine height="100%" width={0.3} />

                        <View style={styles.item3}>
                            <Text style={styles.label}>Paid Amount</Text>
                            <Text style={styles.value}>
                                {item.Amount ?? 0}
                            </Text>
                        </View>

                        <BorderLine height="100%" width={0.3} />

                        <View style={styles.item2}>
                            <Text style={styles.label}>Remaining Balance</Text>
                            <Text style={styles.value}>{item.RemainPost}</Text>
                        </View>
                    </View>

                    {resolvedStatus === "success" && <>
                        <Text style={[styles.footerTitle,]}>
                            - Pickup/Collection Slip -
                        </Text>

                        <View style={styles.btnRow}>
                            <TouchableOpacity
                                style={styles.btnStyle}
                                onPress={() => PDFRepordata(item.RequestID)}
                            >
                                <Text style={styles.btnText}>View</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnStyle}
                                onPress={() => PDFRepordata(item.RequestID,"share")}
                            >
                                <Text style={styles.btnText}>Share</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.btnStyle}>
                                <Text
                                    style={[
                                        styles.btnText,
                                        { borderRightWidth: 0, marginRight: -15 },
                                    ]}
                                >
                                    Download
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </>}
                </View>
            </View>
        );
    };


    return (
        <View style={styles.main}>
            <AppBarSecond title={'Cash Pickup Report'} />

            <DateRangePicker
                isStShow={true}
                isshowRetailer={false}
                cmsStatu={false}
                setStatus={setStatus}

                onDateSelected={(from, to) => {
                    setSelectedDate({
                        from: normalizeDate(from),
                        to: normalizeDate(to),
                    });
                }}

                SearchPress={(from, to, status) => {
                    fetchData(normalizeDate(from), normalizeDate(to), status);
                }}

            />

            <View style={styles.container}>
                {loading ? (
                    <ShowLoader />
                ) : data.length === 0 ? (
                    <NoDatafound />
                ) : (
                    <FlashList
                        data={data}
                        renderItem={renderItem}
                        estimatedItemSize={120}
                    />
                )}
            </View>
        </View>
    );
};

export default RadiantPrepayReport;

const styles = StyleSheet.create({

    main: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: hScale(15)
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingVertical: hScale(2),
        alignItems: 'center',
        paddingHorizontal: wScale(4),
    },
    headerRow: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
    },

    rMargin: {
        paddingHorizontal: wScale(8),
        borderWidth: wScale(1),
        borderBottomRightRadius: wScale(10),
        borderBottomLeftRadius: wScale(10),
        paddingBottom: hScale(10)
    },
    card: {
        marginBottom: hScale(15),
        borderRadius: wScale(10),

        backgroundColor: '#f9f9f9',
        marginHorizontal: wScale(10),
    },
    item: {
        flex: 1,
        backgroundColor:'red'
    },
    item2: {
        flex: 1,
        alignItems: 'flex-end'
    },
    item3: {
        flex: 1,
        alignItems: 'center',
    },
    label: {
        fontSize: wScale(14),
        color: '#000',

    },
    timeLabel: {
        fontSize: wScale(10),
        color: '#fff',
        fontWeight: 'bold',
        letterSpacing: 1

    },
    value: {
        fontWeight: 'bold',
        fontSize: wScale(15),
        color: '#000',
        textTransform: 'capitalize'
    },
    timeVabel: {
        fontWeight: 'bold',
        fontSize: wScale(14),
        color: '#fff',
        textTransform: 'uppercase'
    },
    check: {
        height: wScale(25),
        width: wScale(25),
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
        alignSelf: 'center',
        marginTop: hScale(4)
    },
    btnText: {
        color: '#4b853e',
        fontSize: wScale(14),
        flex: 1,
        borderRightWidth: .5,
        borderColor: '#4b853e',
        textAlign: 'center'

    },
    btnStyle: {
        flex: 1
    },
    rowExtra: {
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        paddingVertical: hScale(5),
        backgroundColor: "#f1f1f1",
        borderRadius: 10,
        elevation: 2,
        marginTop: hScale(2),
    },
    footerTitle: {
        fontWeight: 'bold',
        fontSize: wScale(15),
        color: '#000',
        textTransform: 'capitalize',
        marginTop: hScale(10),
        textAlign: 'center'
    },
    whitePati: {
        backgroundColor: "#f1f1f1",
        borderRadius: 50,
        elevation: 2,
        marginTop: hScale(2),
    },
    stsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        paddingVertical: hScale(2),
        alignItems: 'center',
        paddingHorizontal: wScale(10),
        borderRadius: 80
    }
});
