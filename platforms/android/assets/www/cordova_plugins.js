cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.phonegap.plugins.facebookconnect/www/phonegap/plugin/facebookConnectPlugin/facebookConnectPlugin.js",
        "id": "com.phonegap.plugins.facebookconnect.FacebookConnectPlugin",
        "clobbers": [
            "window.facebookConnectPlugin"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
        "clobbers": [
            "plugin.notification.local"
        ]
    },
    {
        "file": "plugins/com.red_folder.phonegap.plugin.backgroundservice/www/backgroundservice.js",
        "id": "com.red_folder.phonegap.plugin.backgroundservice.BackgroundService",
        "clobbers": [
            "window.plugins.BackgroundServices"
        ]
    },
    {
        "file": "plugins/plugin.google.maps/www/googlemaps-cdv-plugin.js",
        "id": "plugin.google.maps.phonegap-googlemaps-plugin",
        "clobbers": [
            "window.plugins.phonegap-googlemaps-plugin"
        ]
    },
    {
        "file": "plugins/uk.co.ilee.nativetransitions/www/nativetransitions.js",
        "id": "uk.co.ilee.nativetransitions.NativeTransitions",
        "clobbers": [
            "nativetransitions"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.phonegap.plugins.facebookconnect": "0.5.1",
    "org.apache.cordova.geolocation": "0.3.9-dev",
    "de.appplant.cordova.plugin.local-notification": "0.7.4",
    "com.red_folder.phonegap.plugin.backgroundservice": "3.3",
    "plugin.google.maps": "1.1.2",
    "uk.co.ilee.nativetransitions": "0.1.3",
    "org.apache.cordova.device": "0.2.11-dev",
    "com.google.playservices": "17.0.0",
    "android.support.v4": "1.0.0"
}
// BOTTOM OF METADATA
});