<template>
  <Page actionBarHidden="true">
    <WrapLayout>
      <MDCardView elevation="5" width="100%">
        <!-- <SearchBar width="100%" :text="searchPhrase" @textChange="onTextChanged" @submit="onSubmit" /> -->
        <SearchBar v-model="searchQuery" @loaded="nofocus($event)" @submit="search()" @clear="x()"/>
      </MDCardView>
      <MDCardView height="50%">
        <ScrollView orientation="vertical" @scroll="onScroll">
          <StackLayout orientation="vertical">
            <MDCardView elevation="10" width="97%" height="100%" class="log-margins" v-for="(item, index) in items" :key="index">
              <Label textWrap="true">
                <FormattedString>
                  <Span :text="`id ${item.id}` " />
                  <Span :text="`type ${item.type}` " />
                  <Span :text="`first name ${item.individuals.first_name}` "/>
                  <Span :text="`last name ${item.individuals.last_name}` "/>
                  <Span :text="`QR CODE ${item.individuals.qr_code}` "/>
                </FormattedString>
              </Label>
            </MDCardView>
          </StackLayout>
        </ScrollView>
      </MDCardView>
    </WrapLayout>
  </Page>
</template>

<script>
  import { mapGetters } from 'vuex'
  import {
    SEARCH_LOGS
  } from '../../queries/logs'
  import {isAndroid} from "@nativescript/core/platform";

  export default {
    computed: {
      ...mapGetters('login', ['user']),
      ...mapGetters('scanned', ['scannedperson', 'code']) //, 'code'
    },
    data: () => ({
      searchQuery: '',
      items: [],
      customSkip: 0
    }),
    mounted () {
      this.getLogs()
    },
    methods: {
      scanned () {
        console.log(this.scannedperson)
      },
      nofocus (args) {
        let searchbar = args.object;
        if(isAndroid){
            searchbar.android.clearFocus();
        }
      },
      x () {
         this.searchQuery = ''
         this.search()
      },
      search () {
        this.customSkip = 0
        this.getLogs()
      },
      getLogs () {
        let params = {
          establishment_id: this.user.establishment ? this._.toString(this.user.establishment.id) : null,
          take: 20,
          skip: this.customSkip
        }
        if (!this._.isEmpty(this.searchQuery)) {
          this.$set(params, 'individual_name', this.searchQuery)
        } else {
          console.log('emt')
          delete params.individual_name
        }
        let query = SEARCH_LOGS
        this.$apollo.query({
          query: query,
          variables: params,
          fetchPolicy: 'no-cache'
        }).then(data => {
          if (this.customSkip > 0) {
            for (let item of data.data.search_logs) {
              this.items.push(item)
            }
          } else {
            this.items = data.data.search_logs
          }
        })
      },
      onScroll (args) {
        const scrollView = args.object;
        console.log(`scrollY: ${scrollView.verticalOffset}`);
        console.log(`scroll height: ${scrollView.scrollableHeight}`);
        if (scrollView.verticalOffset >= scrollView.scrollableHeight) {
          setTimeout(()=>{
            scrollView.scrollToVerticalOffset(scrollView.verticalOffset - 20, true)
            this.customSkip += 20
            this.getLogs()
          }, 500)
        } 
      }
    }
  }
</script>
