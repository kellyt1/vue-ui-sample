<template>
  <b-container fluid id="form-container" ref="formContainer">
    <b-row>
      <b-col>
        <h2>Fee Settings</h2>
        <p>These are application settings related to the fees for all types of application.</p>
      </b-col>
    </b-row>

    <b-row>
      <b-col>
        <form-summary :validator="$v" ref="errorContainer" id="errorContainer"/>
      </b-col>
    </b-row>

      <div id="techDiv">
          <h3>Technician License</h3>
          <b-row>
              <b-col>
                  <BaseMoneyInput v-model="setting.fee_tech_amount"
                                  :v="$v.setting.fee_tech_amount"
                                  label="Technician Fee Amount"
                                  slug="techFeeAmount"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseTextInput v-model="setting.fee_tech_speedchart"
                                 :v="$v.setting.fee_tech_speedchart"
                                 label="Technician Fee Speedchart"
                                 tip=""
                                 slug="techFeeSpeedchart"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseMoneyInput v-model="setting.fee_tech_late_amount"
                                  :v="$v.setting.fee_tech_late_amount"
                                  label="Technician Late Fee Amount"
                                  slug="techLateFeeAmount"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseTextInput v-model="setting.fee_tech_late_speedchart"
                                 :v="$v.setting.fee_tech_late_speedchart"
                                 label="Technician Late Fee Speedchart"
                                 tip=""
                                 slug="techLateFeeSpeedchart"/>
              </b-col>
          </b-row>
      </div>

<!--      guest-->
      <div id="guestDiv">
          <h3>Guest License</h3>
          <b-row>
              <b-col>
                  <BaseMoneyInput v-model="setting.fee_guest_amount"
                                  :v="$v.setting.fee_guest_amount"
                                  label="Guest Fee Amount"
                                  slug="guestFeeAmount"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseTextInput v-model="setting.fee_guest_speedchart"
                                 :v="$v.setting.fee_guest_speedchart"
                                 label="Guest Fee Speedchart"
                                 tip=""
                                 slug="guestFeeSpeedchart"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseMoneyInput v-model="setting.fee_guest_late_amount"
                                  :v="$v.setting.fee_guest_late_amount"
                                  label="Guest Late Fee Amount"
                                  slug="guestLateFeeAmount"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseTextInput v-model="setting.fee_guest_late_speedchart"
                                 :v="$v.setting.fee_guest_late_speedchart"
                                 label="Guest Late Fee Speedchart"
                                 tip=""
                                 slug="guestLateFeeSpeedchart"/>
              </b-col>
          </b-row>
      </div>

<!--      temporary-->
      <div id="tempDiv">
          <h3>Temporary License</h3>
          <b-row>
              <b-col>
                  <BaseMoneyInput v-model="setting.fee_temp_amount"
                                  :v="$v.setting.fee_temp_amount"
                                  label="Temporary Fee Amount"
                                  slug="tempFeeAmount"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseTextInput v-model="setting.fee_temp_speedchart"
                                 :v="$v.setting.fee_temp_speedchart"
                                 label="Temporary Fee Speedchart"
                                 tip=""
                                 slug="tempFeeSpeedchart"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseMoneyInput v-model="setting.fee_temp_late_amount"
                                  :v="$v.setting.fee_temp_late_amount"
                                  label="Temporary Late Fee Amount"
                                  slug="tempLateFeeAmount"/>
              </b-col>
          </b-row>

          <b-row>
              <b-col>
                  <BaseTextInput v-model="setting.fee_temp_late_speedchart"
                                 :v="$v.setting.fee_temp_late_speedchart"
                                 label="Temporary Late Fee Speedchart"
                                 tip=""
                                 slug="tempLateFeeSpeedchart"/>
              </b-col>
          </b-row>
      </div>

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
import { required, decimal } from 'vuelidate/lib/validators'

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
        fee_tech_amount: {
          required:false,
          decimal,
          isMoneyDecimal(dec) {
              var moneyRegex = /^\d+(\.\d{1,2})?$|^(d+)?\.\d{1,2}$/
              return moneyRegex.test(dec)
          }
        },
        fee_tech_speedchart: {
          required: false,
        },
        fee_tech_late_amount: {
            required:false,
            decimal,
            isMoneyDecimal(dec) {
                var moneyRegex = /^\d+(\.\d{1,2})?$|^(d+)?\.\d{1,2}$/
                return moneyRegex.test(dec)
            }
        },
        fee_tech_late_speedchart: {
            required: false,
        },
        fee_guest_amount: {
            required:false,
            decimal,
            isMoneyDecimal(dec) {
                var moneyRegex = /^\d+(\.\d{1,2})?$|^(d+)?\.\d{1,2}$/
                return moneyRegex.test(dec)
            }
        },
        fee_guest_speedchart: {
            required: false,
        },
        fee_guest_late_amount: {
            required:false,
            decimal,
            isMoneyDecimal(dec) {
                var moneyRegex = /^\d+(\.\d{1,2})?$|^(d+)?\.\d{1,2}$/
                return moneyRegex.test(dec)
            }
        },
        fee_guest_late_speedchart: {
            required: false,
        },
        fee_temp_amount: {
            required:false,
            decimal,
            isMoneyDecimal(dec) {
                var moneyRegex = /^\d+(\.\d{1,2})?$|^(d+)?\.\d{1,2}$/
                return moneyRegex.test(dec)
            }
        },
        fee_temp_speedchart: {
            required: false,
        },
        fee_temp_late_amount: {
            required:false,
            decimal,
            isMoneyDecimal(dec) {
                var moneyRegex = /^\d+(\.\d{1,2})?$|^(d+)?\.\d{1,2}$/
                return moneyRegex.test(dec)
            }
        },
        fee_temp_late_speedchart: {
            required: false,
        },
      }
    }
  },
  methods: {
    loadSetting() {
      axios.post(`${process.env.VUE_APP_API_BASE_URL}/admin/settings/query`, 
          ['fee_tech_amount', 'fee_tech_speedchart', 'fee_tech_late_amount','fee_tech_late_speedchart',
              'fee_guest_amount', 'fee_guest_speedchart', 'fee_guest_late_amount', 'fee_guest_late_speedchart',
              'fee_temp_amount', 'fee_temp_speedchart', 'fee_temp_late_amount', 'fee_temp_late_speedchart']
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
            this.$bvToast.toast('Fee Settings Updated', {
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
