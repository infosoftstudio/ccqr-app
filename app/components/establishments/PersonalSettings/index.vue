<template>
  <Page actionBarHidden="true" style="margin-top: 95px;">
    <DockLayout stretchLastChild="true">
      <Button dock="bottom" height="50" class="round-btn" text="Back to dashboard" @tap="closeButtonPressed()"/>
      <!-- <Label dock="top" class="info-label" :text="qr_link"/> -->
      <StackLayout dock="top">
        <MDCardView elevation="5" height="10%" @tap="logoutPressed()" class="dashboard-item">
          <DockLayout stretchLastChild="true" backgroundColor="#2abfc4">
            <Image dock="right" class="item-icon" src="~/assets/images/logout.png" stretch="aspectFit"/>
            <Label dock="left" text="Logout" width="70%" height="40%" />
          </DockLayout>
        </MDCardView>
        <MDCardView elevation="5" height="10%" @tap="changePassword()" class="dashboard-item">
          <DockLayout stretchLastChild="true" backgroundColor="#2abfc4">
            <Image dock="right" class="item-icon" src="~/assets/images/change_pass.png" stretch="aspectFit"/>
            <Label dock="left" text="Change Password" width="70%" height="40%" />
          </DockLayout>
        </MDCardView>
      </StackLayout>
    </DockLayout>
  </Page>
</template>
<script>
import { mapGetters } from 'vuex'
import Globals from '~/mixins/globals'
export default {
  // props: ['qr_link'],
  data: () => ({
    logoutUploadingClick: 0,
    isConnected: false,
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
      // ...mapGetters('scanned', ['scannedperson', 'code']) //, 'code'
      ...mapGetters("connection", ["hasConnection", "offlineScans"]),
  },
  methods: {
    closeButtonPressed () {
      this.$navigator.navigate("/dashboard", { clearHistory: true });
    },
    logoutPressed() {
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
            this.logout("/login", { clearHistory: true });
          }
        });
      } else if (
        !this._.isEmpty(this.offlineScans) &&
        this.isConnected === false
      ) {
        alert(
          "Please upload or Export Offline Scans first!"
        );
      } else {
        this.logout("/login", { clearHistory: true });
      }
    },
    changePassword() {
      this.$navigator.navigate("/change-pass", { clearHistory: true });
    },
  }
}
</script>
