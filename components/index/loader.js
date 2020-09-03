import { View, StyleSheet, Image, Text } from "react-native"
import React from 'react';
import car from '../../assets/src/img/car.gif'

export default Loader = () => {
    return <View style={styles.container}>
        <Image source={car} style={styles.carGif}/>
        <View style={styles.textContainer}>
            <Text style={styles.loadingFont}> در حال بارگذاری...</Text>
        {/* <Spinner style={styles.spinner} isVisible={true} size={100} type={'Circle'} color='coral'/> */}
        </View>
    </View>
}

const styles = StyleSheet.create({
    container:{
        paddingTop: '25%',
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#e3ffff'
    },
	spinner:{

    },
    carGif:{
        width: '100%',
        height: 300
    },
    loadingFont:{
        fontSize: 30,
        fontWeight: 'bold',
        color: 'coral'
    },
    textContainer:{
        alignItems: 'center',
        width: '100%',
        height: '60%',
        backgroundColor: '#89d6E8'
    }
});