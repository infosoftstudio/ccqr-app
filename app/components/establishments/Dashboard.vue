<template>
  <Page @loaded="oneGlance(), getAppVersion()" actionBarHidden="true">
    <StackLayout>
      <MDCardView elevation="5" height="25%" class="dashboard-item image">
        <AbsoluteLayout backgroundColor="#3c495e">
          <Image top="0" src="~/assets/images/dashboard.png" height="100%" width="100%" stretch="fill"/>
          <!-- @tap="onLogoutClick()" -->
          <MDFloatingActionButton
            @tap="userSettingsClicked()"
            left="240"
            rippleColor="#d79a73"
            backgroundColor="#f68f4f"
            text="Settings"
            style="color: white;"
          >
            <Image dock="right" class="item-icon" src="~/assets/images/entrance.png" stretch="aspectFit"/>
          </MDFloatingActionButton>
          <!-- <Button
            v-if="appVersion < dbVersion"
            top="80" left="10"
            height="50" class="update-button dashboard"
            text="Click to update to latest version"
            @tap="apkLink"
          /> -->
          <!-- v-if="appVersion >= dbVersion" -->
          <Label
            top="80" left="25"
            width="70%" height="40%"
            fontSize="20"
            class="version-text"
            color="#2abfc4"
            :text="`App version: ${appVersion}`"
          />
          <Label
            top="140" left="25"
            width="70%" height="40%"
            fontSize="20"
            class="establishment-name"
            :text="user.establishment ? user.establishment.name : null"
          />

        </AbsoluteLayout>
      </MDCardView>

      <MDCardView elevation="5" height="10%" @tap="scan(false, true, 'entrance')" class="dashboard-item">
        <DockLayout stretchLastChild="true" backgroundColor="#2abfc4">
          <Image dock="right" class="item-icon" src="~/assets/images/entrance.png" stretch="aspectFit"/>
          <Label dock="left" text="Entrance scan" width="70%" height="40%" />
        </DockLayout>
      </MDCardView>

      <MDCardView elevation="5" height="10%" @tap="scan(false, true, 'exit')" class="dashboard-item">
        <DockLayout stretchLastChild="true" backgroundColor="#f68f4f">
          <Image dock="right" class="item-icon" src="~/assets/images/exit.png" stretch="aspectFit"/>
          <Label dock="left" text="Exit scan" width="70%" height="40%" />
        </DockLayout>
      </MDCardView>

      <MDCardView elevation="5" height="10%" @tap="port_scan(true)" class="dashboard-item" v-if="visitorChecker">
        <DockLayout stretchLastChild="true" backgroundColor="#307f82">
          <Image dock="right" class="item-icon" src="~/assets/images/entrance.png" stretch="aspectFit"/>
          <Label dock="left" text="Scan RT-PCR" width="70%" height="40%" />
        </DockLayout>
      </MDCardView>

      <MDCardView elevation="5" height="10%" @tap="exportOfflineScanClicked()" class="dashboard-item" v-if="offlineScans.length > 0">
        <DockLayout stretchLastChild="true" backgroundColor="#2abfc4">
          <Image dock="right" class="item-icon" src="~/assets/images/logs.png" stretch="aspectFit"/>
          <Label dock="left" :text="`Download offline scans: ${offlineScans.length}`" width="70%" height="40%" />
        </DockLayout>
      </MDCardView>

      <!-- <MDCardView elevation="5" height="10%" @tap="test()" class="dashboard-item">
        <DockLayout stretchLastChild="true" backgroundColor="#307f82">
          <Image dock="right" class="item-icon" src="~/assets/images/entrance.png" stretch="aspectFit"/>
          <Label dock="left" text="TESTING" width="70%" height="40%" />
        </DockLayout>
      </MDCardView> -->

      <!-- <MDCardView elevation="5" height="10%" @tap="port_scan(false)" class="dashboard-item" v-if="user.role == 'port'">
        <DockLayout stretchLastChild="true" backgroundColor="#0d3c3d">
          <Image dock="right" class="item-icon" src="~/assets/images/exit.png" stretch="aspectFit"/>
          <Label dock="left" text="Scan HDF" width="70%" height="40%" />
        </DockLayout>
      </MDCardView> -->

      <!-- <Button width="44%" class="hyperlink-camiguin" @tap="errorSound()"/> -->

      <BarcodeScanner
          row="1"
          height="300"
          formats="QR_CODE, EAN_13, UPC_A"
          beepOnScan="true"
          reportDuplicates="true"
          preferFrontCamera="false"
          @scanResult="onScanResult"
      </BarcodeScanner>

      <StackLayout height="100%" orientation="horizontal">
        <StackLayout orientation="horizontal" verticalAlignment="bottom" >
          <Button width="44%" class="hyperlink-camiguin" @tap="camiguinLink"/>
          <Button width="44%" class="hyperlink-infosoft" @tap="infosoftLink"/>
        </StackLayout>
      </StackLayout>
    </StackLayout>
  </Page>
</template>
<script>
// import appversion from 'nativescript-appversion'
import { BarcodeScanner } from "nativescript-barcodescanner";
import { mapGetters, mapActions, mapMutations } from "vuex";
import { openUrl } from "@nativescript/core/utils/utils";

// import connectivityModule from '@nativescript/core/connectivity'
import {
  connectionType,
  getConnectionType,
  startMonitoring,
  stopMonitoring,
} from "@nativescript/core/connectivity";

import Globals from "../../mixins/globals";
import ScannedPerson from "../establishments/scan/ScannedPerson";
import Blocked from "../establishments/scan/Blocked";
import ScannedRtpcr from "../establishments/scan/ScannedRtpcr";
import ScannedHDF from "../establishments/scan/ScannedHDF";
// import * as fs from "@nativescript/core/file-system";

import moment from "moment";

import UploadModalStatus from "./scan/UploadModalStatus";
export default {
  data() {
    return {
      networkStatus: "",
      onlyonce: 0,
      items: [],
      isConnected: false,
      route: "",
      dbVersion: null,
      logoutUploading: false,
      logoutUploadingClick: 0,
      totalItems: 0,
    };
  },
  computed: {
    ...mapGetters("login", ["user"]),
    ...mapGetters("scanned", [
      "scannedperson",
      "code",
      "close",
      "tap",
      "countItem",
    ]),
    ...mapGetters("connection", ["hasConnection", "offlineScans"]),
    ...mapGetters("user", ["appVersion"]),
    visitorChecker() {
      const roles = ["port", "airport"];
      return roles.includes(this.user.role);
    },
  },
  watch: {
    hasConnection: {
      handler() {
        this.isConnected = this.hasConnection;
      },
      deep: true,
    },
    close: {
      handler() {
        if (this.close === true) {
          this.SET_CLOSE(false);
          this.scan(this.tap.front, this.tap.flip, this.tap.params);
        }
      },
      deep: true,
    },
  },
  mixins: [Globals],
  components: { ScannedPerson, Blocked, ScannedRtpcr, ScannedHDF },
  methods: {
    ...mapActions("scanned", ["LOG_SCANNED", "CREATE_ADD_LOG", "VERIFY_HDF"]),
    ...mapActions("connection", ["FETCH_VERSION"]),
    ...mapMutations("scanned", [
      "SET_SCANNED_PERSON",
      "SET_CODE",
      "SET_TAP",
      "SET_CLOSE",
      "SET_COUNT_ITEM",
      "SET_MAX_ITEM",
    ]),
    ...mapMutations("login", ["LOAD_USER"]),
    ...mapMutations("connection", [
      "SET_HASCONNECTION",
      "SET_ADDITIONAL_NO_CONNECTION_QR",
      "LOAD_NO_CONNECTION_QR",
      "SET_REMOVE_INDEX_NO_CONNECTION_QR",
      "REMOVE_OFFLINE_SCANS",
    ]),
    hdf_scan(initial) {
      /*const pathToBeep = fs.path.join(fs.knownFolders.currentApp().path,  initial ? 'audio/hdf-verify.mp3' : 'audio/hdf-duplicate.mp3');
            let beep;
            if (fs.File.exists(pathToBeep)) {
                beep = Sound.create(pathToBeep)
                setTimeout(() => {
                    beep.play();
                }, 500);select * from individual_logs order by id desc limit 100
            }*/
    },

    onScanResult(evt) {
      // console.log(`onScanResult: ${evt.text} (${evt.format})`);
    },
    oneGlance() {
      this.monitorNetworkStart();
      this.loadData();
    },
    tourScan() {
      // this.snackBar("facescan", 'Tours', 'Tours scan')
    },
    scan(preferFrontCamera, showFlipCameraButton, params) {
      this.SET_TAP({
        front: preferFrontCamera,
        flip: showFlipCameraButton,
        params: params,
      });
      // this.goTo('/scan')
      // this.$navigator.navigate('/scan')
      new BarcodeScanner()
        .scan({
          cancelLabel: "EXIT. Also, try the volume buttons!",
          cancelLabelBackgroundColor: "#333333",
          message: "Use the volume buttons for extra light",
          preferFrontCamera,
          fullScreen: false,
          showTorchButton: true,
          torchOn: false,
          resultDisplayDuration: 500,
          beepOnScan: true,
          openSettingsIfPermissionWasPreviouslyDenied: true,
          closeCallback: () => {
            // console.log("Scanner closed @ " + new Date().getTime());
            // this.scan(preferFrontCamera, showFlipCameraButton, params)
          },
        })
        .then((data) => {
          setTimeout(() => {
            if (this.isConnected === true) {
              this.LOG_SCANNED({
                qr: data.text,
                type: params,
                mode: "online",
                version: this.appVersion,
              })
                .then((response) => {
                  this.SET_SCANNED_PERSON(null);
                  this.SET_SCANNED_PERSON(response);
                  this.$showModal(ScannedPerson);
                  if (response.individual.age < 18) {
                    this.playSound("buzzer.mp3");
                  } else if (
                    this.visitorChecker &&
                    response.visit_reservation[0] == "red"
                  ) {
                    this.playSound("buzzer.mp3");
                  } else {
                    this.playSound("hdf-verify.mp3");
                  }
                  // this.scan(preferFrontCamera, showFlipCameraButton, params)
                })
                .catch((response) => {
                  if (response.data.status == "BLOCKED") {
                    this.SET_SCANNED_PERSON(null);
                    this.SET_SCANNED_PERSON(response.data[0]);
                    this.$showModal(Blocked);
                  } else {
                    this.snackBar(
                      "facescan",
                      response.data,
                      "Qr code does not exist!"
                    );
                  }
                });
            } else {
              const scan = {
                qr: data.text,
                establishment_id: this.user.establishment.id,
                type: params,
                time_scanned: moment().format(),
                mode: "offline",
                version: this.appVersion,
              };

              this.SET_ADDITIONAL_NO_CONNECTION_QR(scan);
              this.SET_SCANNED_PERSON(null);
              this.SET_SCANNED_PERSON({
                offline: true,
                individual: {
                  qr_code: data.text,
                },
              });
              this.$showModal(ScannedPerson);
              this.playSound("hdf-verify.mp3");
              // this.scan(preferFrontCamera, showFlipCameraButton, params)
            }
          }, 100);
        })
        .catch((data) => {
          console.log(data);
        });
    },
    port_scan(is_rtpcr_scan) {
      if (this.isConnected === true) {
        new BarcodeScanner()
          .scan({
            cancelLabel: "EXIT. Also, try the volume buttons!",
            cancelLabelBackgroundColor: "#333333",
            message: "Use the volume buttons for extra light",
            fullScreen: false,
            showTorchButton: true,
            torchOn: false,
            resultDisplayDuration: 500,
            beepOnScan: true,
            openSettingsIfPermissionWasPreviouslyDenied: true,
            closeCallback: () => {
              console.log("Scanner closed @ " + new Date().getTime());
            },
          })
          .then((data) => {
            console.log(is_rtpcr_scan);
            setTimeout(() => {
              if (this.isConnected === true) {
                if (is_rtpcr_scan)
                  this.$showModal(ScannedRtpcr, {
                    fullscreen: true,
                    props: { qr_link: data.text },
                  });
                else {
                  this.VERIFY_HDF({ token: data.text })
                    .then((response) => {
                      let passenger = response[0];
                      passenger.updated_at = moment(
                        passenger.updated_at
                      ).format("LLL");
                      passenger.davao_arrival =
                        passenger.davao_arrival &&
                        moment(passenger.davao_arrival).format("LL");
                      passenger.davao_vessel_type =
                        passenger.davao_vessel_type &&
                        passenger.davao_vessel_type.toUpperCase();
                      passenger.davao_transport_type =
                        passenger.davao_transport_type &&
                        passenger.davao_transport_type.toUpperCase();
                      passenger.davao_vehicle_type =
                        passenger.vehicle &&
                        passenger.vehicle.name.toUpperCase();
                      this.hdf_scan(passenger.rtcpcr_verify);

                      this.$showModal(ScannedHDF, {
                        fullscreen: true,
                        props: { passenger: passenger },
                      });
                    })
                    .catch((response) => {
                      this.snackBar(
                        "facescan",
                        response.data,
                        "Qr code does not exist!"
                      );
                    });
                }
              } else
                this.snackBar(
                  "error",
                  "Connection error",
                  "Feature not available for offline use."
                );
            }, 100);
          });
      } else
        this.snackBar(
          "error",
          "Connection error",
          "Feature not available for offline use."
        );
    },
    async loadData() {
      await this.LOAD_USER();
      await this.LOAD_NO_CONNECTION_QR();
    },
    dummyItems() {
      console.log("scanned");
      this.SET_ADDITIONAL_NO_CONNECTION_QR({
        qr: "CCQRQBNKMG",
        type: "entrance",
        time_scanned: moment().format(),
      });
    },
    calledIfHasNet() {
      this.SET_COUNT_ITEM(0);
      this.totalItems = 0;
      this.items = this.offlineScans;
      this.logoutUploadingClick = 0; // to reset into 0 when connection successfully established
      confirm({
        title: "Upload scanned QR",
        message:
          "Click the Upload button to send your scanned QRs. Turn off mobile data or WiFi if this dialog message appears again.",
        okButtonText: "Upload",
        cancelButtonText: "Cancel",
      }).then((result) => {
        console.log(result);
        if (result === true) {
          // this.SET_MAX_ITEM(this.items.length)
          // for (let idx in this.items) { // in is array index, of is object
          //     this.LOG_SCANNED(this.items[idx]).then(data => {
          //         this.totalItems += 1
          //         this.SET_COUNT_ITEM(this.totalItems)
          //         this.SET_REMOVE_INDEX_NO_CONNECTION_QR(idx)
          //     })
          // }
          this.$showModal(UploadModalStatus);
        }
      });
    },
    monitorNetworkStart() {
      this.networkStatus = "Monitoring network connection changes.";
      startMonitoring((newConnectionType) => {
        switch (newConnectionType) {
          case connectionType.none:
            console.log("Connection type changed to none.");
            this.networkStatus = "Connection type changed to none.";
            this.snackBar(
              "error",
              "Connection error",
              "Could not connect to server."
            );
            this.SET_HASCONNECTION(false);
            this.onlyonce = 0;
            break;
          case connectionType.wifi:
            console.log("Connection type changed to WiFi.");
            this.networkStatus = "Connection type changed to WiFi.";
            this.SET_HASCONNECTION(true);
            if (
              !this._.isEmpty(this.offlineScans) &&
              Object.entries(this.user).length !== 0
            ) {
              this.onlyonce += 1;
              if (this.onlyonce === 1) {
                // this.calledIfHasNet();
              }
            }
            break;
          case connectionType.mobile:
            console.log("Connection type changed to mobile.");
            this.networkStatus = "Connection type changed to mobile.";
            this.SET_HASCONNECTION(true);
            if (
              !this._.isEmpty(this.offlineScans) &&
              Object.entries(this.user).length !== 0
            ) {
              this.onlyonce += 1;
              if (this.onlyonce === 1) {
                // this.calledIfHasNet();
              }
            }
            break;
          default:
            this.SET_HASCONNECTION(false);
            this.onlyonce = 0;
            break;
        }
      });
    },
    camiguinLink() {
      openUrl("http://www.camiguin.gov.ph/");
    },
    infosoftLink() {
      openUrl("https://infosoftstudio.com/");
    },
    onLogoutClick() {
      console.log(this.user);
      if (!this._.isEmpty(this.offlineScans) && this.isConnected === true) {
        confirm({
          title: "Caution!",
          message:
            "Please upload or Export Offline Scans first!",
          okButtonText: "UPLOAD",
          cancelButtonText: "CANCEL",
        }).then((result) => {
          if (result) {
            this.logoutUploadingClick += 1; // increament once click "ok"
            if (this.logoutUploadingClick === 1) {
              // to catch multiple click in logout // execute only once
              for (let idx in this.items) {
                this.LOG_SCANNED(this.items[idx]).then((data) => {
                  if (this._.isEmpty(this.offlineScans)) {
                    // to validate if emtpy na ang sa store
                    this.logoutUploadingClick = 0; // to reset the only click once
                    this.items = this.offlineScans; // to reset the items
                    alert(
                      "Offline scans are successfully uploaded! You can now log out safely"
                    );
                  }
                  this.SET_REMOVE_INDEX_NO_CONNECTION_QR(idx);
                });
              }
            }
          } else {
            this.logout("/login");
          }
        });
      } else if (
        !this._.isEmpty(this.offlineScans) &&
        this.isConnected === false
      ) {
        alert(
          "Please upload or Export Offline Scans first!",
        );
      } else {
        this.logout("/login");
      }
    },
    test() {
      console.log("offline scanssss:", this.offlineScans);
    },
    async version() {
      /*
          await this.FETCH_VERSION().then(response => {
            this.dbVersion = this._.toString(response)
          })
          await appversion.getVersionName().then(data => {
            this.appVersion = this._.toString(data)
          })

          console.log('dbVersion', this.dbVersion)
          console.log('appVersion', this.appVersion)

          if (parseFloat(this.dbVersion) > parseFloat(this.appVersion)) {
            this.snackbar('error', 'Version', 'New version available.')
          }*/
    },
    apkLink() {
      openUrl("https://qrgo.page.link/R5mRM");
    },
    exportOfflineScanClicked() {
      this.checkPermission();
    },
    checkPermission() {
      const permissions = require("nativescript-permissions");

      permissions
        .requestPermissions(
          [
            android.Manifest.permission.READ_EXTERNAL_STORAGE,
            android.Manifest.permission.WRITE_EXTERNAL_STORAGE,
          ],
          "Permission needed to save text file"
        )
        .then((eee) => {
          console.log(eee);
          this.exportScans();
        })
        .catch((eee) => {
          console.error(eee);
          this.snackBar(
            "permission",
            "Enable permission",
            "Please allow permission to export."
          );
        });
    },
    async exportScans() {
      const fileSystemModule = require("@nativescript/core/file-system");

      // Get the downloads folder path
      const downloadsFolder =
        android.os.Environment.getExternalStoragePublicDirectory(
          android.os.Environment.DIRECTORY_DOWNLOADS
        ).toString();

      const fileName = await this.generateFileName();

      const filePath = fileSystemModule.path.join(downloadsFolder, fileName);
      const file = fileSystemModule.File.fromPath(filePath);

      // Write some text to the file
      const fileText = await this.offlineScans;
      const stringified = await JSON.stringify(fileText);

      console.log(123123, stringified);

      file
        .writeText(stringified)
        .then(() => {
          this.snackBar(
            "export_file",
            "Exported",
            fileName + " saved on Downloads folder",
            "#2abfc4"
          );

          setTimeout(() => {
            this.REMOVE_OFFLINE_SCANS();
            this.SET_MAX_ITEM(0);
            this.SET_COUNT_ITEM(0);
          }, 50);
        })
        .catch((err) => {
          this.snackBar("error", "Error saving file", err);
        });
    },
    async doShareImage() {
      const imageSrc = await ImageSource.fromUrl(
        "https://thiscatdoesnotexist.com/"
      );
      shareImage(imageSrc);
    },
    generateFileName() {
      const randomString = Math.random().toString(36).substring(2, 14);
      // const qrcode = this.user.establishment.qr_code;

      const now = moment();
      const nowString = now.format("YYYY-MM-DD");
      return `${randomString}-${nowString}.json`;
    },
    userSettingsClicked() {
      this.$navigator.navigate("/settings", { clearHistory: true });
    },
    getAppVersion() {
      this.getVersionName()
    },
  },
};
</script>

<style>
.margin-20px {
  margin: 20px;
}
,
.log-margins {
  margin-left: 20px;
  margin-right: 20px;
  margin-top: 5px;
  margin-bottom: 5px;
}
,
.fab-button {
  height: 70;
  width: 70;
  margin: 15;
  background-color: #ff4081;
  horizontal-align: right;
  vertical-align: top;
  position: absolute;
}
</style>
