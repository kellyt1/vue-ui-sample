<template>
    <div>
        <b-row>
            <b-col>
                <b-button v-b-modal="id +'modal-prevent-closing'"
                  variant="outline-primary" :aria-describedby="describedby">Attach CE Documentation</b-button>
            </b-col>
        </b-row>
        
        <b-modal  hide-footer
            :id="id +'modal-prevent-closing'"
            ref="modal"
            title="Add Continuing Education Documentation"
            @show="resetModal"
            @hidden="resetModal"
            @ok="handleOk">

            <form ref="form" @submit.stop.prevent="handleSubmit">
                <BaseDateInput v-model="dateOfCourse"
                                   :v="$v.dateOfCourse"
                                   label="Date of Course"
                                   slug="dateOfCourse"
                                   setId="dateOfCourse"/>
                <BaseTextInput v-model="presenter"
                                   :v="$v.presenter"
                                   slug="presenter"
                                   label="Training Presenter"
                                   setId="presenter"/>

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
        dateOfCourse: null,
        presenter: null,
        file: null,
      }
    },
    props: {
      id: [String],
      describedby: [String]
    },
    validations: {
         file: { required },
         dateOfCourse: { required },
         presenter: { required }
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
        bvModalEvt.preventDefault()
        this.handleSubmit()
      },

      handleSubmit() {
        this.$v.$touch()
        if (this.$v.$invalid) {
            return
        }

        const fd2 = new FormData()
        fd2.append('file', this.file)
        fd2.append('type', 'CE')
        fd2.append('courseDate', this.dateOfCourse)
        fd2.append('trainingPresenter', this.presenter)

        axios.post(`${process.env.VUE_APP_API_BASE_URL}/Attachments/public`, fd2, {ignoreHeader: true})
          .then(response => {
            this.file = null
            this.type = null
            this.othType = null
            this.dateOfCourse = null
            this.presenter = null

            
            
            this.$emit('attachment-added', response.data)
            let modalId = this.id + 'modal-prevent-closing';
            this.$nextTick(() => {
              this.$v.$reset()
              this.$bvModal.hide(modalId)
            })
          })
    }
  }
  }
</script>