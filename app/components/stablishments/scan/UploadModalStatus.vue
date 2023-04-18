<template>
  <Page actionBarHidden="true" style="margin: 20px; padding: 20px;">
    <StackLayout>
      <!-- <Label v-if="countItem != maxItem">Uploading {{ countItem }} out of {{ maxItem }}</Label>
      <Progress v-if="countItem != maxItem" :value="countItem" :maxValue="maxItem"/>
      <Label v-if="countItem === maxItem"> Upload Successful! </Label> -->
      <Label v-if="uploading_status === 'uploading'">Uploading {{ maxItem }} offline scanned individuals ...</Label>
      <Label v-else-if="uploading_status === 'success'"> Upload Successful! </Label>
      <Label v-else-if="uploading_status === 'failed'"> Upload failed. </Label>
    </StackLayout>
  </Page>
</template>

<script>
import {mapState, mapGetters, mapMutations, mapActions } from 'vuex'
export default {
  data() {
    return {
      uploading_status: 'uploading',
    }
  },
  computed: {
    ...mapGetters('scanned',  ['maxItem']),
    ...mapGetters('connection',  ['offlineScans']),
    ...mapState('scanned',  ['countItem'])
  },
  methods: {
    ...mapMutations('scanned', ['SET_COUNT_ITEM', 'SET_MAX_ITEM']),
    ...mapMutations('connection', ['REMOVE_OFFLINE_SCANS']),
    ...mapActions('scanned', ['BULK_LOG_OFFLINE_SCANS']),
    uploadOfflineScans() {
      // const offlineScans = JSON.parse(this.offlineScans)
      this.uploading_status = 'uploading'
      this.BULK_LOG_OFFLINE_SCANS(this.offlineScans)
      .then(response => {
        console.log(1)
        this.uploading_status = 'success'
        this.REMOVE_OFFLINE_SCANS()
      })
      .catch(response => {
        console.log(2)
        this.uploading_status = 'failed'
      })
      console.log(3)
    },
  },
  watch: {
    'countItem': {
      handler() {
        console.log('LOG_SCANNED : countItem - outside', {countItem: this.countItem, maxItem: this.maxValue})
        if (this.countItem === this.maxItem) {
          console.log('LOG_SCANNED : countItem - inside', {countItem: this.countItem, maxItem: this.maxValue})
          this.SET_MAX_ITEM(0)
          this.SET_COUNT_ITEM(0)
        }
      }
    }
  },
  created() {
    setTimeout(() => this.uploadOfflineScans(), 50)
  }
}
</script>
