import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView from "react-native-maps";
import {connect} from 'react-redux';
import {getElapsedTime, isInside} from '../../utilities/distance';
import CustomDialog from '../dialog/customDialog';
import {FakeMarker, CustomMarker, CurrentLocationMarker} from './markers';
import ButtonBox from './buttonBox';
import BackgroundTimer from 'react-native-background-timer';
import Loader from './loader';
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import Updater from '../../utilities/updater';
import sendDirectSms from '../../utilities/sms';

const SPEED = 12;
const MIN_FETCH_TIME = 25000;
const MAX_FETCH_TIME = 600000;

const config = {
	desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
	stationaryRadius: 100,
	distanceFilter: 150,
	notificationTitle: 'درحال استفاده از GPS',
	notificationText: '',
	debug: true,
	startOnBoot: false,
	stopOnTerminate: true,
	locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
	interval: MAX_FETCH_TIME/2,
	fastestInterval: MAX_FETCH_TIME,
	activitiesInterval: MAX_FETCH_TIME,
	stopOnStillActivity: false,
	distanceFilter: 100,
	startForeground: false,
	url: null
}

function Index (props) {
	const [smsLimit, setSMSLimit] = useState(0);
	const [isLoaded, setLoaded] = useState(false);
	function cancelHandler(){
		props.cancelDestination();
	}
	useEffect( () => {
		BackgroundGeolocation.getCurrentLocation((location) => {
			if (!location || location === {})
				return
			const { latitude, longitude } = location;
			props.setLocation({ latitude, longitude })
		})
		BackgroundGeolocation.stop();
		return () => {
			cancelHandler()
			BackgroundGeolocation.removeAllListeners();
			BackgroundGeolocation.stop(); //triggers start on start event
			console.log('stopped')
		}
	}, [])

	useEffect(() => {
		if (!props.destination || props.isBusy){
			return
		}
		if(props.timeoutID){
			props.setTimeoutID(null);
			return
		}
		BackgroundGeolocation.getCurrentLocation((location) => {
			if (!location || location === {})
				return
			const { latitude, longitude } = location;
			console.log({latitude, longitude})

			if(isInside({latitude, longitude}, props.destination, props.distance)){
				sendDirectSms(props.SMSText, props.phone);
				console.log('sent!')
				props.cancelDestination();
			}
			props.setLocation({ latitude, longitude });
		})
		props.setBusy(true);
		props.setTimeoutID(BackgroundTimer.setTimeout(()=> {
			const interval = getElapsedTime(props.currentLocation, props.destination, MIN_FETCH_TIME)
			console.log('elapsed time ', interval)
			props.setTimer(interval);
			props.setBusy(false);
			BackgroundGeolocation.configure({});
		}, props.timer))
		

	}, [props.timer, props.currentLocation, props.destination, props.isBusy, props.timeoutID])
	
	return (
		
		<View style={{ flex: 1 }}>
			{props==={} || !props.currentLocation || !props.region? 
				<Loader/>
				: 
				<View style={{ flex: 1 }}>
					<MapView 
						style={styles.map}
						region={props.region}
						onRegionChangeComplete={(region) => props.setRegion(region)}
					>	
						<CustomMarker destination={props.destination}/>
						<CurrentLocationMarker currentLocation={props.currentLocation}/>

					</MapView>

					<FakeMarker destination={props.destination}/>
					
					{/* <CustomDialog dialogVisibility={dialogVisibility} setDialogVisibility={setDialogVisibility}/> */}

					<ButtonBox 
						setSMSLimit={setSMSLimit}
						cancelHandler={cancelHandler}
					/>
			</View>
			}

		</View>
	);
}
function mapStateToProps(state) {
	return {
        currentLocation: state.currentLocation,
		destination: state.destination,
		SMSText: state.SMSText,
		phone: state.phone,
		distance: state.distance,
		distanceFilter: state.distanceFilter,
		region: state.region,
		timer: state.timer,
		timeoutID: state.timeoutID,
		isBusy: state.isBusy
	}
}
function mapDisptchToProps(dispatch){
    return {
        setCurrentLocation: ({latitude, longitude}) => dispatch({
            type: 'SET_CURRENT_LOCATION',
            latitude: latitude,
            longitude: longitude
		}),
		setDistanceFilter: (distanceFilter) => dispatch({
			type: 'SET_DISTANCE_FILTER',
			distanceFilter: distanceFilter
		}),
		setRegion: (region) => dispatch({
            type: 'SET_REGION',
            region: region
		}),
		setTimer: (timer) => dispatch({
            type: 'SET_TIMER',
            timer: timer
		}),
		setTimeoutID: (id) => dispatch({
            type: 'SET_TIMEOUT_ID',
            timeoutID: id
		}),
		setBusy: (state) => dispatch({
            type: 'SET_BUSY',
            isBusy: state
		}),
    }
}
const styles = StyleSheet.create({
	container: {    
		flex:1,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'flex-end',
		alignItems: 'center',
	},
	map: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
	},
});
export default connect(mapStateToProps, mapDisptchToProps)(Index)


