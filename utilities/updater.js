import { version } from 'react';

var pkg = require('../app.json');
const projectLink = "https://raw.githubusercontent.com/miladHakimi/Bia/master/app.json"

export default class Updater{

    static checkUpdate = () => {
        const currentVersion = pkg.expo.android.versionCode;
        return fetch(projectLink)
        .then( file => file.json())
        .then( (res) => {
            return res.expo.android.versionCode > currentVersion
        })
    }


}