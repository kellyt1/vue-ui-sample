<template>
    <div class="card">
        <div class="card-header" tabindex="0">Payment and Contact Information</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <h2>Application Fee Schedule</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    Please note that the fee for your initial body art technician license changes based on the month that you apply for your
                    license.  Fees may be paid via the <a href="">epayment portal</a> or may be mailed to the address below.
                </b-col>
            </b-row>
            <b-row class="mt-3">
               <b-col cols="12" lg="1"  v-for="fee in feeMonths()" :key="fee.month">
                   <strong>{{fee.month}}</strong>
                   <br/>
                   ${{fee.fee}}
               </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col>
                    <h2>Mail/Courier Drop-off</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="6">
                    <div>Mail:</div>
                    <div>Minnesota Department of Health</div>
                    <div>Health Occupations Program</div>
                    <div>P.O. Box 64882</div>
                    <div>St. Paul, MN 55164-0882</div>
                </b-col>
                <b-col cols="12" lg="6">
                    <div>Courier Drop-off Delivery:</div>
                    <div>Minnesota Department of Health</div>
                    <div>Health Occupations Program</div>
                    <div>St. Paul, MN 5510</div>
                </b-col>
            </b-row>
            <b-row class="mt-3">
                <b-col>
                    <h2>Contact Information</h2>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <div>Minnesota Department of Health</div>
                    <div>Health Occupations Program</div>
                    <div>Attn: Body Art</div>
                    <div>PO Box 64882</div>
                    <div>Saint Paul, MN 55164-0882</div>

                    <div class="mt-2"><a href="mailto:Health.BA@state.mn.us">Health.BA@state.mn.us</a></div>
                    <div><a href="www.health.state.mn.us">www.health.state.mn.us</a></div>
                </b-col>
            </b-row>
        </div>
    </div>

</template>
<script>
    import { feeMonths } from "@/mixins/constants.js";

    export default {
        data: () => {
            return {
                signature: null,
                dateSigned: new Date().toISOString().slice(0,10)
            }
        },
        validations() {
            return {}
        },
        methods: {
            feeMonths: function() {
                return feeMonths
            },
            validate() {
                // this.$v.form.$touch();
                // var isValid = !this.$v.form.$invalid
                // this.$emit('on-validate', this.$data, isValid)
                // return isValid
                return true;
            }
        }
    }
</script>