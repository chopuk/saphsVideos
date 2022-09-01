
  cordova.define('cordova/plugin_list', function(require, exports, module) {
    module.exports = [
      {
          "id": "cordova-plugin-screen-orientation.screenorientation",
          "file": "plugins/cordova-plugin-screen-orientation/www/screenorientation.js",
          "pluginId": "cordova-plugin-screen-orientation",
        "clobbers": [
          "cordova.plugins.screenorientation"
        ]
        },
      {
          "id": "es6-promise-plugin.Promise",
          "file": "plugins/es6-promise-plugin/www/promise.js",
          "pluginId": "es6-promise-plugin",
        "runs": true
        },
      {
          "id": "cordova-plugin-speechrecognition.SpeechRecognition",
          "file": "plugins/cordova-plugin-speechrecognition/www/speechRecognition.js",
          "pluginId": "cordova-plugin-speechrecognition",
        "merges": [
          "window.plugins.speechRecognition"
        ]
        }
    ];
    module.exports.metadata =
    // TOP OF METADATA
    {
      "cordova-plugin-screen-orientation": "3.0.2",
      "cordova-plugin-speechrecognition": "1.1.2",
      "es6-promise-plugin": "4.2.2"
    };
    // BOTTOM OF METADATA
    });
    