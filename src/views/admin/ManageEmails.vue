<template>
  <b-container fluid id="form-container" ref="formContainer">
    <b-row>
      <b-col>
        <h2>Email Settings</h2>
        <p>These are application settings related to emails sent from the application.</p>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <form-summary :validator="$v" ref="errorContainer" id="errorContainer"/>
      </b-col>
    </b-row>

    <b-row>
        <b-col>
            <BaseTextInput v-model="setting.email_sender_address" 
                            :v="$v.setting.email_sender_address"
                            label="Sender Email Address"
                            tip="This is the email address that will appear as the sender for emails sent from this application."
                            slug="emailSenderAddress"/>
        </b-col>
    </b-row>

    <b-row>
        <b-col>
            <BaseSwitchInput v-model="setting.email_send_live" 
                            :v="$v.setting.email_send_live"
                            label="Send Live Emails"
                            tip=""
                            slug="sendLiveEmails"/>
        </b-col>
    </b-row>

    <b-row>
        <b-col>
            <BaseTextInput v-model="setting.email_redirect_address" 
                            :v="$v.setting.email_redirect_address"
                            label="Email Address to Redirect Non-Live Emails"
                            tip="For non-live emails, these are the email address(es) where TODO."
                            slug="emailRedirectAddress"/>
        </b-col>
    </b-row>
    
    <b-row>
      <b-col>
        <hr/>
         <b-button type="button" variant="primary" @click="saveSetting">Save</b-button>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import axios from "axios"
import { required, email, minLength, maxLength, numeric, requiredUnless, requiredIf } from 'vuelidate/lib/validators'

export default {
  data: () => ({
    setting: { },
  }),
  created() {
    this.loadSetting()
  },
  validations() {
    return {
      setting: {
        email_sender_address: {
          required,
          email,
          maxLength: maxLength(100)
        },
        email_send_live: {
          required: false,
        },
        email_redirect_address: {
          required: false,
          maxLength: maxLength(250)
        },
      }
    }
  },
  methods: {
    loadSetting() {
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/admin/settings/query`, 
          ['email_sender_address', 'email_send_live', 'email_redirect_address']
      ).then(response => { this.setting = response.data.settings })
    },
    saveSetting() {
      this.$v.$touch();
      if (this.$v.$invalid) {
          this.$nextTick(() => {
              document.getElementById('form-container').scrollIntoView()
          })
          return
      }

      axios.put(`${process.env.VUE_APP_API_BASE_URL}/admin/settings`, this.setting)
          .then(response => { 
            this.$bvToast.toast('Email Settings Updated', {
              title: 'Status',
              toaster: 'b-toaster-top-center',
              solid: true,
              variant: 'success',
              appendToast: true
            })
           })
    }
  }
}
</script>

<style>

</style>
