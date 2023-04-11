<template>
  <Page actionBarHidden="true" class="success">
    <StackLayout>
      <Label v-if="scannedperson.individual.age >= minor_age && scannedperson.individual.first_name" class="status-success" horizontalAlignment="center" text="SCAN SUCCESSFUL"/>
      <Label v-if="scannedperson.individual.age < minor_age && scannedperson.individual.first_name" class="status-minor" horizontalAlignment="center" text="MINOR INDIVIDUAL"/>
      <Label v-if="scannedperson.individual.age < minor_age && scannedperson.individual.first_name" horizontalAlignment="center" text="(Please check if accompanied by guardian)"/>
      <Label v-if="!scannedperson.individual.first_name" class="status-success" horizontalAlignment="center" text="SCANNED IN OFFLINE MODE"/>

      <Image v-if="scannedperson.individual.age >= minor_age && scannedperson.individual.photo_face" class="status-success" :src="photoSrc" height="200" width="200" stretch="aspectFit"/>
      <Image v-if="scannedperson.individual.age < minor_age && scannedperson.individual.photo_face" class="status-minor" :src="photoSrc" height="200" width="200" stretch="aspectFit"/>

      <Label class="qr" horizontalAlignment="center" :text="scannedperson.individual.qr_code"/>

      <Label
        v-if="visitorChecker && scannedperson.visit_reservation[0] == 'green'"
        class="visit-status-green"
        horizontalAlignment="center"
        :text="scannedperson.visit_reservation[1]"
      />
      <Label
        v-if="visitorChecker && scannedperson.visit_reservation[0] == 'red'"
        class="visit-status-red"
        horizontalAlignment="center"
        :text="scannedperson.visit_reservation[1]"
      />

      <StackLayout class="name" orientation="horizontal" horizontalAlignment="center" width="100%">
        <Label textWrap="true">
          <FormattedString>
            <Label v-if="scannedperson.individual.first_name" :text="scannedperson.individual.first_name + ' '"/>
            <Label v-if="scannedperson.individual.middle_name" :text="scannedperson.individual.middle_name + ' '"/>
            <Label v-if="scannedperson.individual.last_name" :text="scannedperson.individual.last_name"/>
          </FormattedString>
        </Label>
      </StackLayout>
      <StackLayout class="address" orientation="vertical" horizontalAlignment="center" width="100%">
        <StackLayout  v-if="scannedperson.individual.country" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="Country: "/>
          <Label class="info-content" :text="scannedperson.individual.country"/>
        </StackLayout>
        <StackLayout  v-if="scannedperson.individual.city" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="City: "/>
          <Label class="info-content" :text="scannedperson.individual.city"/>
        </StackLayout>
        <StackLayout  v-if="scannedperson.individual.barangay" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="Barangay: "/>
          <Label class="info-content" :text="scannedperson.individual.barangay"/>
        </StackLayout>
        <StackLayout  v-if="scannedperson.individual.address" orientation="horizontal" horizontalAlignment="center">
          <Label class="info-label" text="Address: "/>
          <Label class="info-content" :text="scannedperson.individual.address "/>
        </StackLayout>
        <StackLayout orientation="horizontal" horizontalAlignment="center">
          <!-- <Label class="info-label" text="Address: "/> -->
          <Label v-if="scannedperson.vaxxed" class="visit-status-green" text="Vaccinated"/>
          <Label v-else class="visit-status-red" text="Not Vaccinated"/>
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
    minor_age: 17,
    serverUrl: '',
    photo_face: '',
  }),
  mixins: [Globals],
  computed: {
    ...mapGetters('login', ['user']),
    ...mapGetters('scanned', ['scannedperson', 'code']),
    photoSrc() {
      const img = this.scannedperson.individual.photo_face
      if(img.includes('/')) {
        return this.serverUrl + img
      }
      else {
        return `${urls.SGP_PATH}${this.scannedperson.individual.id}/individual-uploaded-face/${img}`
      }
    },
    visitorChecker() {
      const roles = ['port', 'airport']
      return roles.includes(this.user.role)
    },
  },
  methods: {
    ...mapMutations('scanned', ['SET_CLOSE']),
    scanned () {
      for (let item in this.scannedperson.individual) {
        console.log(item+` ${this.scannedperson.individual[item]}`)
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
