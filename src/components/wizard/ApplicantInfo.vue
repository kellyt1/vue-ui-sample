<template>
    <div class="card">
        <div class="card-header" tabindex="0">Applicant Information</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <BaseTextOutput label="Initial Technician Application"/>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="6">
                    <BaseSelector v-model="license.licenseType"
                                  :v="$v.license.licenseType"
                                  label="License Type"
                                  slug="licenseType"
                                  :options=opts.licenseTypeOptions
                                  setId="licenseType"
                    />
                </b-col>
                <b-col cols="12" lg="6">
                    <BaseSelector v-model="applyMethod"
                                  :v="$v.applyMethod"
                                  label="Applying By"
                                  slug="applyMethod"
                                  :options=opts.applyMethodOptions
                                  tip="States approved for reciprocity: Oregon, New Mexico, Oklahoma and Missouri"
                                  setId="applyMethod"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    Please designate the address to receive correspondence from the Department regarding your license.
                    The address you provide will be public information.
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="lastName"
                                   :v="$v.lastName"
                                   slug="lastName"
                                   label="Last Name"
                                   setId="applLastName"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="firstName"
                                   :v="$v.firstName"
                                   slug="firstName"
                                   label="First Name"
                                   setId="applFirstName"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="middleName"
                                   :v="$v.middleName"
                                   slug="middleName"
                                   label="Middle Name"
                                   setId="applMiddleName"
                    />
                </b-col>
            </b-row>
            <b-row v-for="(addr, index) in address" :key="addr.id">
                <b-col cols="6" lg="4">
                    <BaseSelector v-model="addr.addressType"
                                  :v="$v.address.$each[index].addressType"
                                  label="Address Type"
                                  slug="addressType"
                                  :options=opts.addressTypeOptions
                                  :setId="'addressType'+index"
                    />
                </b-col>
                <b-col cols="6" lg="2">
                    <BaseCheckboxInput v-model="addr.preferred"
                                    :v="$v.address.$each[index].preferred"
                                    label="Preferred address for contact"
                                    slug="preferred"
                                    :setId="'applPreferred'+index"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="addr.streetAddress"
                                   :v="$v.address.$each[index].streetAddress"
                                   slug="streetAddress"
                                   label="Home/Work Address"
                                   :setId="'applStreetAddress'+index"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="addr.city"
                                   :v="$v.address.$each[index].city"
                                   slug="city"
                                   label="City"
                                   :setId="'applCity'+index"
                    />
                </b-col>
                <b-col cols="12" lg="2">
                    <BaseSelector v-model="addr.state"
                                  :v="$v.address.$each[index].state"
                                  label="State"
                                  slug="state"
                                  :options=opts.stateOptions
                                  :setId="'applState'+index"
                    />
                </b-col>
                <b-col cols="12" lg="2">
                    <BaseMaskedTextInput v-model="addr.postalCode"
                                         :v="$v.address.$each[index].postalCode"
                                         slug="postalCode"
                                         label="ZIP"
                                         :setId="'applZip'+index"
                                         mask="#####-####"
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
                    <BaseMaskedTextInput v-model="personalPhone"
                                   :v="$v.personalPhone"
                                   slug="personalPhone"
                                   label="Home/Cell Phone"
                                   setId="personalPhone"
                                   mask="(###)###-####"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseMaskedTextInput v-model="workPhone"
                                   :v="$v.workPhone"
                                   slug="workPhone"
                                   label="Work Phone"
                                   setId="workPhone"
                                   mask="(###)###-####"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="emailAddress"
                                   :v="$v.emailAddress"
                                   slug="emailAddress"
                                   label="Email Address"
                                   setId="applEmailAddress"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="6">
                    <BaseMaskedTextInput v-model="license.socialSecurityNumber"
                                   :v="$v.license.socialSecurityNumber"
                                   slug="socialSecurityNumber"
                                   label="Social Security Number"
                                   tip="Required by Minnesota Statute. 270C.72, subdivision 4"
                                   setId="ssn"
                                   mask="###-##-####"
                    />
                </b-col>
                <b-col cols="12" lg="6">
                    <BaseDateInput v-model="license.dateOfBirth"
                                   :v="$v.license.dateOfBirth"
                                   label="Date of Birth"
                                   slug="dateOfBirth"
                                   setId="dob"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="6">
                    <BaseRadioInput v-model="otherName"
                                    :v="$v.otherName"
                                    label="Have you ever used another name (including maiden name) under which records may be filed concerning your application, including your education, training or experience?"
                                    slug="otherName"
                                    :options=opts.yesNoOptions
                    />
                </b-col>
            </b-row>
            <div v-if="otherName === 'Y'">
                <b-row v-for="(name, index) in otherNames" :key="name.id">
                    <b-col cols="12" lg="3">
                        <BaseTextInput v-model="name.lastName"
                                       :v="$v.otherNames.$each[index].lastName"
                                       slug="lastName"
                                       label="Last Name"
                                       :key="index"
                                       :setId="'othLastName'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="3">
                        <BaseTextInput v-model="name.firstName"
                                       :v="$v.otherNames.$each[index].firstName"
                                       slug="firstName"
                                       label="First Name"
                                       :key="index"
                                       :setId="'othFirstName'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="3">
                        <BaseTextInput v-model="name.middleName"
                                       :v="$v.otherNames.$each[index].middleName"
                                       slug="middleName"
                                       label="Middle Name"
                                       :key="index"
                                       :setId="'othMiddleName'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="3" class="d-flex align-items-center">
                        <button class="btn btn-secondary" @click="removeName(index)">
                            Remove Name
                        </button>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <button class="btn btn-secondary" @click="addName">
                            Add Another Name
                        </button>
                    </b-col>
                </b-row>
            </div>
        </div>
    </div>

</template>
<script>
    import { commonOptions } from '@/mixins/commonOptions.js'
    import BaseTextInput from '@/components/templates/input/BaseTextInput.vue'
    import BaseMaskedTextInput from '@/components/templates/input/BaseMaskedTextInput.vue'
    import BaseSelector from '@/components/templates/input/BaseSelector.vue'
    import BaseDateInput from '@/components/templates/input/BaseDateInput.vue'
    import BaseRadioInput from '@/components/templates/input/BaseRadioInput.vue'
    import BaseCheckboxInput from '@/components/templates/input/BaseCheckboxInput.vue'
    import { required, requiredIf, email, minLength, maxLength } from 'vuelidate/lib/validators'
    import BaseTextOutput from "../templates/input/BaseTextOutput";

    export default {
        data: () => {
            return {
                opts: {
                    licenseTypeOptions: [
                        { value: 'T', text: 'Tattooist' },
                        { value: 'P', text: 'Piercer' },
                        { value: 'D', text: 'Dual'},
                    ],
                    applyMethodOptions: [
                        { value: 'S', text: 'Supervision' },
                        { value: 'R', text: 'Reciprocity' },
                    ],
                    addressTypeOptions: [
                        { value: 'H', text: 'Home' },
                        { value: 'E', text: 'Employer' },
                    ],
                },
                //for form
                applicationType: 'I',
                applyMethod: null,
                lastName: null,
                firstName: null,
                middleName: null,
                address: [{
                    id:null,
                    streetAddress: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    addressType: null,
                    preferred: false,
                    applicationId: null
                }],
                personalPhone: null,
                workPhone: null,
                emailAddress: null,
                license: {
                    licenseId: null,
                    licenseType: null,
                    status: null,
                    effectiveDate: null,
                    expirationDate: null,
                    dateOfBirth: null,
                    socialSecurityNumber: null,
                    licenseNbr: null,
                },
                otherName: null,
                otherNames: [{
                    applicationId: null,
                    id: null,
                    firstName: null,
                    middleName: null,
                    lastName: null
                }]
            }
        },
        components: {
            BaseTextOutput,
            BaseTextInput,
            BaseSelector,
            BaseDateInput,
            BaseRadioInput,
            BaseCheckboxInput,
            BaseMaskedTextInput
        },
        mixins: [
            commonOptions
        ],
        validations() {
            return {
                applicationType:{ required },
                applyMethod: { required },
                lastName: { required },
                firstName: { required },
                middleName: { required: false },
                address: {
                    required: true,
                    $each: {
                        streetAddress: { required },
                        city: { required },
                        state: { required },
                        postalCode: { required, maxLength: maxLength(10), minLength: minLength(5) },
                        addressType: { required },
                        preferred: { checked: value => this.address.filter(a => a.preferred === true).length === 1 },
                        id: { required: false },
                        applicationId: { required: false },
                    }
                },
                personalPhone: { required, minLength: minLength(13) },
                workPhone: { required, minLength: minLength(13) },
                emailAddress: { required, email },
                license: {
                    licenseId: { required: false },
                    licenseType: { required },
                    status: { required: false },
                    effectiveDate: { required: false },
                    expirationDate: { required: false },
                    dateOfBirth: { required },
                    socialSecurityNumber: { required, minLength: minLength(11) },
                    licenseNbr: { required: false },
                },
                otherName: { required },
                otherNames: {
                    required: requiredIf(function() { return this.otherName === 'Y' }),
                    $each: {
                        firstName: { required: requiredIf(function() { return this.otherName === 'Y' }) },
                        middleName: { required: false },
                        lastName: { required: requiredIf(function() { return this.otherName === 'Y' }) }
                    }
                },
                form: [ 'applicationType','applyMethod','license.licenseType','lastName','firstName','middleName',
                'address','personalPhone','workPhone','emailAddress','license.socialSecurityNumber',
                'license.dateOfBirth','otherName','otherNames' ]
            }
        },
        methods: {
            addName: function () {
                this.otherNames.push({
                    lastName: null ,
                    firstName: null ,
                    middleName: null
                });
            },
            removeName: function (i) {
                this.$delete(this.otherNames, i)
            },
            addAddress: function () {
                this.address.push({
                    id:null,
                    streetAddress: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    addressType: null,
                    preferred: false,
                    applicationId: null
                });
            },
            removeAddress: function (i) {
                this.$delete(this.address, i)
            },
            validate() {
                this.$v.form.$touch();
                var isValid = !this.$v.form.$invalid
                this.$emit('on-validate', this.$data, isValid)
                return isValid
            }
        }
    }
</script>
