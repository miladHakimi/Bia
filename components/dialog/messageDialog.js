import React, { useState } from 'react';
import Dialog from "react-native-dialog";
import { StyleSheet, Keyboard, View, Text } from 'react-native';
import {connect} from 'react-redux'


function MessageDialog(props){
    const [preSubmittedSMSText, setPreSubmittedSMSText] = useState(props.SMSText);
    
    function submitHandler(){
        props.setSMSText(preSubmittedSMSText);
        props.setDialogVisibility(false);
    }

    return(
        <Dialog.Container visible={props.dialogVisibility} onBackdropPress={() => {
            props.setDialogVisibility(false);
            Keyboard.dismiss();
        }}>
            <Dialog.Input
                label='متن پیام' 
                style={styles.smsTextContainer} 
                placeholder={'بیا'} 
                value={preSubmittedSMSText} 
                onChangeText={setPreSubmittedSMSText}
            />
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
        
	}
}
function mapDisptchToProps(dispatch){

    return {
        setSMSText: (SMSText) => dispatch({
            type: 'SET_SMS',
            SMSText: SMSText
        }),
       
    }
}

export default connect(mapStateToProps, mapDisptchToProps)(MessageDialog)
