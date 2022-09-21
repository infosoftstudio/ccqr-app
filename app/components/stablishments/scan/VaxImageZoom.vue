<template>
	<Page
		xmlns:ui="nativescript-image-zoom"
		actionBarHidden="true"
		class="success"
		style="margin-top: 95px;"
	>
		<DockLayout stretchLastChild="true">
			<Button dock="bottom" height="50" class="round-btn" text="Close" @tap="$modal.close"/>
			<StackLayout dock="top" class="name " horizontalAlignment="center" width="100%">
				<ImageZoom :src="image" maxZoom="5" minZoom="1"></ImageZoom>
			</StackLayout>
			<!-- <Button dock="bottom" height="50" class="view-vax-pic" text="Close" @tap="$modal.close"/> -->
		</DockLayout>
	</Page>
</template>
<script>
import Globals from '~/mixins/globals'
export default {
	mixins: [Globals],
	props: ['image'],
	/*data:() => ({
		image: 'https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=681&h=383&crop=1',
	}),*/
}
</script>