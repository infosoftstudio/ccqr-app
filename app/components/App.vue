<template>
  <Navigator :defaultRoute="isLoggedIn ? '/dashboard' : '/login'"/>
</template>
<script>
	import {getString, setString} from "@nativescript/core/application-settings"
	export default {
		computed: {
			isLoggedIn() {
				return getString('user') ? true : false
			}
		}
	}
</script>
