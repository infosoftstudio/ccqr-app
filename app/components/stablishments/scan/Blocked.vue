<template>
  <Page id="blocked" actionBarHidden="true" class="success">
    <StackLayout>
      <Label class="status-minor header" horizontalAlignment="center" text="QR BLOCKED"/>
      <Label class="status-minor" horizontalAlignment="center" text="Report to the"/>
      <Label class="status-minor" horizontalAlignment="center" text="Municipal Health Office"/>
      <Label class="status-minor" horizontalAlignment="center" :text="reportNum"/>
      <Image class="status-minor" :src="serverUrl+scannedperson.photo_face" height="200" width="200" stretch="aspectFit"/>

      <Label class="qr" horizontalAlignment="center" :text="scannedperson.qr_code"/>
      <StackLayout class="name" orientation="horizontal" horizontalAlignment="center" width="100%">
        <Label textWrap="true">
          <FormattedString>
            <Label v-if="scannedperson.first_name" :text="scannedperson.first_name + ' '"/>
            <Label v-if="scannedperson.middle_name" :text="scannedperson.middle_name + ' '"/>
            <Label v-if="scannedperson.last_name" :text="scannedperson.last_name"/>
          </FormattedString>
        </Label>
      </StackLayout>
      <StackLayout class="address" orientation="vertical" horizontalAlignment="center" width="100%">
        <StackLayout  v-if="scannedperson.country" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="Country: "/>
          <Label class="info-content" :text="scannedperson.country"/>
        </StackLayout>
        <StackLayout  v-if="scannedperson.city" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="City: "/>
          <Label class="info-content" :text="scannedperson.city"/>
        </StackLayout>
        <StackLayout  v-if="scannedperson.barangay" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="Barangay: "/>
          <Label class="info-content" :text="scannedperson.barangay"/>
        </StackLayout>
        <StackLayout  v-if="scannedperson.address" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="Address: "/>
          <Label class="info-content" :text="scannedperson.address "/>
        </StackLayout>
      </StackLayout>
      <Button height="50" class="round-btn" text="Scan Again" @tap="closed()" style="margin-top: 20px"/>
    </StackLayout>
  </Page>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import Globals from '~/mixins/globals'
import urls from '~/urls.js'
export default {
  data: () => ({
    serverUrl: '',
    reportNum: '(09178816281)',
  }),
  mixins: [Globals],
  computed: {
    ...mapGetters('scanned', ['scannedperson', 'code']) //, 'code'
  },
  methods: {
    ...mapMutations('scanned', ['SET_CLOSE']),
    scanned () {
      for (let item in this.scannedperson) {
        console.log(item+` ${this.scannedperson[item]}`)
      }
    },
    closed () {
      this.SET_CLOSE(true)
      this.$modal.close()
    }
  },
  created() {
    this.serverUrl = urls.API_URL
  }
}
</script>
