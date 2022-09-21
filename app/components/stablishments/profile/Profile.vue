<template>
<Page actionBarHidden="true" @loaded="pasmo">
    <Label text="profile"></Label>
  </Page>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    computed: {
      ...mapGetters('login', ['user'])
    },
    methods: {
      pasmo () {
        console.log(this.user)
      }
    }
  }
</script>
