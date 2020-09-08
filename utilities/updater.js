import {PermissionsAndroid} from "react-native";
import { Alert } from 'react-native';  
var RNFS = require('react-native-fs');
var pkg = require('../app.json');
import RNFetchBlob from 'rn-fetch-blob'

const projectLink = "https://raw.githubusercontent.com/miladHakimi/Bia/master/app.json"
const downloadLink = "https://raw.githubusercontent.com/miladHakimi/Bia/master/android/app/build/outputs/apk/release/app-armeabi-v7a-release.apk"
// const installPath = RNFS.DownloadDirectoryPath + '/bia' + pkg.expo.android.versionCode.toString() + '.apk';

const downloader = () => {
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);
    RNFetchBlob.config({
        path : 'Downloads/bia.apk',
        addAndroidDownloads : {
          useDownloadManager : true,
          title : 'bia.apk',
          description : 'دریافت نسخه‌ی جدید',
          mime : 'application/vnd.android.package-archive',
          mediaScannable : true,
          notification : true,
        }
      })
      .fetch('GET', downloadLink)
      .then(Alert.alert('اتمام دانلود', 'لطفا نسخه‌ی کنونی نرم افزار را پاک کنید و نسخه‌ی دانلود شده را نصب نمایید.', { cancelable: true }))
}
export default class Updater {
    static showAlert = () => {
        Alert.alert(  
            'به روز رسانی',  
            'نسخه‌ی جدید این برنامه‌ موجود است. آیا تمایل به دانلود آن دارید؟',  
            [  
                {  
                    text: 'خیر',  
                    onPress: () => {},  
                    style: 'cancel',  
                },  
				{text: 'بله', onPress: downloader },  
            ],
            { cancelable: true }
        );      
    }
    static checkUpdate = () => {
        const currentVersion = pkg.expo.android.versionCode;

        fetch(projectLink)
        .then( res => res.json())
        .then( (res) => {
            if (res.expo === undefined || !res.expo || res.expo === {})
                return
            if (res.expo.android.versionCode > currentVersion)
                this.showAlert()
        })
    }

}