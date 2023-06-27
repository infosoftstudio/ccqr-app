<template>
  <Page actionBarHidden="true" style="margin-top: 95px;">
    <DockLayout stretchLastChild="true">
      <Button dock="bottom" height="50" class="round-btn" text="Close" @tap="$modal.close"/>
      <!-- <Label dock="top" class="info-label" :text="qr_link"/> -->
      <WebView dock="top" :src="qr_link" />
    </DockLayout>
  </Page>
</template>
<script>
import { mapGetters } from 'vuex'
import Globals from '~/mixins/globals'
export default {
  props: ['qr_link'],
  data: () => ({
  }),
  mixins: [Globals],
  computed: {
      ...mapGetters('scanned', ['scannedperson', 'code']) //, 'code'
  },
  methods: {
    closed () {
      this.$navigator.navigate('/dashboard')
    }
  }
}
</script>