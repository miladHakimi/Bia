import React, { useState } from 'react';
import Dialog from "react-native-dialog";
import { StyleSheet, Keyboard, View, Text } from 'react-native';
import {connect} from 'react-redux'
import Contacts from 'react-native-unified-contacts';
import { PermissionsAndroid } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

function ContactDialog(props){
	const [preSubmittedPhone, setPreSubmittedPhone] = useState(props.phone);
    
    function submitHandler(){
        props.setPhone(preSubmittedPhone);
        props.setDialogVisibility(false);
    }

    function readContacts(){
        PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
            {
              'title': 'Contacts',
              'message': 'This app would like to view your contacts.',
              'buttonPositive': 'Please accept bare mortal'
            }
        ).then(() => {
            Contacts.selectContact( (error, contact) =>  {
                if (error) {
                  console.error(error);
                }
                else {
                    setPreSubmittedPhone(contact.phoneNumbers[0].stringValue);
                }
            });
        })
    }
    return(
        <Dialog.Container visible={props.dialogVisibility} onBackdropPress={() => {
            props.setDialogVisibility(false);
            Keyboard.dismiss();
        }}>
            <Dialog.Input
                label={'شماره'} 
                style={styles.smsTextContainer} 
                placeholder={'09...'} 
                keyboardType={'numeric'} 
                value={preSubmittedPhone} 
                onChangeText={setPreSubmittedPhone}
            />
            <View style={{flexDirection: 'row-reverse', alignItems: 'center'}}>
                <AntDesign name={'contacts'} size={20}/>
                <Dialog.Button label='انتخاب از مخاطبین' onPress={readContacts}/>
            </View>
           
            <Dialog.Button label="تایید" onPress={submitHandler} />
        </Dialog.Container>

    )
}

const styles = StyleSheet.create({
    smsTextContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        paddingHorizontal: 15,
        marginTop: 10
	}
});

function mapStateToProps(state) {
	return {
        SMSText: state.SMSText,
        phone: state.phone,
        distance: state.distance
	}
}
function mapDisptchToProps(dispatch){
    return {
        setPhone: (phone) => dispatch({
            type: 'SET_PHONE',
            phone: phone
        }),
    }
}

export default connect(mapStateToProps, mapDisptchToProps)(ContactDialog)
