<template>
    <div class="card">
        <div class="card-header" tabindex="0">Employment Background</div>
        <div class="card-body">
            <b-row>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="supervisedEstName"
                                   :v="$v.supervisedEstName"
                                   slug="supervisedEstName"
                                   label="Name of establishment where you were supervised"
                                   setId="supervisedEstName"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="12">
                    <BaseTextInput v-model="supervisedEstFullAddress"
                                   :v="$v.supervisedEstFullAddress"
                                   slug="supervisedEstFullAddress"
                                   label="Establishment Address"
                                   tip="Please include street address, city, state, postal code, and country"
                                   setId="supervisedEstFullAddress"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="4">
                    <BaseMaskedTextInput v-model="supervisedEstPhoneNumber"
                                   :v="$v.supervisedEstPhoneNumber"
                                   slug="supervisedEstPhoneNumber"
                                   label="Establishment Phone Number"
                                   setId="supervisedEstPhoneNumber"
                                   mask="(###)###-####"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="supervisedEstWebsite"
                                   :v="$v.supervisedEstWebsite"
                                   slug="supervisedEstWebsite"
                                   label="Establishment Website"
                                   setId="supervisedEstWebsite"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="supervisedEstHours"
                                   :v="$v.supervisedEstHours"
                                   slug="supervisedEstHours"
                                   label="Establishment Hours"
                                   setId="supervisedEstHours"
                    />
                </b-col>
            </b-row>
            <b-row v-for="(sup, index) in mnSupervisor" :key="sup.id">
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="sup.name"
                                   :v="$v.mnSupervisor.$each[index].name"
                                   slug="name"
                                   label="Name of Minnesota licensed supervisor"
                                   :key="index"
                                   :setId="'supName'+index"
                    />
                </b-col>
                <b-col cols="12" lg="4">
                    <BaseTextInput v-model="sup.licenseNbr"
                                   :v="$v.mnSupervisor.$each[index].licenseNbr"
                                   slug="licenseNbr"
                                   label="Supervisor's Minnesota license number"
                                   :key="index"
                                   :setId="'supLicNbr'+index"
                    />
                </b-col>
                <b-col cols="12" lg="4" class="d-flex align-items-center">
                    <button class="btn btn-secondary" @click="removeSupervisor(index)">
                        Remove Supervisor
                    </button>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <button class="btn btn-secondary" @click="addSupervisor">
                        Add Another Supervisor
                    </button>
                </b-col>
            </b-row>

            <b-row class="mt-3">
                <b-col>
                    List all body art work/employment you have had for the last five years. List the most current first. Include all body art work,
                    regardless of employment status.
                </b-col>
            </b-row>
            <div v-for="(employer, index) in employers" :key="employer.employerId">
                <b-row>
                    <b-col cols="12" lg="4">
                        <EmployerAutosuggestInput v-model="employer.name"
                                       :v="$v.employers.$each[index].name"
                                       slug="name"
                                       label="Employer/ Establishment Name"
                                       :key="index"
                                       v-on:employer="updateEmployer($event, index)"
                                       :setId="'name'+index"
                        />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseTextInput v-model="employer.streetAddress"
                                       :v="$v.employers.$each[index].streetAddress"
                                       slug="streetAddress"
                                       label="Street Address"
                                       :key="index"
                                       :setId="'streetAddress'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseTextInput v-model="employer.city"
                                       :v="$v.employers.$each[index].city"
                                       slug="city"
                                       label="City"
                                       :key="index"
                                       :setId="'city'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="2">
                        <BaseSelector v-model="employer.state"
                                      :v="$v.employers.$each[index].state"
                                      label="State"
                                      slug="state"
                                      :options=opts.stateOptions
                                      :key="index"
                                      :setId="'state'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="2">
                        <BaseMaskedTextInput v-model="employer.postalCode"
                                       :v="$v.employers.$each[index].postalCode"
                                       slug="postalCode"
                                       label="ZIP"
                                       :key="index"
                                       :setId="'postalCode'+index"
                                       mask="#####-####"
                        />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" lg="6">
                        <BaseMaskedTextInput v-model="employer.phone"
                                       :v="$v.employers.$each[index].phone"
                                       slug="phone"
                                       label="Phone"
                                       :key="index"
                                       :setId="'phone'+index"
                                       mask="(###)###-####"
                        />
                    </b-col>
                    <b-col cols="12" lg="6">
                        <BaseTextInput v-model="employer.emailAddress"
                                       :v="$v.employers.$each[index].emailAddress"
                                       slug="emailAddress"
                                       label="Email Address"
                                       :key="index"
                                       :setId="'emailAddress'+index"
                        />
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="12" lg="4">
                        <BaseDateInput v-model="employer.startDate"
                                       :v="$v.employers.$each[index].startDate"
                                       label="Start Date"
                                       slug="startDate"
                                       :key="index"
                                       :setId="'startDate'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="4">
                        <BaseDateInput v-model="employer.endDate"
                                       :v="$v.employers.$each[index].endDate"
                                       label="End Date"
                                       slug="endDate"
                                       :key="index"
                                       tip="If you are currently working at this location please leave the end date blank"
                                       :setId="'endDate'+index"
                        />
                    </b-col>
                    <b-col cols="12" lg="4" class="d-flex align-items-center">
                        <button class="btn btn-secondary" @click="removeEmployer(index)">
                            Remove Employer
                        </button>
                    </b-col>
                </b-row>
            </div>
            <b-row>
                <b-col>
                    <button class="btn btn-secondary" @click="addEmployer">
                        Add Another Employer
                    </button>
                </b-col>
            </b-row>
        </div>
    </div>

</template>
<script>
    import { commonOptions } from '@/mixins/commonOptions.js'
    import BaseTextInput from '@/components/templates/input/BaseTextInput.vue'
    import BaseSelector from '@/components/templates/input/BaseSelector.vue'
    import BaseDateInput from '@/components/templates/input/BaseDateInput.vue'
    import EmployerAutosuggestInput from '@/components/templates/input/EmployerAutosuggestInput.vue'
    import { required, email, url, minLength, maxLength } from 'vuelidate/lib/validators'
    import BaseMaskedTextInput from "../templates/input/BaseMaskedTextInput";

    export default {
        data() {
            return {
                //for form
                supervisedEstName: null,
                supervisedEstFullAddress: null,
                supervisedEstWebsite: null,
                supervisedEstHours: null,
                supervisedEstPhoneNumber: null,
                mnSupervisor: [{
                    id: null,
                    name: null,
                    licenseNbr: null
                }],
                employers: [{
                    employerId : null,
                    applicatonId: null,
                    name: null,
                    streetAddress: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    phone: null,
                    emailAddress: null,
                    startDate: null,
                    endDate: null
                }],
            }
        },
        components: {
            BaseTextInput,
            BaseMaskedTextInput,
            BaseSelector,
            BaseDateInput,
            EmployerAutosuggestInput
        },
        mixins: [
            commonOptions
        ],
        props: {
            technicianApplication: Object
        },
        validations() {
            return {
                supervisedEstName: { required },
                supervisedEstFullAddress: { required },
                supervisedEstWebsite: { required, url },
                supervisedEstHours: { required },
                supervisedEstPhoneNumber: { required, minLength: minLength(13) },
                mnSupervisor: {
                    required,
                    $each: {
                        name: { required },
                        licenseNbr: { required }
                    }
                },
                employers: {
                    required,
                    $each: {
                        employerId : { required: false },
                        applicatonId: { required: false },
                        name: { required },
                        streetAddress: { required },
                        city: { required },
                        state: { required },
                        postalCode: { required, maxLength: maxLength(10), minLength: minLength(5) },
                        phone: { required, minLength: minLength(13) },
                        emailAddress: { required, email },
                        startDate: { required },
                        endDate: { required:false }
                    }
                },
                form: ['supervisedEstName','supervisedEstFullAddress','supervisedEstWebsite','supervisedEstHours','supervisedEstPhoneNumber',
                'mnSupervisor','mnSupervisor','employers' ]
            }
        },
        methods: {
            addSupervisor: function () {
                this.mnSupervisor.push({
                    id: null,
                    name: null,
                    licenseNbr: null
                });
            },
            removeSupervisor: function (i) {
                this.$delete(this.mnSupervisor, i)
            },
            addEmployer: function () {
                this.employers.push({
                    employerId : null,
                    applicatonId: null,
                    name: null,
                    streetAddress: null,
                    city: null,
                    state: null,
                    postalCode: null,
                    phone: null,
                    emailAddress: null,
                    startDate: null,
                    endDate: null
                });
            },
            removeEmployer: function (i) {
                this.$delete(this.employers, i)
            },
            validate() {
                this.$v.form.$touch();
                var isValid = !this.$v.form.$invalid
                this.$emit('on-validate', this.$data, isValid)
                return isValid
            },
            updateEmployer(values, idx) {
                //set values
                this.employers[idx].name = values.name

                document.getElementById('name'+idx).value = values.name;
                document.getElementById('streetAddress'+idx).value = values.streetAddress;
                document.getElementById('city'+idx).value = values.city;
                document.getElementById('state'+idx).value = values.state;
                document.getElementById('postalCode'+idx).value = values.postalCode;
                document.getElementById('phone'+idx).value = values.phone;
                document.getElementById('emailAddress'+idx).value = values.emailAddress;
                document.getElementById('startDate'+idx).value = values.startDate;
                document.getElementById('endDate'+idx).value = values.endDate;

                //send change event
                document.getElementById('name'+idx).dispatchEvent(new Event('change'));
                document.getElementById('streetAddress'+idx).dispatchEvent(new Event('change'));
                document.getElementById('city'+idx).dispatchEvent(new Event('change'));
                document.getElementById('state'+idx).dispatchEvent(new Event('change'));
                document.getElementById('postalCode'+idx).dispatchEvent(new Event('change'));
                document.getElementById('phone'+idx).dispatchEvent(new Event('change'));
                document.getElementById('emailAddress'+idx).dispatchEvent(new Event('change'));
                document.getElementById('startDate'+idx).dispatchEvent(new Event('change'));
                document.getElementById('endDate'+idx).dispatchEvent(new Event('change'));
            },
        }
    }
</script>