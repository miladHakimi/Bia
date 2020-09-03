import React from 'react';
import { View, StyleSheet} from 'react-native';
import {FontAwesome, MaterialIcons} from '@expo/vector-icons';
import { Marker } from "react-native-maps";

export function FakeMarker ({destination}){ 
    return destination ? null : 
    <View style={styles.markerContainer} pointerEvents="none">
        <FontAwesome name='map-marker' size={40} style={styles.fakeMarker}/>
    </View>;
}

export function CustomMarker ({destination}){ 
    return destination? 
	<Marker coordinate={destination} >
        <FontAwesome name='map-marker' size={40} style={styles.marker}/>
    </Marker>: null;
}

export function CurrentLocationMarker({currentLocation}){
	return currentLocation? 				
	<Marker coordinate={currentLocation} >
		<MaterialIcons name='person-pin-circle' size={45} style={{color: '#001f3f'}}/>
	</Marker>: null;
}
const styles = StyleSheet.create({
	markerContainer: {
		flex:1,
		flexDirection:'row',
		alignItems:'center',
		justifyContent:'center'
	},
	
	fakeMarker: {
		color: 'red',
		marginTop: -30
	},
	marker: {
		color: 'red',
	},
});