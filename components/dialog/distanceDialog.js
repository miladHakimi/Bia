import React, { useState } from 'react';
import Dialog from "react-native-dialog";
import { StyleSheet, Keyboard, View, Text } from 'react-native';
import {connect} from 'react-redux'

function DistanceDialog(props){
	const [preSubmittedDistance, setPreSubmittedDistance] = useState(props.distance);
    
    function submitHandler(){
        props.setDistance(preSubmittedDistance);
        props.setDialogVisibility(false);
    }

    return(
        <Dialog.Container visible={props.dialogVisibility} onBackdropPress={() => {
            props.setDialogVisibility(false);
            Keyboard.dismiss();
        }}>
            <Dialog.Input 
                style={styles.smsTextContainer} 
                label={'فاصله (متر)'} 
                placeholder={'300'} 
                keyboardType={'numeric'} 
                value={preSubmittedDistance.toString()} 
                onChangeText={setPreSubmittedDistance}
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
        distance: state.distance
	}
}
function mapDisptchToProps(dispatch){

    return {
		setDistance: (distance) => dispatch({
            type: 'SET_DISTANCE',
            distance: distance
		})
    }
}

export default connect(mapStateToProps, mapDisptchToProps)(DistanceDialog)
