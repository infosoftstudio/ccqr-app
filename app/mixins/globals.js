import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback"
import { Color } from "@nativescript/core/color"
import { mapMutations } from 'vuex'
import * as fs from "@nativescript/core/file-system"
import * as appversion from "@nativescript/appversion";
const audio = require('nativescript-audio');
import {
    clear
} from "@nativescript/core/application-settings";

export default {
    methods: {
        ...mapMutations('login', ['RESET_LOGIN_STATE']),
        ...mapMutations('scanned', ['RESET_SCANNED_STATE']),
        ...mapMutations('user', ['SET_APP_VERSION']),
        snackBar (icon, title, message, color_ = "#e6494b") {
            this.feedback = new Feedback();

            this.feedback.show({
                title: title,
                titleColor: new Color("white"),
                position: FeedbackPosition.Top,
                type: FeedbackType.Custom, // this is the default type, by the way
                message: message,
                messageColor: new Color("white"),
                duration: 3000,
                backgroundColor: new Color(color_),
                icon: icon, // in App_Resources/platform folders
                android: {
                    iconColor: new Color("white") // optional, leave out if you don't need it
                },
                onTap: () => console.log("showCustomIcon tapped"),
                onShow: animating => console.log(animating ? "showCustomIcon animating" : "showCustomIcon shown"),
                onHide: () => console.log("showCustomIcon hidden")
            });
        },
        goTo (payload) {
            this.$navigator.navigate(payload)
        },
        goToModal (payload) {
            this.$navigator.modal(payload)
        },
        logout (payload) {
            confirm({
                title: "You are about to log out!",
                message: "Please click continue to logout",
                okButtonText: "CONTINUE",
                cancelButtonText: "CANCEL"
            })
            .then(result => {
                if (result) {
                    clear()
                    this.RESET_LOGIN_STATE()
                    this.RESET_SCANNED_STATE()
                    this.$navigator.navigate(payload, { clearHistory: true })
                }
            });
        },
        playSound(file) {
            const pathToBeep = fs.knownFolders.currentApp().getFolder('assets/audio')

            const player = new audio.TNSPlayer();
            const playerOptions = {
                audioFile: `${pathToBeep.path}/${file}`,
                loop: false,
                completeCallback: function () {
                    console.log('finished playing');
                },
                errorCallback: function (errorObject) {
                    console.log(JSON.stringify(errorObject));
                },
                infoCallback: function (args) {
                    console.log(JSON.stringify(args));
                }
            };

            player
                .playFromFile(playerOptions)
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    console.log('something went wrong...', err);
                });
        },
        checkContents() {
            const documents = fs.knownFolders.currentApp().getFolder('assets/audio');
            let entArray = []
            documents.getEntities()
            .then((entities) => {
                // entities is array with the document's files and folders.
                console.log('ent count', entities.length)
                entities.forEach((entity) => {
                    entArray.push(
                        {
                            name: entity.name,
                            path: entity.path,
                            lastModified: entity.lastModified.toString()
                        }
                    );
                    console.log('ent:', {
                            name: entity.name,
                            path: entity.path,
                            lastModified: entity.lastModified.toString()
                        })
                });
            }).catch((err) => {
                // Failed to obtain folder's contents.
                console.log(err.stack);
            });

            if(entArray.length > 0) {
                console.log('ents:',entArray)
            }
        },
        async getVersionName() {
          // appversion.getVersionName().then(v => {
          //   console.log("Your app's version is: " + v);
          //   return v
          // });

          const version = await appversion.getVersionName()
          this.SET_APP_VERSION(version)
        }
    }
}
