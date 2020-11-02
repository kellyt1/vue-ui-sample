<template>
    <div class="card">
        <div class="card-header" tabindex="0">Credential Issued by other Jurisdictions</div>
        <div class="card-body">
            <b-row>
                <b-col>
                                        <form-summary :validator="$v.screen" ref="errorContainer" id="errorContainer"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <BaseRadioInput v-model="screen.issuedOtherLicense"
                                        :v="$v.screen.issuedOtherLicense"
                                        label="In the past two years, have you been issued a license, certification, or registration as a body art technician issued by a city, county, or other state?"
                                        :options=opts.yesNoOptions
                                        slug="response"
                                        />                
                </b-col>
            </b-row>

            <b-row v-if="screen.issuedOtherLicense === 'Y'">
                <b-col cols="12" lg="12">
                    <p>
                        If yes, please identify the jurisdiction(s), the current status, the date(s) of issuance and any 
                        identification number(s) used in relation to your permit, license or other credential.
                    </p>
                </b-col>
            </b-row>

            <div v-if="screen.issuedOtherLicense === 'Y'">
                <b-row>
                    <b-col>
                        <button class="btn btn-secondary" v-b-modal.modal-license>Add  License</button>
                    </b-col>
                </b-row>

                <b-row>
                    <b-col>
                        <b-table hover small show-empty
                             responsive="true"
                             :fields="fields"
                             :items="screen.otherLicenses"
                             :busy="false">
                        <template v-slot:no-data>
                            No information for other licenses.
                        </template>
                        <div slot="table-busy" class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                        <template v-slot:cell(actions)="row">
                            <b-button size="sm" class="mr-1">
                                edit
                            </b-button>
                        </template>
                        <template slot="empty" slot-scope="scope">
                            No information for other licenses.
                        </template>
                    </b-table>
                    </b-col>
                </b-row>
            </div>

        </div>

        <b-modal  hide-footer
            id="modal-license"
            ref="modal"
            title="Add Other License"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk">

            <form ref="form" @submit.stop.prevent="handleSubmit">
                 <BaseTextInput v-model="license.state"
                                       :v="$v.license.state"
                                       slug="state"
                                       label="State"
                                       setId="modal-state"/>    
                <BaseTextInput v-model="license.status"
                                :v="$v.license.status"
                                slug="status"
                                label="Status"
                                setId="modal-status"/>
                <BaseDateInput v-model="license.dateIssued"
                                :v="$v.license.dateIssued"
                                slug="dateIssued"
                                label="Date Issued"
                                setId="modal-date"/>
                <BaseTextInput v-model="license.licenseId"
                                :v="$v.license.licenseId"
                                slug="licenseId"
                                label="ID #"
                                setId="modal-id"/>
                
                <b-button type="submit" variant="primary">Submit</b-button>
            </form>
        </b-modal>
    </div>

</template>
<script>
import { required, requiredIf, email, minLength } from 'vuelidate/lib/validators'
import { commonOptions } from '@/mixins/commonOptions.js'

export default {
    data: () => {
        return {    
            screen: {
                issuedOtherLicense: null,
                otherLicenses: [],
            },
            license: {
                state: null,
                status: null,
                dateIssued: null,
                licenseId: null,
            },
            fields: [
                {key: 'state', sortable: true, label: 'Jurisdiction'},
                {key: 'status', sortable: true, label: 'License Status'},
                {key: 'dateIssued', sortable: true, label: 'Date Issued'},
                {key: 'licenseId', sortable: true, label: 'ID #'},
                {key: 'actions', label: 'Actions'}
            ]
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
    
    validations() {
        return {
            screen: {
                issuedOtherLicense: { required },
                otherLicenses: {
                    required: requiredIf(function() { return this.issuedOtherLicense === 'Y' }),
                },
            },
            license: {
                    state: { required } ,
                    status: { required },
                    dateIssued: { required },
                    licenseId: { required }
            },
            form: [ 'screen' ]
        }            
    },

    methods: {

            removeLicense: function (i) {
                this.$delete(this.otherLicenses, i)
            },

resetModal() {
        this.name = null
        this.nameState = null
      },

      handleOk(bvModalEvt) {
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },

       handleSubmit() {
        this.$v.license.$touch()
        if (this.$v.license.$invalid) {
            return
        }
        this.screen.otherLicenses.push(this.license)
        this.close()

    },
    close () {
        this.$bvModal.hide('modal-license')
        setTimeout(() => {
          this.license = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
          this.$v.license.$reset()
        }, 300)
      },

        validate() {
            this.$v.form.$touch();
            var isValid = !this.$v.form.$invalid            
            this.$emit('on-validate', this.$data.screen, isValid)
            return isValid
        }
    }
}
</script>