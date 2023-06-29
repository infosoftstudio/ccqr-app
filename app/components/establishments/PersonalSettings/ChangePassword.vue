<template>
  <Page actionBarHidden="true" class="success" style="margin-top: 95px">
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
            src="~/assets/images/settings.png"
            stretch="aspectFit"
          />
          <Label
            class="ml-5"
            dock="left"
            text="Return to Settings"
            width="100%"
            height="40%"
          />
        </DockLayout>
      </MDCardView>
      <StackLayout
        dock="top"
        class="name"
        verticalAlignment="center"
        width="100%"
      >
        <TextField
          height="50"
          :secure="secureFields"
          class="input-rounded"
          v-model="form.old_password"
          :text="textFieldValue"
          hint="Enter Old Password"
        />
        <TextField
          height="50"
          :secure="secureFields"
          class="input-rounded"
          v-model="form.password"
          :text="textFieldValue"
          hint="Enter New Password"
        />
        <TextField
          height="50"
          :secure="secureFields"
          class="input-rounded"
          v-model="form.confirm_password"
          :text="textFieldValue"
          hint="Confirm New Password"
        />
        <Button
          height="50"
          class="round-btn-success"
          :text="submitEnabled ? 'Submit' : 'Updating password...'"
          :isEnabled="submitEnabled"
          @tap="continuePressed()"
        />
      </StackLayout>
      <!-- <Button dock="bottom" height="50" class="view-vax-pic" text="Close" @tap="$modal.close"/> -->
    </DockLayout>
  </Page>
</template>
<script>
import Globals from "~/mixins/globals";
import { mapActions } from "vuex";
export default {
  mixins: [Globals],
  data: () => ({
    form: {},
    secureFields: true,
    submitEnabled: true,
  }),
  methods: {
    ...mapActions("login", ["CHANGE_PASSWORD"]),
    closeButtonPressed() {
      this.$navigator.navigate("/settings", { clearHistory: true });
    },
    continuePressed() {
      this.submitEnabled = false;
      this.CHANGE_PASSWORD(this.form)
        .then(() => {
          this.submitEnabled = true;
          this.snackBar("check", "Password updated!", "", "#6edb1b");
          this.$navigator.navigate("/settings", { clearHistory: true });
        })
        .catch((err) => {
          this.submitEnabled = true;

          if (err.data) {
            if (err.data.x_password) {
              this.snackBar("password", err.data.x_password, "");
            } else if (err.data.errors) {
              const firstError = Object.keys(err.data.errors)[0];

              this.snackBar("password", err.data.errors[firstError][0], "");
            } else {
              console.error(err);
            }
          } else {
            // console.error(err);
            this.snackBar("exclamation", "Could not connect to server.", "");
          }
        });
    },
  },
};
</script>
