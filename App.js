import React, { useState, useEffect } from 'react';
import * as TaskManager from 'expo-task-manager';
import {createStore} from 'redux';
import {Provider} from 'react-redux'
import Index from './components/index/index'
import {isInside} from './utilities/distance'
import * as Location from 'expo-location';

const initialState = {
	currentLocation: {},
	destination: null
}
const reducer = (state=initialState, action) => {
	switch (action.type) {
		case 'CANCEL_DESTINATION':
			return {
				...state,
				destination: null
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

const store = createStore(reducer)

export default function App () {
	return(
		<Provider store={store}>
			<Index />
		</Provider>
	);
}

TaskManager.defineTask('updateLocation', ({data, error}) => {
	if (error)
		console.log(error)
	if (data){
		if (data.locations && data.locations != {} && data.locations[0].coords != {}) {
			const { latitude, longitude } = data.locations[0].coords
			store.dispatch({
				type: 'SET_CURRENT_LOCATION',
				latitude: latitude,
				longitude: longitude
			})
			if(store.getState.destination != {} && latitude && longitude)
				if(isInside({latitude, longitude}, store.getState().destination)){
					Location.stopLocationUpdatesAsync('updateLocation')
					console.log('بیا');
					console.log(SendSMS);
					SendSMS.send(123, "+959254687254", "Hey.., this is me!\nGood to see you. Have a nice day.", (msg)=>{ alert(msg) });
				}
		}
	}
})


