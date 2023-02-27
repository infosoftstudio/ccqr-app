<template>
  <Page actionBarHidden="true" style="margin: 20px; padding: 20px;">
    <StackLayout>
      <Label v-if="countItem != maxItem">Uploading {{ countItem }} out of {{ maxItem }}</Label>
      <Progress v-if="countItem != maxItem" :value="countItem" :maxValue="maxItem"/>
      <Label v-if="countItem === maxItem"> Upload Successful! </Label>
    </StackLayout>
  </Page>
</template>

<script>
import {mapState, mapGetters, mapMutations } from 'vuex'
export default {
  computed: {
    ...mapGetters('scanned',  ['maxItem']),
    ...mapState('scanned',  ['countItem'])
  },
  methods: {
    ...mapMutations('scanned', ['SET_COUNT_ITEM', 'SET_MAX_ITEM'])
  },
  watch: {
    'countItem': {
      handler() {
        if (this.countItem === this.maxItem) {
          this.SET_MAX_ITEM(0)
          this.SET_COUNT_ITEM(0)
        }
      }
    }
  }
}
</script>
