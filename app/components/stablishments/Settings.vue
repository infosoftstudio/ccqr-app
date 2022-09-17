<template>
<Page actionBarHidden="true">
    <ListView for="(item, index) in listItems" :key="index" @itemTap="onItemTap">
      <v-template>
        <Label :text="item.text" />
      </v-template>
    </ListView>
    <!-- <Button text="Button" @tap="logout" /> -->
  </Page>
</template>

<script>
import { mapMutations } from 'vuex'
import {
    clear
} from '@nativescript/core/application-settings';
import Globals from '../../mixins/globals'
export default {
    data: () => ({
        isEditing: true,
        listItems: [
            {text: 'Profile', route: '/profile'},
            {text: 'Security', route: '/security'},
            {text: 'Logout', route: '/login'}
        ]
    }),
    methods: {
        ...mapMutations('login', ['RESET_LOGIN_STATE']),
        ...mapMutations('scanned', ['RESET_SCANNED_STATE']),
        onItemTap (payload) {
            console.log(payload.item)
            if (payload.item.text === 'Profile') {
                this.$navigator.navigate(payload.item.route)
            } else if (payload.item.text === 'Securiry') {
                this.$navigator.navigate(payload.item.route)
            } else if (payload.item.text === 'Logout') {
                this.logout(payload.item.route)
            }
        }
    }
  }
</script>

<style>
  .margin-20px {
    margin: 20px;
  },
  .log-margins {
    margin-left: 20px;
    margin-right: 20px;
    margin-top:5px;
    margin-bottom: 5px;
  }
</style>
