<template>
  <Page
    actionBarHidden="true"
    @loaded="monitorNetworkStart(), loadData()"
    style="margin-top: 95px"
  >
    <DockLayout stretchLastChild="true">
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
import OfflineHelper from "~/mixins/offline-helper";
import Globals from "~/mixins/globals";
export default {
  data: () => ({}),
  mixins: [Globals, OfflineHelper],
  methods: {
    closeButtonPressed() {
      this.$navigator.navigate("/dashboard", { clearHistory: true });
    },
    changePassword() {
      this.$navigator.navigate("/change-pass", { clearHistory: true });
    },
  },
};
</script>
