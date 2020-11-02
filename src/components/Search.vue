<template>
  <b-container fluid>
    <b-row>
        <b-col>
            <p>Search for and select an employee to send notifications to</p>
        </b-col>
    </b-row>
    <b-row>
        <b-col>
            <b-input-group size="lg">
                <template v-slot:prepend>
                  <b-input-group-text>Name</b-input-group-text>
                </template>
                <b-form-input id="firstName" v-model="firstNameInput" placeholder="John" size="lg" aria-label="First name"></b-form-input>
                <b-form-input id="lastName" v-model="lastNameInput" placeholder="Smith" size="lg" aria-label="Last name"></b-form-input>
                <b-input-group-append>
                    <b-button variant="primary" size="lg" @click="fetchActiveByName()" aria-describedby="Search for an employee by entering their last name">Search</b-button>
                </b-input-group-append>
            </b-input-group>
        </b-col>
    </b-row>

    <b-row>
      <b-col>
        <h2>Current/Active Employee List</h2>
      </b-col>
    </b-row>
    <b-row>
        <b-col>
            <b-form-group label-size="lg" label-for="perPageSelect">
                <b-form-select
                    :options="pageOptions"
                    v-model="perPage"
                    id="perPageSelect"
                    size="lg"
                ></b-form-select>
            </b-form-group>
        </b-col>

        <b-col>
            <b-pagination
              v-model="currentPage"
              :total-rows="totalRows"
              :per-page="perPage"
              size="lg"
            ></b-pagination>
        </b-col>
    </b-row>
    <b-row>
      <b-col>
        <b-table
            :fields="fields"
            :items="items"
            :current-page="currentPage"
            :per-page="perPage"
            sticky-header
            striped
            bordered
            borderless
            outline
            small
            hover
            responsive
        >
            <template v-slot:cell(action)>
                <b-button size="lg" @click="fetchEmployee()" class="mr-1">
                    Select
                </b-button>
            </template>
        </b-table>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
    import axios from "axios"

    export default {
        data: () => ({
            items: null,
            fields: [
                {key: "firstName", label: "First Name"},
                {key: "lastName", label: "Last Name"},
                {key: "employeeId", label: "Employee ID"},
                {key: "division", label: "Division"},
                {key: "classificationTitle", label: "Classification Title"},
                { key: 'actions', label: 'Actions' }
            ],
            firstNameInput: '',
            lastNameInput: '',
            currentPage: 1,
            totalRows: 1,
            perPage: 5,
            pageOptions: [5, 10, 25, 50, 100]
        }),
        methods: {
            fetchActiveByName() {
                console.log(this.firstNameInput + ", " + this.lastNameInput);
                axios.get(`${process.env.VUE_APP_ADMINWS_API_BASE_URL}/employees/active/search/${this.lastNameInput}`,
                    { ignoreHeader: true })
                  .then(response => { this.items = response.data })
                  .catch(err => { console.log("ERROR: " + err) })
            },
            fetchEmployee() {
                console.log("fetch")
            }
        },
        mounted() {
            this.totalRows = this.items.length
        /*
            axios.get(`${process.env.VUE_APP_ADMINWS_API_BASE_URL}/employees/active`, { ignoreHeader: true })
              .then(response => { this.items = response.data })
              .catch(err => { console.log("ERROR: " + err) })
        */
        }
    }
</script>

<style>
    .input-group-text {
        background: #78be21;
        color: white;
    }

    .active .page-link {
        background-color: #78be21 !important;
        border-color: #78be21 !important;
    }
</style>
