<template>
    <div class="card">
        <div class="card-header" tabindex="0">Personal Information</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    Please fill in all applicable information.  Additional notes or corrections can be added in a notes section at the end of the wizard.
                </b-col>
            </b-row>

              <b-row>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="renewalApplication.lastName"
                                   :v="$v.renewalApplication.lastName"
                                   slug="lastName"
                                   label="Last Name"
                                   setId="applLastName"/>
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="renewalApplication.firstName"
                                   :v="$v.renewalApplication.firstName"
                                   slug="firstName"
                                   label="First Name"
                                   setId="applFirstName"/>
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="renewalApplication.middleName"
                                   :v="$v.renewalApplication.middleName"
                                   slug="middleName"
                                   label="Middle Name"
                                   setId="applMiddleName"/>
                </b-col>
            </b-row>
            <b-row v-for="(addr, index) in renewalApplication.homeAddress" :key="addr.id">
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="addr.streetAddress"
                                   :v="$v.renewalApplication.homeAddress.$each[index].streetAddress"
                                   slug="streetAddress"
                                   label="Home/Work Address"
                                   :setId="'applStreetAddress'+index"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="addr.city"
                                   :v="$v.renewalApplication.homeAddress.$each[index].city"
                                   slug="city"
                                   label="City"
                                   :setId="'applCity'+index"
                    />
                </b-col>
                <b-col cols="12" lg="2">
                    <BaseSelector v-model="addr.state"
                                  :v="$v.renewalApplication.homeAddress.$each[index].state"
                                  label="State"
                                  slug="state"
                                  :options=opts.stateOptions
                                  :setId="'applState'+index"
                    />
                </b-col>
                <b-col cols="12" lg="2">
                    <BaseMaskedTextInput v-model="addr.postalCode"
                                         :v="$v.renewalApplication.homeAddress.$each[index].postalCode"
                                         slug="postalCode"
                                         label="ZIP"
                                         :setId="'applZip'+index"
                                         mask="#####-####"
                    />
                </b-col>
                <b-col cols="12" lg="2">
                    <BaseCheckboxInput v-model="addr.preferred"
                                       :v="$v.renewalApplication.homeAddress.$each[index].preferred"
                                       label="Preferred address for contact"
                                       slug="preferred"
                                       :setId="'applPreferred'+index"
                    />
                </b-col>
                <b-col cols="12" lg="3" class="d-flex align-items-center">
                    <button class="btn btn-secondary" @click="removeAddress(index)">
                        Remove Address
                    </button>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <button class="btn btn-secondary" @click="addAddress">
                        Add Another Address
                    </button>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="renewalApplication.personalPhone"
                                   :v="$v.renewalApplication.personalPhone"
                                   slug="personalPhone"
                                   label="Home Phone Number"
                                   setId="personalPhone"/>
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="renewalApplication.workPhone"
                                   :v="$v.renewalApplication.workPhone"
                                   slug="workPhone"
                                   label="Work Phone Number"
                                   setId="workPhone"/>
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="renewalApplication.mobilePhone"
                                   :v="$v.renewalApplication.mobilePhone"
                                   slug="mobilePhone"
                                   label="Mobile Phone Number"
                                   setId="mobilePhone"/>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="12">
                    <BaseTextInput v-model="renewalApplication.emailAddress"
                                   :v="$v.renewalApplication.emailAddress"
                                   slug="emailAddress"
                                   label="Email Address"
                                   setId="applEmailAddress"/>
                </b-col>
            </b-row>

        </div>

    </div>

</template>
<script>
import { required, requiredIf, email, maxLength, minLength } from 'vuelidate/lib/validators'
import { commonOptions } from '@/mixins/commonOptions.js'


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
                    homeAddress: [{
                        id:null,
                        streetAddress: null,
                        city: null,
                        state: null,
                        postalCode: null,
                        addressType: 'H',
                        preferred: false,
                        applicationId: null
                    }]
                }
            }
        }
    },

    mixins: [
        commonOptions
    ],
    
    validations() {
        return {
            renewalApplication: {
                lastName: { required },
                firstName: { required },
                middleName: { required: false },
                homeAddress: {
                    required: true,
                    $each: {
                        streetAddress: { required },
                        city: { required },
                        state: { required },
                        postalCode: { required, maxLength: maxLength(10), minLength: minLength(5) },
                        addressType: { required },
                        preferred: { checked: value => this.renewalApplication.homeAddress.filter(a => a.preferred === true).length === 1 },
                        id: { required: false },
                        applicationId: { required: false },
                    }
                },
                personalPhone: { required },
                workPhone: { required },
                mobilePhone: { required },
                emailAddress: { required, email },
             },
            form: [ 'renewalApplication' ]
        }            
    },

    methods: {
        validate() {
            this.$v.form.$touch();
            var isValid = !this.$v.form.$invalid            
            this.$emit('on-validate', this.$data.renewalApplication, isValid)
            return isValid
        },
        addAddress: function () {
            this.renewalApplication.homeAddress.push({
                id:null,
                streetAddress: null,
                city: null,
                state: null,
                postalCode: null,
                addressType: 'H',
                preferred: false,
                applicationId: null
            });
        },
        removeAddress: function (i) {
            this.$delete(this.renewalApplication.homeAddress, i)
        },
    }
}
</script>