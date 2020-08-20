import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import MapView, { Marker } from "react-native-maps";
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import {connect} from 'react-redux'

async function updateLocation(){
	Location.startLocationUpdatesAsync('updateLocation', {
		accuracy: Location.Accuracy.Balanced 
	})
}
const CustomMarker = ({destination}) => {
	return(
		<Marker coordinate={destination} >
			<FontAwesome name='map-marker' size={40} style={styles.marker}/>
		</Marker>
	)

}
function Index (props) {
	const [region, setRegion] = useState({
		latitude: 35.6892,
		longitude: 51.3890,
		latitudeDelta: 0.008,
		longitudeDelta: 0.001
	});

	function destinationHandler() {
		props.setDestination(region);
		updateLocation();
	}
	function currentLocationHandler(){
		setRegion({
			...region,
			latitude: props.currentLocation.latitude,
			longitude: props.currentLocation.longitude

			})
	}
	function cancelHandler(){
		props.cancelDestination()
		Location.stopLocationUpdatesAsync('updateLocation')
	}
	useEffect(() => {
		async function fetchLocation() {
			let { status } = await Location.requestPermissionsAsync();
			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');
			}
	
			let location = await Location.getCurrentPositionAsync({enableHighAccuracy: true});
			props.setCurrentLocation({
				latitude: location.coords.latitude,
				longitude: location.coords.longitude,
				latitudeDelta: 0.01,
				longitudeDelta: 0.01
			});
		};
		fetchLocation();
    }, []);
    
    const destination = props.destination;

	const myMarker = destination ? <CustomMarker destination={destination}/>: null;
	const fakeMarker = destination ? null : 
		<View style={styles.markerContainer} pointerEvents="none">
			<FontAwesome name='map-marker' size={40} style={styles.fakeMarker}/>
		</View>;
	const bottomButton = destination? 
		<TouchableOpacity style={styles.submitButton} onPress={cancelHandler}>
			<Text style={{fontSize: 20}}> انصراف </Text>
		</TouchableOpacity>: 
		<TouchableOpacity style={styles.submitButton} onPress={destinationHandler}>
			<Text style={{fontSize: 20}}> تایید مقصد </Text>
		</TouchableOpacity>;

	return (
		<View style={{ flex: 1 }}>
			<MapView 
				showsUserLocation={true}
				style={styles.map}
				region={region}
				onRegionChangeComplete={region => setRegion(region)}
			>
				{myMarker}
			</MapView>

			{fakeMarker}

			<View style={styles.buttonContainer}>
				<TouchableOpacity style={styles.initLocationContainer} onPress={currentLocationHandler}>
					<MaterialIcons name='my-location' size={26}/>
				</TouchableOpacity>
				{bottomButton}
			</View>
		</View>
	);
}
function mapStateToProps(state) {
	return {
        currentLocation: state.currentLocation,
        destination: state.destination
	}
}
function mapDisptchToProps(dispatch){

    return {
        setDestination: ({latitude, longitude}) => dispatch({
            type: 'SET_DESTINATION',
            latitude: latitude,
            longitude: longitude
        }),
        setCurrentLocation: ({latitude, longitude}) => dispatch({
            type: 'SET_CURRENT_LOCATION',
            latitude: latitude,
            longitude: longitude
		}),
		cancelDestination: () => dispatch({
			type: 'CANCEL_DESTINATION',
		})
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
	markerContainer: {
		flex:1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center'
	},
	marker: {
		color: 'red',
	},
	fakeMarker: {
		color: 'red',
		marginTop: -30
	},
	buttonContainer: {
		position: 'absolute',
		width: '100%',
		bottom: 0,
		alignItems: 'flex-end'
	},
	initLocationContainer:{
		backgroundColor: '#2196F3',
		marginBottom: 30,
		marginRight: 15,
		borderRadius: 200,
		width: 60,
		height: 60,
		alignItems: 'center',
		justifyContent: 'center'
		  
	  },
	submitButton: {
		width: '100%',
		backgroundColor: '#2196F3',
		padding: 20,
		alignItems: 'center',
	}
});
export default connect(mapStateToProps, mapDisptchToProps)(Index)



