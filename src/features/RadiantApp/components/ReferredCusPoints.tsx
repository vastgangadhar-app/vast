import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, ToastAndroid, StyleSheet, Text } from "react-native";
import { commonStyles } from "../../../utils/styles/commonStyles";
import AppBarSecond from "../../drawer/headerAppbar/AppBarSecond";
import FlotingInput from "../../drawer/securityPages/FlotingInput";
import useAxiosHook from "../../../utils/network/AxiosClient";
import { APP_URLS } from "../../../utils/network/urls";
import BankListModal from "../../../components/BankListModal";
import OnelineDropdownSvg from "../../drawer/svgimgcomponents/simpledropdown";
import DynamicButton from "../../drawer/button/DynamicButton";
import { useLocationHook } from "../../../hooks/useLocationHook";
import { useSelector } from "react-redux";
import { RootState } from "../../../reduxUtils/store";
import { hScale, wScale } from "../../../utils/styles/dimensions";
import CheckSvg from "../../drawer/svgimgcomponents/CheckSvg";
import LoiListReport from "../CmsReport/LoiListReport";
import MovingDotBorderText from "../../../components/AnimatedBorderView";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CloseCameraSvg from "../../drawer/svgimgcomponents/CloseCameraSvg";

const ReferredCusPoints = () => {
  const { post } = useAxiosHook();
  const { Loc_Data, colorConfig} = useSelector((state: RootState) => state.userInfo);

  const [listData, setListData] = useState([]);
  const [dropdownType, setDropdownType] = useState("STATE");
    const [tableShow, setShwowTable] = useState(false)

  const [selectedState, setSelectedState] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
    const [check, setCheck] = useState(false); // This controls whether latitude and longitude fields are visible
 const [reportData, setReportData] = useState([]);

    // Fetch the report data when the component mounts
    useEffect(() => {
        const fetchReportData = async () => {
            try {
                const res = await post({ url: APP_URLS.LoiListReport });
                if (res) {
                    setReportData(res);
                } else {
                    console.error('No report data available');
                }
            } catch (error) {
                console.error('Error fetching report data:', error);
            }
        };

        fetchReportData();
    }, []); // Only fetch data once when the component mounts

  console.log(Loc_Data, '909090');

  const [form, setForm] = useState({
    state: "",
    district: "",
    city: "",
    client: "",
    pinCode: "",
    dcCode: "",
    pickupOption: "",
    depositMode: "",
    pointAddress: "",
    cashLimit: "",
    contactName: "",
    contactNumber: "",
    additionalRequirement: "",
    subDescription: "",
  });

  const onChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const fetchData = async (type, stateId) => {
    try {
      let url = "";
      if (type === "STATE") {
        url = `${APP_URLS.Stateinfo}`;
      } else if (type === "DISTRICT") {
        url = `${APP_URLS.Districtinfo}?Stateid=${stateId}`;
      } else if (type === "CLIENT") {
        url = `${APP_URLS.Clientinfo}`;
      } else if (type === "PICKUP") {
        url = `${APP_URLS.Pickupoption}`;
      } else if (type === "DEPOSIT") {
        url = `${APP_URLS.DepositMode}`;
      }

      const response = await post({ url });

      if (type === "PICKUP" || type === "DEPOSIT") {
        // Wrap plain strings into objects
        const options = (response?.Content?.ADDINFO || []).map((opt, idx) => ({
          id: idx,
          name: opt,
        }));
        setListData(options);
      } else {
        setListData(response?.Content?.ADDINFO || []);
      }
    } catch (e) {
      console.error("API error", e);
    }
  };

const handleSubmit = async () => {
  try {
     if (!selectedState) {
      ToastAndroid.show("Please select a State.", ToastAndroid.LONG);
      return;
    }

    if (!selectedDistrict) {
      ToastAndroid.show("Please select a District.", ToastAndroid.LONG);
      return;
    }
if (!form.city) {
      ToastAndroid.show("Please Enter City Name.", ToastAndroid.LONG);
      return;
    }
  

    if (form.pinCode && form.pinCode.length !== 6) {
      ToastAndroid.show("Pin Code must be 6 digits.", ToastAndroid.LONG);
      return;
    }
  if (!selectedClient) {
      ToastAndroid.show("Please select a Client.", ToastAndroid.LONG);
      return;
    }
    if (!form.contactName) {
      ToastAndroid.show("Contact Name is required.", ToastAndroid.LONG);
      return;
    }
    if (!form.contactNumber) {
      ToastAndroid.show("Contact Number is required.", ToastAndroid.LONG);
      return;
    }

    if (!form.pointAddress) {
      ToastAndroid.show("Point Address is required.", ToastAndroid.LONG);
      return;
    }
    if (form.dcCode && !/^[a-zA-Z0-9]*$/.test(form.dcCode)) {
      ToastAndroid.show("DC Code must be alphanumeric.", ToastAndroid.LONG);
      return;
    }

    if (form.cashLimit && isNaN(form.cashLimit)) {
      ToastAndroid.show("Cash Limit must be a number.", ToastAndroid.LONG);
      return;
    }

    if (Loc_Data?.latitude == null || Loc_Data?.longitude == null) {
      ToastAndroid.show("Unable to fetch location. Please enable location services.", ToastAndroid.LONG);
      return;
    }

    if (!form.pickupOption) {
      ToastAndroid.show("Please select a Pickup Option.", ToastAndroid.LONG);
      return;
    }

    if (!form.depositMode) {
      ToastAndroid.show("Please select a Deposit Mode.", ToastAndroid.LONG);
      return;
    }

    const payload = {
      CustomerName: form.contactName,
      PickupAddress: form.pointAddress,
      Pincode: Number(form.pinCode) || 0,
      WorkMode: form.pickupOption || null,
      CashLimit: Number(form.cashLimit) || 0,
      DepositionMode: form.depositMode || null,
      AdditionalRequirement: form.additionalRequirement || "",
      StateId: selectedState.State_id,
      DistrictId: selectedDistrict.Dist_id,
      CityName: form.city || "",
      ClientName: selectedClient?.ClientName || null,
      PointMobile: form.contactNumber,
      PointName: form.contactName,
      DCCode: form.dcCode || "",
      SubDescription: form.subDescription || "",
      Status: "Pending",
      Latitude: Loc_Data?.latitude ?? null,
      Longitude: Loc_Data?.longitude ?? null,
    };

    console.log("Submitting Payload:", payload);

    // Send the POST request
    const response = await post({
      url: APP_URLS.InsertLOIList,
      data: payload,
    });

    console.log("Submit Response:", response);

    if (response?.sts ===true) {
      ToastAndroid.show("Data submitted successfully.", ToastAndroid.LONG);
      setShwowTable(true);
    } else {
      ToastAndroid.show(response?.Message || "Submission failed.", ToastAndroid.LONG);
    }
  } catch (error) {
    console.error("Submit error:", error);
    ToastAndroid.show("Something went wrong. Please try again.", ToastAndroid.LONG);
  }
};


  return (
    <View style={commonStyles.screenContainer}>
      <AppBarSecond title="Referred Customer Points" />

      <ScrollView
        keyboardShouldPersistTaps="handled"
      >
        <View style={commonStyles.contentContainer}>
<MovingDotBorderText height={hScale(40)}>
                                                <TouchableOpacity style={[styles.animetedBtn, { backgroundColor: `${colorConfig.secondaryColor}1D`, }]}
                                      onPress={() => { setShwowTable(!tableShow) }}>
                                      {!tableShow ? <Ionicons name="add-circle-outline" color="#000" size={24} /> :
                                          // <FontAwesome name="eye-slash" color="#000" size={24} />
                                          <CloseCameraSvg size={24}/>                                     }
          
                                      <Text style={styles.viewText}>
                                        {!tableShow ?'Add Referred Customer Points':'Close Referred Customer Points'}
                                      </Text>
          
                                  </TouchableOpacity>
                              </MovingDotBorderText>
         {!tableShow&&reportData.length > 0 ?
         <View>
             

         <LoiListReport/>
         </View>:
         
<>     
   <TouchableOpacity
          onPress={() => {
            setDropdownType("STATE");
            fetchData("STATE");
            setIsOpen(true);
          }}
        >
          <View style={commonStyles.righticon2}>
            <OnelineDropdownSvg />
          </View>
          <FlotingInput
            label="Select State"
            value={selectedState?.State_name || ""}
            editable={false}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            if (!selectedState) return;
            setDropdownType("DISTRICT");
            fetchData("DISTRICT", selectedState.State_id);
            setIsOpen(true);
          }}
        >
          <FlotingInput
            label="Select District"
            value={selectedDistrict?.Dist_Desc || ""}
            editable={false}
          />
          <View style={commonStyles.righticon2}>
            <OnelineDropdownSvg />
          </View>
        </TouchableOpacity>

        {/* CITY */}
        <FlotingInput
          label="City Name"
          value={form.city}
          onChangeTextCallback={t => onChange("city", t)}  />
        <TouchableOpacity
          onPress={() => {
            setDropdownType("CLIENT");
            fetchData("CLIENT");
            setIsOpen(true);
          }}
        >
          <FlotingInput
            label="Client"
            value={selectedClient?.ClientName || ""}
            editable={false}
          />
          <View style={commonStyles.righticon2}>
            <OnelineDropdownSvg />
          </View>
        </TouchableOpacity>

        <FlotingInput label="Pin Code"
         keyboardType="numeric" value={form.pinCode} onChangeTextCallback={t => onChange("pinCode", t)}maxLength={6}/>
        <FlotingInput label="DC Code" value={form.dcCode} onChangeTextCallback={t => onChange("dcCode", t)} />

        <FlotingInput label="Additional Requirement (Optional)" 
        multiline value={form.additionalRequirement} onChangeTextCallback={t => onChange("additionalRequirement", t)} />

        <TouchableOpacity
          onPress={() => {
            setDropdownType("PICKUP");
            fetchData("PICKUP");
            setIsOpen(true);
          }}
        >

          <FlotingInput
            label="Select Pickup Option"
            value={form.pickupOption || ""}
            editable={false}
          />
          <View style={commonStyles.righticon2}>
            <OnelineDropdownSvg />
          </View>
        </TouchableOpacity>

        {/* DEPOSIT MODE */}
        <TouchableOpacity
          onPress={() => {
            setDropdownType("DEPOSIT");
            fetchData("DEPOSIT");
            setIsOpen(true);
          }}
        >
          <FlotingInput
            label="Deposit Mode"
            value={form.depositMode || ""}
            editable={false}
          />
          <View style={commonStyles.righticon2}>
            <OnelineDropdownSvg />
          </View>
        </TouchableOpacity>
        <FlotingInput label="Point Address" multiline value={form.pointAddress} onChangeTextCallback={t => onChange("pointAddress", t)} />
        <FlotingInput label="Cash Limit" keyboardType="numeric" value={form.cashLimit} onChangeTextCallback={t => onChange("cashLimit", t)} />
        <FlotingInput label="Point Contact Name" value={form.contactName} onChangeTextCallback={t => onChange("contactName", t)} />
        <FlotingInput label="Point Mobile Number" 
        maxLength={10}
        keyboardType="numeric" value={form.contactNumber} onChangeTextCallback={t => onChange("contactNumber", t)} />
        <FlotingInput label="Sub Description (Optional)" 
        
        multiline value={form.subDescription} onChangeTextCallback={t => onChange("subDescription", t)} />
<TouchableOpacity style={styles.checkRow}onPress={()=>setCheck(!check)}>

<View style={styles.check}>
{check&&<CheckSvg size={10}color="#4FEE7F"/>
}</View>

<Text style={styles.checkText}>
Are you at the location of the store?
</Text>
</TouchableOpacity>
{check&&<>
        <FlotingInput
          label="Latitude"
          value={Loc_Data['longitude'] || "N/A"}
          editable={false}
        />
        <FlotingInput
          label="Longitude"
          value={Loc_Data['longitude'] || "N/A"}
          editable={false}
        />
        </>}
        <DynamicButton title="Submit" onPress={handleSubmit} />
        </>}
</View>
      </ScrollView>

      <BankListModal
        key={dropdownType}
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        data={listData}
        labelKey={
          dropdownType === "STATE"
            ? "State_name"
            : dropdownType === "DISTRICT"
              ? "Dist_Desc"
              : dropdownType === "CLIENT"
                ? "ClientName"   // ✅ FIXED
                : "name"         // pickup & deposit options
        }
        idKey={
          dropdownType === "STATE"
            ? "State_id"
            : dropdownType === "DISTRICT"
              ? "Dist_id"
              : dropdownType === "CLIENT"
                ? null           // ✅ no id for clients
                : "id"
        }
        title={
          dropdownType === "STATE"
            ? "Select State"
            : dropdownType === "DISTRICT"
              ? "Select District"
              : dropdownType === "CLIENT"
                ? "Select Client"
                : dropdownType === "PICKUP"
                  ? "Select Pickup Option"
                  : "Select Deposit Mode"
        }
        onSelect={(item) => {
          if (dropdownType === "STATE") {
            setSelectedState(item);
            setSelectedDistrict(null);
            onChange("state", item.State_name);
          } else if (dropdownType === "DISTRICT") {
            setSelectedDistrict(item);
            onChange("district", item.Dist_Desc);
          } else if (dropdownType === "CLIENT") {
            setSelectedClient(item);
            onChange("client", item.ClientName); // ✅ FIXED
          } else if (dropdownType === "PICKUP") {
            onChange("pickupOption", item.name);
          } else if (dropdownType === "DEPOSIT") {
            onChange("depositMode", item.name);
          }
          setIsOpen(false);
        }}
      />
    </View>
  );
};

export default ReferredCusPoints;
const styles =StyleSheet.create({
  checkRow:{
flexDirection:'row',
alignItems:'center',
marginBottom:hScale(10),
  },
  check:{
    height:hScale(15),
    width:hScale(15),
    borderWidth:.5,
    alignItems:'center',
    justifyContent:'center',
    marginRight:wScale(10)
  },
  checkText:{
    fontSize:wScale(14),
    flex:1,
    color:'#000',
  },
    animetedBtn: { flex: 1, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' },
    viewText: { fontSize: wScale(18), fontWeight: 'bold', color: '#000', width: '80%', textAlign: 'center' },
   
})