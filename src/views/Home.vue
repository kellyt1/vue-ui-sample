<template>
    <div class="home">
        <b-container fluid>
            <h1>{{$keycloak.fullName}}'s Dashboard</h1>

            <b-button variant="primary" to="application">New Application</b-button>

            <b-row v-if="licenses.length > 0">
                <b-col>
                    <h2 style="color: #78BE21">Your Licenses</h2>
                    <TableList slug="licenses" :items="licenses"/>
                </b-col>
            </b-row>
            
        </b-container>

    </div>
</template>

<script>
import TableList from '@/components/templates/TableList'
import axios from 'axios'

export default {
  components: {
    TableList,
  },
  data: () => ({
    licenses: [],
  }),
  
  created() {  
    //this.$store.dispatch('loadUserRole')
  },

  computed: {
    userRole() {
      return this.$store.state.userRole
    }
  },

  mounted() {
    if (this.$keycloak) {
        this.loadLicenses()
    }
  },

  methods: {
      loadLicenses() {
        axios.get(`${process.env.VUE_APP_API_BASE_URL}/license/user`)
          .then(response => { 
            this.licenses = response.data 
            console.log(this.licenses)
          })
    },

  }
}
</script>

<style>

</style>