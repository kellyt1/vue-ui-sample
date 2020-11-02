<template>
    <div class="card">
        <div class="card-header" tabindex="0">Introduction</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    This page contains data privacy info, allows the user to enter the start of a renewal if no 
                    param is provided.  If a param is provided, retrieve the information for the current license and 
                    pre-populate the renewal application.
                </b-col>
            </b-row>
        </div>    
    </div>

</template>
<script>
import axios from "axios"

export default {
    data: () => {
        return {
            token: '',
            renewalApplication: {},
            renewalApplicationCreated: false,
        }
    },
    validations() {
        return {
            renewalApplicationCreated: { checked: value => value === true },
            form: [ 'renewalApplicationCreated' ]
        }            
    },
    created() {
        this.token = this.$route.params.token;
        if (this.token) {
            this.createRenewalApplicationFromToken(this.token)
        }
    },
    methods: {
        createRenewalApplicationFromToken(token) {
            this.renewalApplicationCreated = false
            axios.get(`${process.env.VUE_APP_API_BASE_URL}/renewal/token/${token}`, { ignoreHeader: true })
                .then(response => { 
                    // TODO - check for the various states here 
                    // token retrieved a new renewal application - continue
                    // token was invalid 
                    // token could not be parsed
                    // renewal application already submitted and waiting for processing
                    this.renewalApplication = response.data 
                    this.renewalApplicationCreated = true
                    console.log(this.renewalApplication)
                })   
                .catch(err => { console.log("ERROR: " + err) })           
        },

        validate() {
            this.$v.form.$touch();
            var isValid = !this.$v.form.$invalid
            console.log('-xxx-')
            console.log(this.$data.renewalApplication)
            console.log('-zzz-')
            this.$emit('on-validate', this.$data.renewalApplication, isValid)
            return isValid
        }
    }
}
</script>