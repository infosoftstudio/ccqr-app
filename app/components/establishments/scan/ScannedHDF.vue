<template>
  <Page actionBarHidden="true" class="success" style="margin-top: 95px;">
    <DockLayout stretchLastChild="true">
      <Button dock="bottom" height="50" class="round-btn" text="Close" @tap="$modal.close"/>
      <StackLayout dock="top" class="name " horizontalAlignment="center" width="100%">
        <Image v-if="!passenger.rtcpcr_verify" class="verified-logo" src="~/assets/images/check.png" stretch="aspectFit"/>
        <Image v-else class="verified-logo" src="~/assets/images/exclamation.png" stretch="aspectFit"/>
        <!-- <Image class="verified-logo" src="~/assets/images/exclamation.png" stretch="aspectFit"/> -->

        <Label v-if="!passenger.rtcpcr_verify" class="hdf-verified" text="VERIFIED" horizontalAlignment="center"/>
        <Label v-if="passenger.rtcpcr_verify" class="hdf-alert" text="DUPLICATE ENTRY" horizontalAlignment="center"/>
        <Label v-if="passenger.rtcpcr_verify" class="hdf-alert" :text="`VERIFIED AT: ${passenger.updated_at}`" horizontalAlignment="center"/>
        <Label textWrap="true" horizontalAlignment="center">
          <FormattedString>
            <Label v-if="passenger.first_name" :text="passenger.first_name + ' '"/>
            <Label v-if="passenger.middle_name" :text="passenger.middle_name + ' '"/>
            <Label v-if="passenger.last_name" :text="passenger.last_name"/>
          </FormattedString>
        </Label>
        <StackLayout orientation="vertical" horizontalAlignment="center" width="100%" style="margin-top: 5%;">
          <StackLayout v-if="passenger.davao_vessel_type" orientation="horizontal" horizontalAlignment="center">
            <Label class="hdf-label" text="Vessel type: "/>
            <Label class="hdf-content" :text="passenger.davao_vessel_type"/>
          </StackLayout>
          <StackLayout  v-if="passenger.davao_arrival" orientation="horizontal" horizontalAlignment="center">
            <Label class="hdf-label" text="Arrival date: "/>
            <Label class="hdf-content" :text="passenger.davao_arrival"/>
          </StackLayout>
          <StackLayout  v-if="passenger.davao_transport_type" orientation="horizontal" horizontalAlignment="center">
            <Label class="hdf-label" text="Transportation type: "/>
            <Label class="hdf-content" :text="passenger.davao_transport_type"/>
          </StackLayout>
          <StackLayout  v-if="passenger.davao_vehicle_type" orientation="horizontal" horizontalAlignment="center">
            <Label class="hdf-label" text="Vehicle type: "/>
            <Label class="hdf-content" :text="passenger.davao_vehicle_type"/>
          </StackLayout>
          <StackLayout  v-if="passenger.davao_vessel_type === 'LAND'" orientation="horizontal" horizontalAlignment="center">
            <Label class="hdf-label" text="Plate number: "/>
            <Label class="hdf-content" :text="passenger.davao_plate_no"/>
          </StackLayout>
          <Button height="50" class="view-vax-pic" text="View vaccination id" @tap="viewImage()"/>
        </StackLayout>
      </StackLayout>
    </DockLayout>
  </Page>
</template>
<script>
import { mapGetters } from 'vuex'
import Globals from '~/mixins/globals'
import VaxImageZoom from './VaxImageZoom'
export default {
  props: ['passenger'],
  components: {VaxImageZoom},
  mixins: [Globals],
  computed: {
      ...mapGetters('scanned', ['scannedperson', 'code']) //, 'code'
  },
  methods: {
    viewImage() {
      this.$showModal(VaxImageZoom, { fullscreen: true, props: {'image': this.passenger.vaccination_id_picture}} )
    },
  },
  created() {
    console.log(this.passenger)
  }
}
</script>