<template>
    <div class="card">
        <div class="card-header" tabindex="0">Applicant Affirmation</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    The information I have provided in this application is true and accurate to the best of my knowledge.
                    I have read and will comply with the requirements of Minnesota Statutes, Chapter 146B. I understand that knowingly making a
                    false statement on this application could be cause for denial, suspension or revocation of licensure. I understand by signing
                    this document, I give MDH the authority to contact any listed supervisor, employer and client submitted for use in
                    verification of credentials.
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="6">
                    <BaseTextInput v-model="signature"
                                   :v="$v.signature"
                                   slug="signature"
                                   label="Signature"
                                   setId="sig"
                    />
                </b-col>
                <b-col cols="12" lg="6">
                    <BaseDateInput v-model="dateSigned"
                                   :v="$v.dateSigned"
                                   label="Date"
                                   slug="dateSigned"
                                   :disabled="true"
                                   setId="dtSig"
                    />
                </b-col>
            </b-row>
        </div>
    </div>

</template>
<script>
    import BaseTextInput from '@/components/templates/input/BaseTextInput.vue'
    import BaseDateInput from '@/components/templates/input/BaseDateInput.vue'
    import { required } from 'vuelidate/lib/validators'

    export default {
        data: () => {
            return {
                signature: null,
                dateSigned: new Date().toISOString().slice(0,10)
            }
        },
        components: {
            BaseTextInput,
            BaseDateInput
        },
        validations() {
            return {
                signature:{ required },
                dateSigned: { required },
                form: [ 'signature','dateSigned' ]
            }
        },
        methods: {
            validate() {
                this.$v.form.$touch();
                var isValid = !this.$v.form.$invalid
                this.$emit('on-validate', this.$data, isValid)
                return isValid
            }
        }
    }
</script>