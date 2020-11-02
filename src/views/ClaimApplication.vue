<template>

<div id="form-container" ref="formContainer">

    <div>
        <h1>Claim My Licenses</h1>

        <b-form>
            <b-row>
                <b-col cols="12" lg="6">
                    <BaseTextInput v-model="toClaim.licNbr"
                                   :v="$v.toClaim.licNbr"
                                   slug="licNbr"
                                   label="License Number"
                                   setId="licNbr"
                    />
                </b-col>
                <b-col cols="12" lg="6">
                    <BaseMaskedTextInput v-model="toClaim.ssn"
                                         :v="$v.toClaim.ssn"
                                         slug="ssn"
                                         label="Social Security Number"
                                         setId="ssn"
                                         mask="###-##-####"
                    />
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-button type="button" variant="primary" @click="claimLicense">Claim License</b-button>
                </b-col>
            </b-row>
        </b-form>
    </div>

</div>
</template>

<script>
import axios from "axios"
import _ from "lodash"
import { required, minLength } from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            toClaim: {
                ssn: null,
                licNbr: null
            }
        }
    },
    validations() {
        return {
            toClaim: {
                ssn: {
                    required, minLength: minLength(11)
                },
                licNbr: {
                    required, minLength: minLength(5)
                },
            }
        }
    },
    methods: {
        claimLicense() {
            this.$v.$touch();
            if (this.$v.$invalid) {
                           this.$nextTick(() => {
                document.getElementById('form-container').scrollIntoView()
                          })
                return
            }
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/license/claim`,
                    this.toClaim)
                .catch(error => {
                    if (error.response.status === 409) {
                        this.showRootToast("License Not Claimed", "The License you have attempted to claim does not exist or has already been claimed.  Please check that the license number and social security number are correct.", "danger")
                    }
                })
                  .then(response => {
                      if(response.status === 200) {
                          this.showRootToast("License Claimed", "You have claimed license "+this.toClaim.licNbr+" .", "success")
                          this.reset();
                      }
                  })
        },
        showRootToast(title, message, type) {
            this.$root.$bvToast.toast(message, {
                title: title,
                toaster: 'b-toaster-top-center',
                solid: true,
                variant: type,
                appendToast: true
            })

        },
        reset() {
            this.toClaim.ssn = null
            this.toClaim.licNbr = null
            this.$v.$reset()
        },
    }   
}
</script>