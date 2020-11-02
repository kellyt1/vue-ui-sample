<template>
    <div class="card">
        <div class="card-header" tabindex="0">Attachments</div>
        <div class="card-body">
            <form-summary :validator="$v" ref="errorContainer" id="errorContainer"/>
            <b-row>
                <b-col cols="12" md="2" style="margin-bottom:8px;">
                    <FileAttachment
                            v-on:attachment-added="addAttachment"
                            :attachmentTypeOptions="opts.proofOfAgeTypeOptions" id="poa"
                            describedby="poaDesc"
                    />
                </b-col>
                <b-col cols="12" md="4" id="poaDesc">
                    <strong>One of the following types of Proof of Age is required:</strong>
                    <p v-for="item in opts.proofOfAgeTypeOptions" v-bind:key="item.value"
                       style="margin-left:11px; margin-top:8px;">
                            <span v-if="hasAttachment(item.value)">
                                <b-icon icon="check2-square" scale="1.75" variant="success" aria-label="Valid"
                                        alt="Valid" role="img"></b-icon>
                            </span>
                        <span v-else>
                                <b-icon icon="x-circle" scale="1.75" variant="danger" aria-label="Invalid"
                                        alt="Invalid" role="img"></b-icon>
                            </span>
                        <span style="margin-left:12px;">{{item.text}}</span>
                    </p>
                </b-col>
            </b-row>
            <b-row>
                <b-col cols="12" md="2" style="margin-bottom:8px;">
                    <FileAttachment
                            v-on:attachment-added="addAttachment"
                            :attachmentTypeOptions="opts.attachmentTypeOptions" id="attach"
                            describedby="othAttach"
                    />
                </b-col>
                <b-col cols="12" md="4" id="othAttach">
                    <strong>The following other attachments are required:</strong>
                    <p v-for="item in requiredAttachments" v-bind:key="item.value"
                       style="margin-left:11px; margin-top:8px;">
                        <span v-if="hasAttachment(item.value)">
                            <b-icon icon="check2-square" scale="1.75" variant="success" aria-label="Valid"
                                    alt="Valid" role="img"></b-icon>
                        </span>
                        <span v-else>
                            <b-icon icon="x-circle" scale="1.75" variant="danger" aria-label="Invalid"
                                    alt="Invalid" role="img"></b-icon>
                        </span>
                        <span style="margin-left:12px;">{{item.text}}</span>
                    </p>
                </b-col>
            </b-row>
            <b-row>
                <b-col>
                    <b-table hover small show-empty
                             responsive="true"
                             :fields="opts.attachmentFields"
                             :items="attachments"
                             :busy="false">
                        <template v-slot:no-data>
                            No Attachments Found.
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
                            No Attachments Found.
                        </template>
                    </b-table>
                </b-col>
            </b-row>
        </div>
    </div>

</template>
<script>
    import FileAttachment from '@/components/templates/input/FileAttachment.vue'
    import _ from "lodash"
    import axios from "axios"
    import axiosRetry from 'axios-retry'

    axiosRetry(axios, { retries: 3,
        retryDelay: axiosRetry.exponentialDelay  })

    //TODO: attachments required: proof of age, proof of training, credentials for any other state, disciplinary if needed,
    export default {
        props: {
            app: [Object]
        },
        components: {
            FileAttachment,
        },
        created() {
            this.loadTypeOptions();
        },
        data() {
            return {
                opts: {
                    attachmentFields:  [
                        {key: 'filename', sortable: true, label: 'File Name'},
                        {key: 'type', sortable: true, label: 'File Type', formatter: 'getFileType'},
                        {key: 'actions', label: 'Actions'}
                    ],
                    attachmentTypeOptions: [],
                    proofOfAgeTypeOptions: [],
                },
                attachments: [],
            }
        },
        validations() {
            return {
                haveAllAttachments: { reqAttch() {
                        return this.haveAllAttachments()
                    }
                }
            }
        },
        methods: {
            addAttachment(value) {
                this.attachments.push(value)
            },
            getFileType(value) {
                const type = this.opts.attachmentTypeOptions.filter(opt => opt.value === value.code)[0]
                const poaType = this.opts.proofOfAgeTypeOptions.filter(opt => opt.value === value.code)[0]
                if (type) {
                    return type.text
                } else if (poaType) {
                    return poaType.text
                } else {
                    return null
                }
            },
            hasAttachment(attachmentType) {
                let found = this.attachments.find(a => a.type.code === attachmentType)
                return found
            },
            loadTypeOptions() {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/Attachments/public/types`, { ignoreHeader: true })
                    .then(response => {
                        for (let type of response.data) {
                            this.opts.attachmentTypeOptions.push({
                                value: type.code,
                                text: type.description
                            })
                        }
                    })
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/Attachments/public/poaTypes`, { ignoreHeader: true })
                    .then(response => {
                        for (let type of response.data) {
                            this.opts.proofOfAgeTypeOptions.push({
                                value: type.code,
                                text: type.description
                            })
                        }
                    })
            },
            haveAllAttachments() {
                let haveAll = false
                let hasPoa = this.attachments.some(a => this.opts.proofOfAgeTypeOptions.filter(poa => poa.value === a.type.code).length > 0)
                let hasOthReqs = this.requiredAttachments.every(req => this.attachments.filter(a => req.value === a.type.code).length > 0)
                if (this.attachments.length > 0 && hasPoa && hasOthReqs) {
                    haveAll = true
                }
                return haveAll
            },
            validate() {
                this.$v.haveAllAttachments.$touch();
                var isValid = !this.$v.haveAllAttachments.$invalid
                this.$emit('on-validate', this.$data, isValid)
                return isValid
            },
        },
        computed: {
            _: function () {
                return _
            },
            requiredAttachments: function() {
                let results = []
                let reqForAll = this.opts.attachmentTypeOptions.filter(t => t.value === 'CC' || t.value === 'NA')
                results = reqForAll
                if (this.app && this.app.license && this.app.questions) {
                    if (this.app.license.licenseType === 'T' || this.app.license.licenseType === 'D') {
                        results.push(this.opts.attachmentTypeOptions.filter(t => t.value === 'HL')[0])
                    }
                    if (this.app.license.licenseType === 'P' || this.app.license.licenseType === 'D') {
                        results.push(this.opts.attachmentTypeOptions.filter(t => t.value === 'SL')[0])
                    }
                    if (this.app.questionResponses.filter(qr => qr.question ===
                        (this.app.questions.filter(q => q.questionText.includes('issued by a city, county, or other state'))[0].code))[0].response === 'Y') {
                        results.push(this.opts.attachmentTypeOptions.filter(t => t.value === 'VC')[0])
                    }
                    if(this.app.questionResponses.filter(qr => qr.question ===
                        (this.app.questions.filter(q => q.addlResponseText.includes('disciplinary action'))[0].code))[0].response === 'Y') {
                        results.push(this.opts.attachmentTypeOptions.filter(t => t.value === 'DI')[0])
                    }
                }
                return results;
            },
        }
    }
</script>