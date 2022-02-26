<template>
    <Page>
        <ActionBar>
            <Label text="Home"/>
        </ActionBar>

        <GridLayout>
            <Label class="info">
                <FormattedString>
                    <Span class="fas" text.decode="&#xf135; "/>
                    <Span :text="message"/>
                    <!-- <Span class="fas pl2" text.decode="&#xf135; "/> -->
                </FormattedString>
            </Label>
            <StackLayout>
              <Button text="Button" @tap="testFetch" />
            </StackLayout>
        </GridLayout>
    </Page>
</template>

<script>
  import { mapActions, mapMutations, mapGetters } from 'vuex'
  export default {
    computed: {
      message() {
        return "Blank {N}-Vue app";
      }
    },
    methods: {
      ...mapActions('user', ['REGISTER_USER']),
      register() {
        this.REGISTER_USER()
        .then(response => {
          console.log(response)
        })
        .catch(data => {
          console.log(data)
        })
      }
    },
    created() {
        console.log('hellooooooooooo')
    }
  };
</script>
