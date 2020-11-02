<template>
<div id="form-container" ref="formContainer">
    <div id="pgTitle" tabindex="-1"><h1>{{pageTitle}}</h1></div>

    <form-wizard :stepSize="stepSize"
                 :nextButtonText="buttons.next"
                 :backButtonText="buttons.back"
                 :finishButtonText="buttons.submit"
                 color="#003865"
                 :layout="layout"
                 @on-complete="onSubmit"
                 id="wizard"
                 @on-change="switchTabs"
    >
        <span slot="title" tabindex="-1"/>
        
        <tab-content  :title="breadcrumbs.category"
            :before-change="()=>validateStep('category')" :after-change="()=>scrollTo()">
            <Category ref="category" @on-validate="mergePartialModels"/>
        </tab-content>

        <tab-content  :title="breadcrumbs.instruct">
            <Instructions ref="inst" :after-change="()=>scrollTo()"/>
        </tab-content>
        
        <tab-content :title="breadcrumbs.appInfo"
                     :before-change="()=>validateStep('appl')" :after-change="()=>scrollTo()">
            <ApplicantInfo ref="appl" @on-validate="mergePartialModels"/>
        </tab-content>
        
        <tab-content :title="breadcrumbs.employ"
                     :before-change="()=>validateStep('emp')" :after-change="()=>scrollTo()">
            <Employment ref="emp" @on-validate="mergePartialModels"/>
        </tab-content>
        
        <tab-content :title="breadcrumbs.question"
                     :before-change="()=>validateStep('ques')" :after-change="()=>scrollTo()">
            <Question ref="ques" @on-validate="mergePartialModels"/>
        </tab-content>
        
        <tab-content :title="breadcrumbs.attach"
                     :before-change="()=>validateStep('att')" :after-change="()=>scrollTo()">
            <Attachments ref="att" @on-validate="mergePartialModels" :app="technicianApplication" v-bind:attachments="technicianApplication.attachments"/>
        </tab-content>
        
        <tab-content :title="breadcrumbs.addl"
                     :before-change="()=>validateStep('addl')" :after-change="()=>scrollTo()">
            <AddlInfo ref="addl" @on-validate="mergePartialModels"/>
        </tab-content>
        
        <tab-content :title="breadcrumbs.sig"
                     :before-change="()=>validateStep('sig')" :after-change="()=>scrollTo()">
            <Signature ref="sig" />
        </tab-content>
        
        <tab-content :title="breadcrumbs.pay"
                     :before-change="()=>validateStep('pay')" :after-change="()=>scrollTo()">
            <Payment ref="pay"/>
        </tab-content>
    </form-wizard>
</div>

</template>

<script>
import axios from "axios"
import { commonOptions } from '@/mixins/commonOptions.js'
import { buttons, breadcrumbs } from '@/mixins/constants.js'
import Category from '@/components/wizard/Category.vue'
import Instructions from '@/components/wizard/Instructions.vue'
import ApplicantInfo from '@/components/wizard/ApplicantInfo.vue'
import Employment from '@/components/wizard/Employment.vue'
import Question from '@/components/wizard/Question.vue'
import Attachments from '@/components/wizard/Attachments.vue'
import AddlInfo from '@/components/wizard/AddlInfo.vue'
import Signature from '@/components/wizard/Signature.vue'
import Payment from '@/components/wizard/Payment.vue'
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3,
                    retryDelay: axiosRetry.exponentialDelay  })

export default {
    components: {
        Category,
        Instructions,
        ApplicantInfo,
        Employment,
        Question,
        Attachments,
        AddlInfo,
        Signature,
        Payment
    },
    mixins: [
        commonOptions,
        breadcrumbs,
        buttons
    ],
    data() {
        return {
            stepSize: 'sm',
            layout: '',
            isSubmitted: false,
            shortCode: '',
            pageTitle: '',
            technicianApplication: {
                id: null
            },
        }
    },
    created() {
        document.title = 'Submit New Body Art Certification Application'
        this.pageTitle = document.title
    },
    methods: {
        buttons: function() {
            return buttons
        },
        breadcrumbs: function() {
            return breadcrumbs
        },
        onSubmit() {
            if (this.technicianApplication.questions) {
                delete this.technicianApplication.questions
            }
            if (this.technicianApplication.otherName !== 'Y') {
                this.technicianApplication.otherNames = []
            }
            console.log(this.technicianApplication)
            this.sendToServer()
        },
        sendToServer() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/application`, this.technicianApplication)
                .then(response => { 
                    this.isSubmitted = true
                    // redirect to usbank for payment
                    this.sendToUSBank(response.data)
            })
        },

         sendToUSBank(formData) {
            var usbForm = document.createElement('form')
            usbForm.method = 'post' 
            usbForm.action = process.env.VUE_APP_USBANK_ENDPOINT
            for (var k in formData) {
                var input = document.createElement('input')
                input.setAttribute('name', k)
                input.setAttribute('value', formData[k])
                usbForm.appendChild(input) ;
            }
            document.body.appendChild(usbForm)
            usbForm.submit()
            document.body.removeChild(usbForm) ;
        },
        
        validateStep(name) {
            var refToValidate = this.$refs[name]
            return refToValidate.validate()
        },
        mergePartialModels(model, isValid) {
            if(isValid){
                // merging each step model into the final model
                this.technicianApplication = Object.assign({}, this.technicianApplication, model)
                if (this.technicianApplication.opts) {
                    delete this.technicianApplication.opts
                }
            }
        },
        scrollTo() {
            let elem = document.getElementById("wizard")
            elem.scrollIntoView()
            // this.focus(e)
        },
        focus(e) {
            let elem = document.getElementsByClassName("card-header")[e+1]
            elem.focus()
            // this.disableTabs(e)
        },
        switchTabs(prevIdx, nextIdx) {
            var title = 'Welcome'
            switch (nextIdx) {
                case 0:
                    title = 'Category'
                    break;
                case 1:
                    title = 'Instructions'
                    break;
                case 2:
                    title = 'Applicant Information'
                    break;
                case 3:
                    title = 'Employment Information'
                    break;
                case 4:
                    title = 'Questions'
                    break;
                case 5:
                    title = 'Attachments'
                    break;
                case 6:
                    title = 'Additional Information'
                    break;
                case 7:
                    title = 'Signature'
                    break;
                case 8:
                    title = 'Payment'
                    break;
                default:
                    title = 'Application'
            }
            document.title = title + ' - Submit New Application'
            this.pageTitle = document.title
            document.getElementById('pgTitle').focus()
        },
        removeTabFocus() {
            this.$nextTick(function () {
                var steps = document.querySelectorAll("div[role='tab']")
                steps.forEach(step => {
                    step.setAttribute("tabindex", "-1")
                })

                var steps2 = document.querySelectorAll(".wizard-nav-pills>li>a");
                steps2.forEach(step => {
                    step.setAttribute("tabindex", "-1")
                })
            })
        }
    },
    updated: function() {
        this.removeTabFocus()
    }
}
</script>

<style>
.card {
    margin-bottom: 18px;
}
.card-header {
    font-weight: 700;
}
</style>
