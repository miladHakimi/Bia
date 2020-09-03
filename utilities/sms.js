import {NativeModules} from 'react-native';
import { PermissionsAndroid } from 'react-native';

var DirectSms = NativeModules.DirectSms;

export default async function sendDirectSms(_SMSText, _number) {

	const defalultMessage = 'بیا';
	const defaultNumber = '09384228682';
    
    const SMSText = _SMSText? _SMSText: defalultMessage;
    const phone = _number? _number: defaultNumber;
    try {
        const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
            {
                title: 'Bia App Sms Permission',
                message:
                'YourProject App needs access to your inbox ' +
                'so you can send messages in background.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            DirectSms.sendDirectSms(phone, SMSText);
        } else {
            console.log('SMS permission denied');
        }
    } catch (err) {
        console.warn(err);
    }
}