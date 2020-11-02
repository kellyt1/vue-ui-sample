<template>
    <div class="card">
        <div class="card-header" tabindex="0">Search Current Licenses</div>
        <div class="card-body">
            <form-summary :validator="$v" ref="errorContainer" id="errorContainer"/>
            <b-row>
                <b-col cols="12" md="4" id="othAttach">
                    <form-group label="Select License Category" label-for="licenseSelect" :validator="$v.cat">
                        <b-form-select
                                @change="loadLicenses"
                                :options="licenseTypes"
                                v-model="cat"
                                id="licenseSelect"
                        >
                            <template v-slot:first>
                                <option :value="null" disabled>-- Please select an option --</option>
                            </template>
                        </b-form-select>
                    </form-group>
                </b-col>
            </b-row>
            <div v-if="cat != null" class="pt-3">
                <b-row>
                    <b-col>
                        <h2>License List</h2>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col cols="6">
                        <b-form-group
                                label="Per page"
                                label-size="sm"
                                label-for="perPageSelect"
                        >
                            <b-form-select
                                    v-model="perPage"
                                    id="perPageSelect"
                                    size="sm"
                                    :options="pageOptions"
                            ></b-form-select>
                        </b-form-group>
                    </b-col>
                    <b-col cols="6">
                        <b-form-group
                                label="Search"
                                label-size="sm"
                                label-for="filterInput"
                        >
                            <b-input-group size="sm">
                                <b-form-input
                                        v-model="filter"
                                        type="search"
                                        id="filterInput"
                                        placeholder="Search"
                                ></b-form-input>
                                <b-input-group-append>
                                    <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </b-form-group>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-table hover small show-empty
                                 responsive="true"
                                 :fields="fields"
                                 :items="licenses"
                                 type="search"
                                 :current-page="currentPage"
                                 :per-page="perPage"
                                 :filter="filter"
                                 @filtered="onFiltered"
                                 :busy="false">
                            <template v-slot:no-data>
                                No Licenses Found.
                            </template>
                            <div slot="table-busy" class="text-center text-danger my-2">
                                <b-spinner class="align-middle"></b-spinner>
                                <strong>Loading...</strong>
                            </div>
                            <template slot="empty" slot-scope="scope">
                                No Licenses Found.
                            </template>
                            <template v-slot:cell(discipline)="data">
                                {{data.item.discipline}}
                                <span  v-if="data.item.disciplineLink != null">
                                     - <b-link :href="data.item.disciplineLink">{{data.item.disciplineName}}</b-link>
                                </span>
                            </template>
                        </b-table>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col>
                        <b-pagination
                                v-model="currentPage"
                                :per-page="perPage"
                                :total-rows="totalRows"
                                align="fill"
                                size="sm"
                                class="my-0"
                        ></b-pagination>
                    </b-col>
                </b-row>
            </div>
        </div>
    </div>

</template>
<script>
    import axios from "axios"
    import axiosRetry from 'axios-retry'

    axiosRetry(axios, { retries: 3,
        retryDelay: axiosRetry.exponentialDelay  })

    export default {
        data() {
            return {
                licenses: [],
                licenseTypes: ['GUEST', 'TEMPORARY', 'FULL'],
                cat: null,
                fields: [],
                perPage: 5,
                currentPage: 1,
                totalRows: 1,
                pageOptions: [5, 10, 15, 20],
                filter: null,
            }
        },
        methods: {
            loadLicenses() {
                this.updateFields()
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/license/subCategory/${this.cat}`, { ignoreHeader: true })
                    .then(response => {
                        this.licenses = response.data
                        this.updatePagination()
                    })
            },
            updateFields() {
                this.fields = [
                    {key: "lastName", label: "Last Name", sortable: true},
                    {key: "firstName", label: "First Name", sortable: true},
                    {key: "middleName", label: "Middle Name", sortable: true},
                    {key: "number", label: "License No.", sortable: true},
                    {key: "effectiveDate", label: "Start Date", sortable: true},
                    {key: "expirationDate", label: "Expiration Date", sortable: true},
                    {key: "otherNames", label: "Previous Name(s)", sortable: true},
                ]
              if (this.cat !== 'GUEST') {
                  this.fields.push(
                      {key: "licenseType.description", label: "License Type", sortable: true},
                      {key: "formattedStatus", label: "License Status", sortable: true},
                  )
                  if (this.cat === 'FULL') {
                      this.fields.push([
                          {key: "discipline", label: "Disciplinary Action", link:"disciplineLink", fileName:"disciplineName", sortable: true},
                      ])
                  } else if (this.cat === 'TEMPORARY') {
                      this.fields.push([
                          {key: "mnSupervisor", label: "Supervisor", sortable: true},
                      ])
                  }
              }
            },
            onFiltered(filteredItems) {
                // Trigger pagination to update the number of buttons/pages due to filtering
                this.totalRows = filteredItems.length
                this.currentPage = 1
            },
            updatePagination() {
                this.totalRows = this.licenses.length
                this.currentPage = 1
            }
        },
        validations() {
            return {
                cat:{ required: false }
            }
        },
    }
</script>