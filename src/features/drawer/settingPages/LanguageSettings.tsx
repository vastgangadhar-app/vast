import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import AppBarSecond from '../headerAppbar/AppBarSecond';
import LenguageSvg from '../svgimgcomponents/Lenguageimg';
import { hScale, wScale } from '../../../utils/styles/dimensions';
import { useSelector } from 'react-redux';
import { RootState } from '../../../reduxUtils/store';
import DynamicButton from '../button/DynamicButton';
import { Dialog,ALERT_TYPE } from 'react-native-alert-notification';
import Test2 from '../test2';
import { useDispatch } from 'react-redux';
import { setAppLanguage } from '../../../reduxUtils/store/userInfoSlice';
import { setLocale } from '../../../utils/languageUtils/I18n';
const LanguageSettings = () => {
    const { colorConfig } = useSelector((state: RootState) => state.userInfo);
    const { appLanguage } = useSelector(
        (state: RootState) => state.userInfo,
      );
    const [selectedLanguageIndex, setSelectedLanguageIndex] = useState(0 ); // Initialize with English index
    const dispatch = useDispatch();
    const languages = [{title: 'English (India)', code: 'en'}, 
    {title:'Hindi  (हिंदी) ', code: 'hi'},
    {title: 'Bengali  (বাংলা)', code: 'bn'},  
    {title: 'Gujarati  (ગુજરાતી)', code:'gj'}, 
    {title: 'Kannada  (ಕನ್ನಡ)', code: 'kn'},
    {title: 'Marathi  (मराठी)', code: 'mh'}, 
    {title: 'Tamil  (தமிழ்)', code: 'tn'},
    {title: 'Telugu  (తెలుగు)', code: 'tl'}];

    useEffect(() => {
        if(appLanguage){
            setSelectedLanguageIndex(languages.findIndex((language) => language.code === appLanguage));
        }
    },[])

    const changeLanguage = (index) => {
        setSelectedLanguageIndex(index);
    };
    const BtnPress = () => {
        dispatch(setAppLanguage(languages[selectedLanguageIndex].code));
        setLocale(languages[selectedLanguageIndex].code)
        Dialog.show({
            type: ALERT_TYPE.SUCCESS,
            title: 'SUCCESS',
            textBody: 'Your Language Is Changes Successfully',
            button: 'OK',
            onPressButton: () => {
                Dialog.hide();
    
            },
        });
    };

    return (
        <View style={styles.main}>
            <AppBarSecond
                title="Application {App} Language"
                actionButton={undefined}
                onActionPress={undefined}
            />
           
                <View style={styles.container}>

                    <View style={styles.imgs1}>
                        <LenguageSvg />

                    </View>
                    <View style={[styles.selectedLanguageContainer]}>
                        <Text style={styles.heading2}> Your Selected Language is </Text>

                        <Text style={[styles.heading2, { color: colorConfig.secondaryColor }]}>{languages[selectedLanguageIndex].title}</Text>
                    </View>
                    <ScrollView>
                    <View style={styles.languageContainer}>

                        {/* <Text style={[styles.heading, { backgroundColor: colorConfig.primaryColor }]}> choose your conveninet language</Text> */}

                        <View style={styles.languageList}>
                            {languages.map((language, index) => (
                                <TouchableOpacity key={index} onPress={() => changeLanguage(index)} style={[styles.languageButton,]}>

                                    <View style={[styles.languageEmojiContainer, index === selectedLanguageIndex && { backgroundColor: colorConfig.secondaryColor }]}>
                                        {index === selectedLanguageIndex && (
                                            <Text style={styles.languageEmoji}>✓</Text>
                                        )}

                                    </View>
                                    <Text style={[styles.languageText, language.title === 'Telugu  (తెలుగు)' && styles.hideborder]}>{language.title}</Text>

                                </TouchableOpacity>
                            ))}

                            <DynamicButton title='Save Change' onPress={BtnPress}/>
                        </View>
                    </View>
                    </ScrollView>

                </View>

         
        </View>
    );
};

const styles = StyleSheet.create({
    main: { flex: 1 },
    container: {
        paddingHorizontal: wScale(10),
        flex: 1,
        marginBottom: hScale(10),

    },
    languageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        // marginTop: hScale(10),
        // backgroundColor: '#fff',
        paddingBottom: hScale(10)
        ,
    },
    heading: {
        fontSize: wScale(22),
        fontWeight: 'bold',
        color: '#fff',
        width: '100%',
        paddingVertical: hScale(8),
        textAlign: 'center',
        textTransform: 'capitalize'
    },
    selectedLanguageContainer: {
        marginBottom: hScale(5),
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor:'#fff',
        paddingVertical:hScale(10),
        marginTop:hScale(10),
        borderRadius:20
    },
    heading2: {
        fontSize: wScale(20),
        fontWeight: 'bold',
        color: '#000',
    },
    languageText: {
        textTransform: 'capitalize',
        fontSize: wScale(22),
        color: '#000',
        paddingTop: hScale(18),
        flex: 1,
        paddingBottom: hScale(22),
        borderBottomColor: "rgba(0,0,0,.4)",
        borderBottomWidth: wScale(.4),
    },
    hideborder: {
        borderBottomWidth: wScale(0),
    },

    languageList: {
        width: '100%',
        paddingHorizontal: wScale(10),
        paddingTop: hScale(10)


    },
    languageButton: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#fff',

    },

    languageEmojiContainer: {
        marginRight: wScale(20),
        borderWidth: wScale(.5),
        borderRadius: 25,
        height: wScale(35),
        width: wScale(35),
        alignItems: 'center',
        justifyContent: 'center',

    },

    languageEmoji: {
        fontSize: wScale(19),
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        alignSelf: 'center',
        fontWeight: 'bold',
        color:'#fff'
    },

    imgs1: {
        marginTop: hScale(20),
        alignSelf: 'center'
    }
});

export default LanguageSettings;
