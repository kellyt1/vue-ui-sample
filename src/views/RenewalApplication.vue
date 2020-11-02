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
                 @on-change="switchTabs"
                 id="wizard">

        <span slot="title" tabindex="-1"/>
        <tab-content  title="Start" :before-change="()=>validateStep('start')" :after-change="()=>scrollTo()">
            <Start ref="start" @on-validate="mergePartialModels"/>
        </tab-content>

        <tab-content  title="Personal" :before-change="()=>validateStep('personal')" :after-change="()=>scrollTo()">
            <Personal ref="personal" @on-validate="mergePartialModels" :renewalApplication="renewalApplication"/>
        </tab-content>

        <tab-content  title="Professional" :before-change="()=>validateStep('professional')" :after-change="()=>scrollTo()">
            <Professional ref="professional" @on-validate="mergePartialModels" :renewalApplication="renewalApplication"/>
        </tab-content>

        <tab-content  title="Other Licenses" :before-change="()=>validateStep('other')" :after-change="()=>scrollTo()">
            <OtherLicense ref="other" @on-validate="mergePartialModels" :renewalApplication="renewalApplication"/>
        </tab-content>

        <tab-content  title="Additional Information" :before-change="()=>validateStep('addl')" :after-change="()=>scrollTo()">
            <Additional ref="addl" @on-validate="mergePartialModels" :renewalApplication="renewalApplication"/>
        </tab-content>

        <tab-content  title="Confirm" :before-change="()=>validateStep('confirm')" :after-change="()=>scrollTo()">
            <Confirm ref="confirm" @on-validate="mergePartialModels" :renewalApplication="renewalApplication"/>
        </tab-content>
    </form-wizard>
</div>

</template>

<script>
import axios from "axios"
import { commonOptions } from '@/mixins/commonOptions.js'
import { buttons, breadcrumbs } from '@/mixins/constants.js'
import Start from '@/components/renewal-wizard/Start.vue'
import Personal from '@/components/renewal-wizard/Personal.vue'
import Professional from '@/components/renewal-wizard/Professional.vue'
import OtherLicense from '@/components/renewal-wizard/OtherLicense.vue'
import Additional from '@/components/renewal-wizard/Additional.vue'
import Confirm from '@/components/renewal-wizard/Confirm.vue'

import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3,
                    retryDelay: axiosRetry.exponentialDelay  })

export default {
    components: {
        Start,
        Personal,
        Professional,
        OtherLicense,
        Additional,
        Confirm
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
            pageTitle: '',
            renewalApplication: {
                id: null,
                homeAddress: { }
            },
        }
    },
    created() {
        document.title = 'Technician Renewal Application'
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
            console.log(this.renewalApplication)
                this.sendToServer()

        },
        sendToServer() {
            axios.post(`${process.env.VUE_APP_API_BASE_URL}/renewal/`, this.renewalApplication, { ignoreHeader: true })
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
            console.log("model")
            console.log(model)

            if(isValid){            
                this.renewalApplication = Object.assign({}, this.renewalApplication, model)
            }
            console.log(this.renewalApplication)
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
                    title = 'Introduction'
                    break;
                case 1:
                    title = 'Personal Information'
                    break;
                case 2:
                    title = 'Professional Information'
                    break;
                case 3:
                    title = 'Other Licenses'
                    break;
                case 4:
                    title = 'Additional Information'
                    break;
                case 5:
                    title = 'Confirmation'
                    break;
                default:
                    title = 'Application'
            }
            document.title = title + ' - Technician Renewal Application'
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