<template>
  <Page actionBarHidden="true" class="success">
    <BarcodeScanner
          row="1"
          height="300"
          formats="QR_CODE, EAN_13, UPC_A"
          beepOnScan="true"
          reportDuplicates="true"
          preferFrontCamera="false"
          @scanResult="onScanResult"
          v-if="isIOS">
      </BarcodeScanner>
  </Page>
</template>

<script>
import {isIOS} from "@nativescript/core";
import {BarcodeScanner} from "nativescript-barcodescanner";
import { mapActions, mapGetters, mapMutations } from 'vuex'
import Globals from '../../../mixins/globals'

import ScannedPerson from './ScannedPerson'

import moment from 'moment'
export default {
  data: () => ({
    isConnected: false
  }),
  mixins: [Globals],
  computed: {
    ...mapGetters('scanned', ['scannedperson', 'code', 'tap']), //, 'code'
    ...mapGetters('connection', ['hasConnection'])
  },
  mounted () {
    this.scan(this.tap.front, this.tap.flip, this.tap.params)
  },
  watch: {
    'hasConnection': {
      handler () {
        this.isConnected = this.hasConnection
      },
      deep: true
    }
  },
  methods: {
    ...mapMutations('scanned', [
        'SET_SCANNED_PERSON'
    ]),
    ...mapActions('scanned', [
        'GET_CODE'
    ]),
    ...mapMutations('connection', [
      'SET_ADDITIONAL_NO_CONNECTION_QR'
    ]),
    scan(preferFrontCamera, showFlipCameraButton, params) {
      new BarcodeScanner().scan({
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
              console.log("Scanner closed @ " + new Date().getTime());
          }
      }).then(data => {
          setTimeout(() => {
              if (this.isConnected === true) {
                  this.GET_CODE({qr: data.text, type: params})
                      .then(response => {
                          this.SET_SCANNED_PERSON(null)
                          this.SET_SCANNED_PERSON(response)
                          this.$showModal(ScannedPerson)
                          response.individual.age < 18 && this.errorSound()
                      })
                      .catch(response => {
                          //console.log('potaena'+response.data)
                          this.snackBar("facescan", response.data, 'Qr code does not exist!')
                      })
                  
              } else {
                  this.SET_ADDITIONAL_NO_CONNECTION_QR({qr: data.text, type: params, time_scanned: moment().format()})
                  this.SET_SCANNED_PERSON(null)
                  this.SET_SCANNED_PERSON({
                      individual: {
                          qr_code: data.text
                      }
                  })
                  this.$showModal(ScannedPerson)
              }
              this.scan(this.tap.front, this.tap.flip, this.tap.params)
          }, 100)
      })
    },
  }
}
</script>
