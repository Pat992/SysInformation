const path = require('path');
const fs = require('fs');
const homedir = require('os');
const electron = require('electron');

class Store {
    constructor(configName) {
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        console.log('PATH: ' + userDataPath)
        this.path = path.join(userDataPath, configName + '.json');
        this.data = parseDataFile(this.path);
        if (!this.data) {
            fs.writeFileSync(this.path, JSON.stringify({
                settings: {
                    settings: {
                        opacity: 1,
                        alwaysOnTop: false,
                        screen: "0"
                    },
                    windows: 1
                }
            }))
        }
        console.log(this.data)
    }

    get(key) {
        return this.data[key];
    }

    set(key, val) {
        this.data[key] = val;
        fs.writeFileSync(this.path, JSON.stringify(this.data));
    }
}

function parseDataFile(filePath, defaults) {
    try {
        return JSON.parse(fs.readFileSync(filePath));
    } catch (err) {
        return defaults;
    }
}

module.exports = Store;