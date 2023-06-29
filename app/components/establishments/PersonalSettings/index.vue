<template>
  <Page
    actionBarHidden="true"
    @loaded="monitorNetworkStart(), loadData()"
    style="margin-top: 95px"
  >
    <DockLayout stretchLastChild="true">
      <!-- <Button dock="bottom" height="50" class="round-btn" text="Back to dashboard" @tap="closeButtonPressed()"/> -->
      <MDCardView
        dock="bottom"
        elevation="5"
        height="10%"
        @tap="closeButtonPressed()"
        class="dashboard-item"
      >
        <DockLayout stretchLastChild="true" backgroundColor="#f68f4f">
          <Image
            dock="right"
            class="item-icon"
            src="~/assets/images/home.png"
            stretch="aspectFit"
          />
          <Label
            class="ml-5"
            dock="left"
            text="Back to dashboard"
            width="100%"
            height="40%"
          />
        </DockLayout>
      </MDCardView>
      <!-- <Label dock="top" class="info-label" :text="qr_link"/> -->
      <StackLayout dock="top">
        <MDCardView
          elevation="5"
          height="10%"
          @tap="logoutPressed()"
          class="dashboard-item"
        >
          <DockLayout stretchLastChild="true" backgroundColor="#2abfc4">
            <Image
              dock="right"
              class="item-icon"
              src="~/assets/images/logout.png"
              stretch="aspectFit"
            />
            <Label dock="left" text="Logout" width="70%" height="40%" />
          </DockLayout>
        </MDCardView>
        <MDCardView
          elevation="5"
          height="10%"
          @tap="changePassword()"
          class="dashboard-item"
        >
          <DockLayout stretchLastChild="true" backgroundColor="#2abfc4">
            <Image
              dock="right"
              class="item-icon"
              src="~/assets/images/change_pass.png"
              stretch="aspectFit"
            />
            <Label
              dock="left"
              text="Change Password"
              width="70%"
              height="40%"
            />
          </DockLayout>
        </MDCardView>
      </StackLayout>
    </DockLayout>
  </Page>
</template>
<script>
import {
  connectionType,
  startMonitoring,
} from "@nativescript/core/connectivity";
import { mapGetters, mapMutations, mapActions } from "vuex";
import UploadModalStatus from "~/components/establishments/scan/UploadModalStatus";
import Globals from "~/mixins/globals";
export default {
  // props: ['qr_link'],
  data: () => ({
    isConnected: false,
    items: [],
    logoutUploadingClick: 0,
    networkStatus: "",
    onlyonce: 0,
    totalItems: 0,
  }),
  mixins: [Globals],
  watch: {
    hasConnection: {
      handler() {
        this.isConnected = this.hasConnection;
      },
      deep: true,
    },
  },
  computed: {
    ...mapGetters("login", ["user"]),
    ...mapGetters("connection", ["hasConnection", "offlineScans"]),
  },
  methods: {
    ...mapMutations("connection", [
      "SET_COUNT_ITEM",
      "SET_HASCONNECTION",
      "SET_REMOVE_INDEX_NO_CONNECTION_QR",
      "LOAD_NO_CONNECTION_QR",
    ]),
    ...mapActions("scanned", ["LOG_SCANNED"]),
    closeButtonPressed() {
      this.$navigator.navigate("/dashboard", { clearHistory: true });
    },
    logoutPressed() {
      // console.log(123, [!this._.isEmpty(this.offlineScans), this.isConnected, {'offlineScans': this.offlineScans}])
      if (!this._.isEmpty(this.offlineScans) && this.isConnected === true) {
        confirm({
          title: "Caution!",
          message: "Please upload or Export Offline Scans first!",
          okButtonText: "UPLOAD",
          cancelButtonText: "CANCEL",
        }).then((result) => {
          if (result) {
            this.logoutUploadingClick += 1; // increament once click "ok"
            if (this.logoutUploadingClick === 1) {
              console.log("logoutUploadingClick", this.items);
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
            this.logout("/login", { clearHistory: true });
          }
        });
      } else if (
        !this._.isEmpty(this.offlineScans) &&
        this.isConnected === false
      ) {
        alert("Please upload or Export Offline Scans first!");
      } else {
        this.logout("/login", { clearHistory: true });
      }
    },
    monitorNetworkStart() {
      this.networkStatus = "Monitoring network connection changes.";
      startMonitoring((newConnectionType) => {
        console.log(123, newConnectionType);
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
                this.calledIfHasNet();
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
                this.calledIfHasNet();
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
    async loadData() {
      await this.LOAD_NO_CONNECTION_QR();
    },
    changePassword() {
      this.$navigator.navigate("/change-pass", { clearHistory: true });
    },
  },
};
</script>
