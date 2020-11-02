<template>
    <div>
        <b-row>
            <b-col>
                <b-button v-b-modal="id +'modal-prevent-closing'"
                  variant="outline-primary" :aria-describedby="describedby">Attach Document(s)</b-button>
            </b-col>
        </b-row>
        
        <b-modal  hide-footer
            :id="id +'modal-prevent-closing'"
            ref="modal"
            title="Add File Attachment"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk">

            <form ref="form" @submit.stop.prevent="handleSubmit">
                <b-form-group
                    :state="$v.type.$dirty ? !$v.type.$error : null"
                    label="Type of Attachment"
                    label-for="type-input"
                    invalid-feedback="Type of Attachment is required">
                    <b-form-select id="type-input" v-model="type" 
                      :state="$v.type.$dirty ? !$v.type.$error : null"
                      :options="attachmentTypeOptions">
                      <template v-slot:first>
                          <option :value="null" disabled>-- Please select an option --</option>
                      </template>
                  </b-form-select>
                </b-form-group>

                <b-form-group v-if="type === 'OT'"
                        :state="$v.othType.$dirty ? !$v.othType.$error : null"
                        label="Other Type of Attachment"
                        label-for="othType-input"
                        invalid-feedback="OTher Type of Attachment is required">
                    <b-form-input id="othType-input" v-model="othType"
                                   :state="$v.othType.$dirty ? !$v.othType.$error : null"
                                   >
                    </b-form-input>
                </b-form-group>

                <b-form-group
                      :state="$v.file.$dirty ? !$v.file.$error : null"
                    label="File to Attach"
                    label-for="file-input"
                    invalid-feedback="File Attachment is required">
                    <b-form-file
                        id="file-input"
                        v-model="file"
                      :state="$v.file.$dirty ? !$v.file.$error : null"
                        placeholder="Choose a file or drop it here..."
                        drop-placeholder="Drop file here...">
                    </b-form-file>
                </b-form-group>

                <b-button type="submit" variant="primary">Submit</b-button>
            </form>
        </b-modal>
    </div>
</template>

<script>
    import axios from "axios"
    import { required, requiredIf } from 'vuelidate/lib/validators'

  export default {
    data() {
      return {
        type: null,
        file: null,
        othType: null
      }
    },
    props: {
      attachmentTypeOptions: [Array],
      id: [String],
      describedby: [String]
    },
    validations: {
         file: { required },
         type: { required },
         othType: { required: requiredIf(function() { return this.type === 'OT' }) }
    },

    methods: {
      checkFormValidity() {
        const valid = this.$refs.form.checkValidity()
        this.nameState = valid
        return valid
      },
      resetModal() {
        this.name = null
        this.nameState = null
      },
      handleOk(bvModalEvt) {
        // Prevent modal from closing
        bvModalEvt.preventDefault()
        // Trigger submit handler
        this.handleSubmit()
      },
      handleSubmit() {
        this.$v.$touch()
            if (this.$v.$invalid) {
                return
            }
        const fd2 = new FormData()
          fd2.append('file', this.file)
          fd2.append('type', this.type)
          if (this.othType != null) {
              fd2.append('othType', this.othType)
          }
        axios.post(`${process.env.VUE_APP_API_BASE_URL}/Attachments/public`, fd2, { ignoreHeader: true })
          .then(response => {
            this.file = null
            this.type = null
            this.othType = null
            this.$v.$reset()
            // Hide the modal manually
            this.$emit('attachment-added', response.data)
              let modalId = this.id + 'modal-prevent-closing';
        this.$nextTick(() => {
          this.$bvModal.hide(modalId)
        })
          })
    }
  }
  }
</script>