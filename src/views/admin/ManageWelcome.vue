<template>
  <b-container fluid>
    <b-row>
      <b-col>
        <h2>Welcome Text</h2>
        <p>The welcome text below appears on the landing page of the application prior to the user logging in.</p>
      </b-col>
    </b-row>

    <b-row>
        <b-col>
            <quill-editor
                ref="myQuillEditor"
                v-model="setting.welcome_text"
                :options="editorOptions"
            />
        </b-col>
    </b-row>

    <b-row>
      <b-col>
         <b-button type="button" variant="primary" @click="saveSetting">Submit</b-button>
      </b-col>
    </b-row>

  </b-container>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import axios from "axios"
import { quillEditor } from 'vue-quill-editor'


export default {
  data: () => ({
    setting: { },
    editorOptions: {
        theme: 'snow',
        boundary: document.body,
        modules: {
        toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
        ]
        },
        placeholder: 'Insert text here ...',
        readOnly: false
    }
  }),
  components: {
    quillEditor
  },
  created() {
    this.loadSetting()
  },
  methods: {
      loadSetting() {
          axios.post(`${process.env.VUE_APP_API_BASE_URL}/admin/settings/query`,
              ['welcome_text']
          ).then(response => { this.setting = response.data.settings })
      },
    saveSetting() {
        axios.put(`${process.env.VUE_APP_API_BASE_URL}/admin/settings`, this.setting)
            .then(response => {
                this.$bvToast.toast('Welcome Page Updated', {
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
