import { Feedback, FeedbackType, FeedbackPosition } from "nativescript-feedback"
import { TNSPlayer } from 'nativescript-audio'
import { Color } from "@nativescript/core/color"
import { mapMutations } from 'vuex'
import * as fs from "@nativescript/core/file-system"
import {
    clear
} from "@nativescript/core/application-settings";

export default {
    methods: {
        ...mapMutations('login', ['RESET_LOGIN_STATE']),
        ...mapMutations('scanned', ['RESET_SCANNED_STATE']),
        snackBar (icon, title, message) {
            this.feedback = new Feedback();

            this.feedback.show({
                title: title,
                titleColor: new Color("white"),
                position: FeedbackPosition.Top,
                type: FeedbackType.Custom, // this is the default type, by the way
                message: message,
                messageColor: new Color("white"),
                duration: 3000,
                backgroundColor: new Color("#e6494b"),
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
        playSound(filePath) {
            // const pathToBeep = fs.path.join(fs.knownFolders.currentApp().path, 'audio/buzzer.mp3')
            const pathToBeep = fs.path.join(fs.knownFolders.currentApp().path, 'audio/buzzer.mp3')
            console.log('pathToBeep', pathToBeep)

            const player = new TNSPlayer();
            const playerOptions = {
                audioFile: pathToBeep,
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
    }
}
