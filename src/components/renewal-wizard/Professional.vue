<template>
    <div class="card">
        <div class="card-header" tabindex="0">Continuing Education</div>
        <div class="card-body">
            <b-row>
                <b-col>
                    <p>You must successfully complete <strong>5 hours</strong> of training covering these four topics <strong>within the past year</strong>:
                    bloodborne pathogens, prevention of disease transmission, infection control, and aseptic technique.</p>
                    <p><strong>Provide a copy of all certificates of completion showing course title, presenter, date completed, and hours of training.</strong></p>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12" lg="12">
                    <form-summary :validator="$v.form" ref="errorContainer" id="errorContainer"/>
                    <FileAttachment v-on:attachment-added="addAttachment" describedby="poaDesc"/>
                </b-col>
            </b-row>

            <b-row>
                <b-col cols="12" lg="12">
                    <b-table hover small show-empty
                             responsive="true"
                             :fields="attachmentFields"
                             :items="screen.continuingEducations"
                             :busy="false">
                        <template v-slot:no-data>
                            No continuing education documents attached.
                        </template>
                        <div slot="table-busy" class="text-center text-danger my-2">
                            <b-spinner class="align-middle"></b-spinner>
                            <strong>Loading...</strong>
                        </div>
                        <template v-slot:cell(actions)="row">
                            <b-button size="sm" :href="row.item.url" target="_attach" class="mr-1">
                                download
                            </b-button>
                        </template>
                        <template slot="empty" slot-scope="scope">
                            No continuing education documents attached.
                        </template>
                    </b-table>
                </b-col>
            </b-row>

        </div>

    </div>

</template>
<script>
import { required, requiredIf, email, minLength } from 'vuelidate/lib/validators'
import FileAttachment from '@/components/renewal-wizard/FileAttachment.vue'

export default {
    data: () => {
        return {
            screen: {    
                continuingEducations: [],
            },
            attachmentFields:  [
                {key: 'filename', sortable: true, label: 'File Name'},
                {key: 'courseDate', sortable: true, label: 'Course Date'},
                {key: 'trainingPresenter', sortable: true, label: 'Training Presenter'},
                {key: 'actions', label: 'Actions'}
            ],
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

    components: {
        FileAttachment,
    },
    
    validations() {
        return {
              screen: {
                  continuingEducations: {
                required,
                minLength: minLength(1)
              },
              },
            form: [ 'screen' ]
        }            
    },

    methods: {
         addAttachment(value) {
        this.screen.continuingEducations.push(value)
    },

        validate() {
            this.$v.form.$touch();
            var isValid = !this.$v.form.$invalid            
            this.$emit('on-validate', this.$data.screen, isValid)
            return isValid
        }
    }
}
</script>