cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
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
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "android.support.v4": "1.0.0",
    "com.google.playservices": "17.0.0",
    "com.googlemaps.ios": "1.8.1",
    "plugin.google.maps": "1.1.2",
    "uk.co.ilee.nativetransitions": "0.1.3"
}
// BOTTOM OF METADATA
});