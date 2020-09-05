import React, {useState} from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons, MaterialCommunityIcons, AntDesign} from '@expo/vector-icons';
import {connect} from 'react-redux';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import ContactDialog from '../dialog/setContact'
import MessageDialog from '../dialog/messageDialog'
import DistanceDialog from '../dialog/distanceDialog';

const BottomButton = (props) => {
    return props.destination? 
    <TouchableOpacity style={styles.submitButton} onPress={props.cancelHandler}>
        <Text style={{fontSize: 17}}> انصراف </Text>
    </TouchableOpacity>: 
    <TouchableOpacity style={styles.submitButton} onPress={props.destinationHandler}>
        <Text style={{fontSize: 17}}> تایید مقصد </Text>
    </TouchableOpacity>;
}

const MessageButton = (props) => props.destination ? 
    <TouchableOpacity style={styles.smsButtons} onPress={() => props.setDialogVisibility(true)}>
        <MaterialCommunityIcons name='android-messages' size={26}/>
    </TouchableOpacity>: null;

const ContactButton = (props) => props.destination ? 
    <TouchableOpacity style={styles.smsButtons} onPress={() => props.setDialogVisibility(true)}>
		<AntDesign name={'contacts'} size={26}/>
	</TouchableOpacity>: null;
	

const DistanceButton = (props) => props.destination ? 
<TouchableOpacity style={styles.smsButtons} onPress={() => props.setDialogVisibility(true)}>
	<MaterialCommunityIcons name='map-marker-distance' size={26}/>
</TouchableOpacity>: null;

function ButtonBox(props) {
	const [contactDialogVisibility, setContactDialogVisibility] = useState(false)
	const [messagetDialogVisibility, setMessageDialogVisibility] = useState(false)
	const [distanceDialogVisibility, setDistanceDialogVisibility] = useState(false)

    function destinationHandler() {
		props.setSMSLimit(1);
		props.setDestination(props.region);
		BackgroundGeolocation.checkStatus(status => {
			if (!status.isRunning) 
				BackgroundGeolocation.start(); 
			
			else
				BackgroundGeolocation.stop();
		});
	}
	function currentLocationHandler(){
		props.setRegion({
			...props.region,
			latitude: props.currentLocation.latitude,
			longitude: props.currentLocation.longitude
		})
	}
    return (
        <View style={styles.buttonContainer}>
			<ContactDialog dialogVisibility={contactDialogVisibility} setDialogVisibility={setContactDialogVisibility}/>
			<MessageDialog dialogVisibility={messagetDialogVisibility} setDialogVisibility={setMessageDialogVisibility}/>
			<DistanceDialog dialogVisibility={distanceDialogVisibility} setDialogVisibility={setDistanceDialogVisibility}/>

			<MessageButton {...props} setDialogVisibility={setMessageDialogVisibility}/>

            <View style={styles.smallButtonContianer}>
				<ContactButton {...props} setDialogVisibility={setContactDialogVisibility}/>
				<BottomButton {...props} destinationHandler={destinationHandler}/>
				<DistanceButton {...props} setDialogVisibility={setDistanceDialogVisibility}/>
            </View>

			<TouchableOpacity style={styles.initLocationContainer} onPress={currentLocationHandler}>
				<MaterialIcons name='my-location' size={18} color='white'/>
			</TouchableOpacity>
        </View>
    )
}
function mapStateToProps(state) {
	return {
        currentLocation: state.currentLocation,
		destination: state.destination,
		SMSText: state.SMSText,
		phone: state.phone,
        distance: state.distance,
        region: state.region
	}
}

function mapDisptchToProps(dispatch){
    return {
        setDestination: ({latitude, longitude}) => dispatch({
            type: 'SET_DESTINATION',
            latitude: latitude,
            longitude: longitude
        }),
		cancelDestination: () => dispatch({
			type: 'CANCEL_DESTINATION',
        }),
        setRegion: (region) => dispatch({
            type: 'SET_REGION',
            region: region
		}),
		setPhone: (phone) => dispatch({
            type: 'SET_PHONE',
            region: phone
		}),
    }
}
export default connect(mapStateToProps, mapDisptchToProps)(ButtonBox)

const styles = StyleSheet.create({
	buttonContainer: {
		width: '100%',
		position: 'absolute',
		flexDirection: 'column',
		alignItems: 'center',
		bottom: 0,
	},
	initLocationContainer:{
		backgroundColor: 'navy',
		marginBottom: 10,
		borderRadius: 100,
		width: 35,
		height: 35,
		alignItems: 'center',
		justifyContent: 'center',
		marginLeft: 10
		  
	  },
	submitButton: {
		justifyContent: 'center',
		flexDirection: 'row',
		height: 95,
		width: 95,
		borderRadius: 100,
		alignItems: 'center',
		marginBottom: 20,

		shadowOpacity: 1,
		shadowOffset: { width: 0, height: 5},
		shadowRadius: 2,
		elevation: 20,
		backgroundColor: 'skyblue'
	},
	smallButtonContianer: {
		flex: 1,
        flexDirection: 'row-reverse',
		justifyContent: 'space-between',
		paddingRight: 30,
		paddingLeft: 20
	},
	spinner: {
		marginBottom: 50
	},
	smsButtons:{
		backgroundColor: 'skyblue',
		borderRadius: 100,
		margin: 25,
		width: 50,
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 12
	}

});