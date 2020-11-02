<template>
    <div class="card">
        <div class="card-header" tabindex="0">Additional Information</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    Use this page to indicate additional relevant information or as additional space to complete answers from previous page(s)
                    where space was insufficient. Include question number(s) with each answer.
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" lg="12">
                    <BaseParagraphInput v-model="additionalInformation"
                        :v="$v.additionalInformation"
                        slug="additionalInformation"
                        label="Additional Information"
                        setId="addlInfo"
                    />
                </b-col>
            </b-row>
        </div>
    </div>

</template>
<script>
    import BaseParagraphInput from '@/components/templates/input/BaseParagraphInput.vue'
    import { required } from 'vuelidate/lib/validators'

    export default {
        data: () => {
            return {
                additionalInformation: null,
            }
        },
        components: {
            BaseParagraphInput
        },
        validations() {
            return {
                additionalInformation: { required: false },
                form: [ 'additionalInformation' ]
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