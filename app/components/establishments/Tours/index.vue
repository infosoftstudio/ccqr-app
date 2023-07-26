<template>
  <Page
    actionBarHidden="true"
    class="success"
    @loaded="pageLoaded()"
    style="margin-top: 95px"
  >
    <StackLayout>
      <ActivityIndicator :busy="busy" @busyChange="onBusyChanged" />

      <!-- <ListView
        v-if="!busy"
        class=""
        for="reservation in reservations['2023-07-27']"
      >
        <v-template>
          <Label :text="reservation.payment_type" />
        </v-template>
      </ListView> -->

      <ListView :items="reservations" for="(key, reservation) in reservations">
        <v-template>
          <Label :text="key" />

          <Label text="asdasd" />
          <!-- <ListView :items="reservation" for="item in reservation">
            <v-template>
              <Label :text="item.id" />
            </v-template>
          </ListView> -->
        </v-template>
      </ListView>
    </StackLayout>
  </Page>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import Globals from "~/mixins/globals";
import OfflineHelper from "~/mixins/offline-helper";
export default {
  data: () => ({
    busy: true,
    reservations: {},
    // listOfItems: ["asasasd", "zxczxc", 123, "gfgg"],
    listOfItems: [
      {
        text: "asdasd",
      },
      {
        text: "xzxc",
      },
      {
        text: "weqw",
      },
    ],
  }),
  mixins: [Globals, OfflineHelper],
  computed: {
    ...mapGetters("tours", ["tourReservations"]), //, 'code'
  },
  methods: {
    ...mapActions("tours", ["PENDING_BOOKINGS"]),
    onBusyChanged() {
      console.log(123);
    },
    pageLoaded() {
      this.fetchTours();
    },
    fetchTours() {
      this.PENDING_BOOKINGS()
        .then((res) => {
          this.reservations = Object.assign({}, this.reservations, res);
          console.log("res", res);
          console.log("reservations", this.reservations);
          this.busy = false;
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // closeButtonPressed() {
    //   this.$navigator.navigate("/dashboard", { clearHistory: true });
    // },
    // changePassword() {
    //   this.$navigator.navigate("/change-pass", { clearHistory: true });
    // },
  },
};
</script>
