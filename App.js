import React from 'react';
import {createStore} from 'redux';
import {Provider} from 'react-redux'
import Index from './components/index/index'
import BackgroundGeolocation from '@mauron85/react-native-background-geolocation';
import {isInside} from './utilities/distance';
import BackgroundTimer from 'react-native-background-timer';
import {StyleSheet} from "react-native";
import Updater from './utilities/updater'

const CodePush = require("code-push");
const codePush = new CodePush("741f3860-913a-47d6-8dc0-6267c5af3220");


const initialState = {
	currentLocation: null,
	destination: null,
	SMSText: null,
	phone: null,
	distance: 300,
	distanceFilter: 200,
	region: {
		latitude: 35.6892,
		longitude: 51.3890,
		latitudeDelta: 0.008,
		longitudeDelta: 0.001
	},
	timer: 100,
	timeoutID: null,
	isBusy: false
}
const reducer = (state=initialState, action) => {
	switch (action.type) {
		case 'SET_REGION':
			return {
				...state,
				region: action.region
			}
		case 'SET_TIMER':
			return {
				...state,
				timer: action.timer
			}
		case 'SET_BUSY':
			return {
				...state,
				isBusy: action.isBusy
			}
		case 'SET_TIMEOUT_ID':
			return {
				...state,
				timeoutID: action.timeoutID
			}
		case 'SET_DISTANCE_FILTER':
			return {
				...state,
				distanceFilter: action.distanceFilter
			}
		case 'SET_SMS':
			return {
				...state,
				SMSText: action.SMSText
			}
		case 'SET_PHONE':
			return {
				...state,
				phone: action.phone
			}
		case 'SET_DISTANCE':
			return {
				...state,
				distance: action.distance
			}
		case 'CANCEL_DESTINATION':
			return {
				...state,
				destination: null,
				isBusy: false,
				timer: 2000,
				timerID: null,
			}
		case 'SET_DESTINATION':
			return {
				...state,
				destination: {
					latitude: action.latitude,
					longitude: action.longitude
				}
			}
		case 'SET_CURRENT_LOCATION':
			return {
				...state,
				currentLocation: {
					latitude: action.latitude,
					longitude: action.longitude
				}
			}
	}
	return state
}

export const store = createStore(reducer)

function cancelDestination(){
	storeState = store.getState();
	BackgroundTimer.clearTimeout(storeState.timeoutID);
	store.dispatch({ type: 'CANCEL_DESTINATION'});
	BackgroundGeolocation.stop();
}
function setLocation({ latitude, longitude }){
	if (!store.getState().currentLocation)
	store.dispatch({
		type: 'SET_REGION',
		region: {
			latitude: latitude,
			longitude: longitude,
			latitudeDelta: 0.008,
			longitudeDelta: 0.001
		}
	});
	store.dispatch({
		type: 'SET_CURRENT_LOCATION',
		latitude: latitude,
		longitude: longitude,
	});
}

export default function App () {
	return(
		<Provider store={store}>
			<Index setLocation={setLocation} cancelDestination={cancelDestination}/>
		</Provider>
	);
}
