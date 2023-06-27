<template>
	<Page
		xmlns:ui="nativescript-image-zoom"
		actionBarHidden="true"
		class="success"
		style="margin-top: 95px;"
	>
		<DockLayout stretchLastChild="true">
			<Button dock="bottom" height="50" class="round-btn" text="Close" @tap="closeButtonPressed()"/>
			<StackLayout dock="top" class="name " horizontalAlignment="center" width="100%">
				<TextField :text="textFieldValue" hint="Enter text..." />
                <TextField :text="textFieldValue" hint="Enter text..." />
                <TextField :text="textFieldValue" hint="Enter text..." />
			</StackLayout>
			<!-- <Button dock="bottom" height="50" class="view-vax-pic" text="Close" @tap="$modal.close"/> -->
		</DockLayout>
	</Page>
</template>
<script>
import Globals from '~/mixins/globals'
export default {
	mixins: [Globals],
	data:() => ({
		textFieldValue: '',
	}),
    methods: {
        closeButtonPressed () {
            this.$navigator.navigate("/settings", { clearHistory: true });
        },
    }
}
</script>
