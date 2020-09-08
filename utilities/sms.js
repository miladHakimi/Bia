import {NativeModules} from 'react-native';
import { PermissionsAndroid } from 'react-native';

var DirectSms = NativeModules.DirectSms;
export const getSendSMSPermission = async () => 
    await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
            title: 'Bia App Send SMS Permission',
            message:
            'بیا برای ارسال پیام هنگام رسیدن به مقصد نیاز به اجازه برای دسترسی به SMS داره',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
        },
    );
export default async function sendDirectSms(_SMSText, _number) {

	const defalultMessage = 'بیا';
	const defaultNumber = '09384228682';
    
    const SMSText = _SMSText? _SMSText: defalultMessage;
    const phone = _number? _number: defaultNumber;
    try {
        const granted = await getSendSMSPermission();
        if (granted === PermissionsAndroid.RESULTS.GRANTED)
            DirectSms.sendDirectSms(phone, SMSText);
        else
            console.log('SMS permission denied');
        
    } catch (err) {
        console.warn(err);
    }
}