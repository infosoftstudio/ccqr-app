<template>
  <Page @loaded="getNetwork(), getAppVersion()" actionBarHidden="true" class="login">
    <ActionBar title="App" />
    <MDCardView>
      <FlexboxLayout
        flexDirection="column"
        justifyContent="space-between"
        alignItems="stretch"
        class="login-container background"
      >
        <Label class="version" :text="`version: ${appVersion}`" />
        <Image
          src="~/assets/images/cleancamiguin.png"
          width="300"
          class="login-image"
        />
        <Button
          v-if="!isUpdated"
          height="50"
          class="update-button"
          text="App outdated, click here to download latest apk file"
          @tap="apkLink"
        />
        <StackLayout
          v-if="isUpdated"
          verticalAlignment="center"
          class="login-field"
        >
          <TextField
            height="50"
            hint="QR code"
            v-model="form.qr_code"
            class="input-rounded"
          />
          <TextField
            height="50"
            hint="Password"
            secure="true"
            v-model="form.password"
            class="input-rounded"
          />
          <Button height="50" class="round-btn" text="Login" @tap="login" />
          <!-- <Button height="50" class="label-only" text="getUrl" @tap="getUrl"/> -->

          <!-- <Button height="50" class="label-only" text="err sound" @tap="err"/> -->
        </StackLayout>
        <StackLayout orientation="horizontal">
          <!-- <Button width="44%" class="hyperlink-camiguin" @tap="camiguinLink" /> -->
          <Button width="44%" class="hyperlink-camiguin" @tap="getAppVersion" />
          <Button width="44%" class="hyperlink-infosoft" @tap="infosoftLink" />
        </StackLayout>
      </FlexboxLayout>
    </MDCardView>
  </Page>
</template>

<script>
import Globals from "../mixins/globals";
import { mapActions, mapMutations, mapGetters } from "vuex";
import { openUrl } from "@nativescript/core/utils/utils";
import {
  connectionType,
  startMonitoring,
} from "@nativescript/core/connectivity";
import urls from "../urls";
export default {
  data: () => ({
    form: {},
    isUpdated: true,
    dbVersion: null,
    connectionStatus: null,
  }),
  created() {
    this.loadLogin();
  },
  computed: {
    ...mapGetters("login", ["user"]),
    ...mapGetters("user", ["appVersion"]),
  },
  mixins: [Globals],
  methods: {
    ...mapActions("login", ["LOGIN_USER"]),
    ...mapActions("connection", ["FETCH_VERSION"]),
    ...mapMutations("login", ["SET_USER", "LOAD_USER"]),
    login() {
      this.LOGIN_USER(this.form)
        .then((data) => {
          if (!this._.isEmpty(data)) {
            this.SET_USER(data);
            this.$navigator.navigate("/dashboard", { clearHistory: true });
          } else {
            this.snackBar("error", data.data, "Could not connect to server");
          }
        })
        .catch((data) => {
          this.snackBar(
            "password",
            data.data,
            "Please check your QR code and password"
          );
        });
    },
    camiguinLink() {
      openUrl("http://www.camiguin.gov.ph/");
    },
    infosoftLink() {
      openUrl("https://infosoftstudio.com/");
    },
    apkLink() {
      openUrl("https://qrgo.page.link/R5mRM");
    },
    getUrl() {
      // console.log(urls.API_URL)
    },
    getNetwork() {
      startMonitoring((newConnectionType) => {
        switch (newConnectionType) {
          case connectionType.none:
            console.log("do stuff without internet");
            this.connectionStatus = "none";
            // this.isUpdated = false
            break;
          case connectionType.wifi:
            // this.version();
            this.connectionStatus = "wifi";
            break;
          case connectionType.mobile:
            // this.version();
            this.connectionStatus = "mobiledata";
            break;
          default:
            this.isUpdated = false;
            break;
        }
      });
    },
    loadLogin() {

      if (urls.DEBUG) {
        this.form = Object.assign({}, this.form, urls.LOGIN);
      }
    },
    getAppVersion() {
        this.getVersionName()
    },
  },
};
</script>
