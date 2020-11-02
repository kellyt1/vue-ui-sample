<template>
    <div class="card">
        <div class="card-header" tabindex="0">Additional Information</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <form-summary :validator="$v.screen" ref="errorContainer" id="errorContainer"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col>
                    <BaseRadioInput v-model="screen.adverseActionTaken"
                                        :v="$v.screen.adverseActionTaken"
                                        label="Since the date of your last application, is action being taken against you or has action been taken against you or your legal authorization to practice body art in <u>this or any other jurisdiction</u> either through denial of application, revocation, suspension, restrictions, limitations, conditions, reprimand, civil penalty, or any other means (including Stipulation and Consent Orders and Determinations)?"
                                        :options=opts.yesNoOptions
                                        slug="adverseActionTaken" />                
                </b-col>
            </b-row>

            <div v-if="screen.adverseActionTaken === 'Y'">
                <b-row>
                    <b-col>
                        <BaseParagraphInput v-model="screen.adverseActionText"
                            :v="$v.screen.adverseActionText" 
                            label="If yes, explain the reason for the action, action taken, dates, and the authority in possession of your record."/>
                    </b-col>
                </b-row>
            </div>

            <b-row>
                <b-col>
                    <BaseRadioInput v-model="screen.conviction"
                                        :v="$v.screen.conviction"
                                        label="Have you been convicted, within the last two years, of a felony or misdemeanor which relates to the body arts or which involved an essential element of dishonesty?"
                                        :options=opts.yesNoOptions
                                        slug="adverseActionTaken"/>                
                </b-col>
            </b-row>

            <div v-if="screen.conviction === 'Y'">
                <b-row>
                    <b-col>
                        <BaseParagraphInput v-model="screen.convictionText"
                            :v="$v.screen.convictionText" 
                            label="If yes, give a statement supplying full details include the crime(s) of which you were convicted, date(s), name(s) and location of court(s) and case number(s)."/>
                    </b-col>
                </b-row>
            </div>

        </div>

       
    </div>

</template>
<script>
import { required, requiredIf, email, minLength } from 'vuelidate/lib/validators'
import { commonOptions } from '@/mixins/commonOptions.js'

export default {
    data: () => {
        return {    
            screen: {
                adverseActionTaken: null,
                adverseActionText: null,
                conviction: null,
                convictionText: null,
            }
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
                adverseActionTaken: { required },
                adverseActionText: {
                    required: requiredIf(function() { return this.screen.adverseActionTaken === 'Y' }),
                },
                conviction: { required },
                convictionText: {
                    required: requiredIf(function() { return this.screen.conviction === 'Y' }),
                },
            },
            form: [ 'screen' ]
        }            
    },

    methods: {
        validate() {
            this.$v.form.$touch();
            var isValid = !this.$v.form.$invalid            
            this.$emit('on-validate', this.$data.screen, isValid)
            return isValid
        }
    }
}
</script>