<template>
    <div class="card">
        <div class="card-header" tabindex="0">Questionaire</div>
        <div class="card-body">
            <div v-for="(q, index) in questions" :key="q.code">
                <b-row>
                    <b-col cols="12" lg="12">
                        <BaseRadioInput v-model="questionResponses[index].response"
                                        :v="$v.questionResponses.$each[index].response"
                                        :label="q.questionText"
                                        slug="response"
                                        :options=opts.yesNoOptions
                                        :key="index"
                        />
                    </b-col>
                </b-row>
                <b-row v-if="q.triggerAddlResponse === true && questionResponses[index].response === 'Y'">
                    <b-col cols="12" lg="12">
                        <BaseTextInput v-model="questionResponses[index].additionalResponse"
                                       :v="$v.questionResponses.$each[index].additionalResponse"
                                       slug="additionalResponse"
                                       :label="q.addlResponseText"
                                       :key="index"
                                       :setId="'qAddlResponse'+index"
                        />
                    </b-col>
                </b-row>
            </div>
        </div>
    </div>

</template>
<script>
    import { commonOptions } from '@/mixins/commonOptions.js'
    import BaseTextInput from '@/components/templates/input/BaseTextInput.vue'
    import BaseRadioInput from '@/components/templates/input/BaseRadioInput.vue'
    import { required, requiredIf } from 'vuelidate/lib/validators'
    import axios from "axios"
    import axiosRetry from 'axios-retry'

    axiosRetry(axios, { retries: 3,
        retryDelay: axiosRetry.exponentialDelay  })

    export default {
        created() {
            this.loadQuestions();
        },
        data: () => {
            return {
                questions: [],
                questionResponses: []
            }
        },
        mixins: [
            commonOptions
        ],
        components: {
            BaseTextInput,
            BaseRadioInput
        },
        validations() {
            return {
                questionResponses: {
                    required,
                    $each: {
                        response: { required },
                        additionalResponse: {
                            requiredIf: requiredIf((object) => {
                                let q = this.questions.filter(q => q.code == object.question)[0];
                                return q.triggerAddlResponse === true && object.response === 'Y'
                            } )
                        }
                    }
                },
                form: ['questionResponses']
            }
        },
        methods: {
            loadQuestions() {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/Questions/public`, { ignoreHeader: true })
                    .then(response => {
                        this.questions = response.data
                        for (let q of this.questions) {
                            this.questionResponses.push({
                                response: null,
                                additionalResponse: null,
                                question: q.code,
                                application: null
                            })
                        }
                    })
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