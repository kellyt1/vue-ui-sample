<template>
    <div class="card">
        <div class="card-header" tabindex="0">Confirm</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <form-summary :validator="$v.screen" ref="errorContainer" id="errorContainer"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                     <b-table-simple hover small responsive>
                        <b-thead head-variant="dark">
                            <b-tr>
                                <b-th>Fee Description</b-th>
                                <b-th>Fee Amount</b-th>
                            </b-tr>
                        </b-thead>
                        <b-tbody>
                            <b-tr>
                                <b-td>License Renewal Fee</b-td>
                                <b-td>{{renewalApplication.renewalFee}}</b-td>
                            </b-tr>
                            <b-tr v-if="chargeLateFee">
                                <b-td>Late Fee</b-td>
                                <b-td>{{renewalApplication.lateFee}}</b-td>
                            </b-tr>
                        </b-tbody>
                    </b-table-simple>
               
                </b-col>
            </b-row>

        </div>

       
    </div>

</template>
<script>
import { required, requiredIf, email, minLength } from 'vuelidate/lib/validators'
import { commonOptions } from '@/mixins/commonOptions.js'
import moment from 'moment'

export default {
    data: () => {
        return {    
        }
    },
    
    props: {
        renewalApplication: {
            type: Object,
            default () {
                return {
                    homeAddress: { 
                    }
                }
            }
        }
    },

    mixins: [
        commonOptions
    ],

    computed: {
        chargeLateFee() {
            console.log(">>>>>>>>>>>>>> " + this.renewalApplication.lateFeeEffectiveDate)
            return moment().isAfter(this.renewalApplication.lateFeeEffectiveDate)
        }
    },
    
    validations() {
        return {
        }            
    },

    methods: {
        validate() {
            var isValid = true            
            this.$emit('on-validate', this.$dataS, isValid)
            return isValid
        }
    }
}
</script>