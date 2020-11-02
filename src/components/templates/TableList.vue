<template>
    <div>
        <b-table hover small responsive show-empty
            :id="slug"
            :fields="fields"
            :items="items"
            primary-key="id"
            :busy="isLoading">
            <template v-slot:cell(actions)="row">
                <b-button size="sm" @click="launchRenewal(row.item)" 
                    variant="danger"
                    class="mr-1" 
                    v-if="row.item.status === 'EXPIRED' && !row.item.pendingApplication">
                renew
                </b-button>
                <b-button size="sm" @click="launchRenewal(row.item)" 
                    variant="primary"
                    class="mr-1" 
                    v-if="isInRenewalPeriod(row.item)">
                renew
                </b-button>
                
            </template>
            <template v-slot:cell(pendingApplication)="data">
                {{ data.item.pendingApplication ? "Yes" : "No" }}
            </template>

            
            <template v-slot:no-data>
                <v-btn color="primary" @click="initialize">Reset</v-btn>
            </template>

            <template v-slot:empty="scope">
                <p>No applications found for this user.</p>
            </template>

            <div slot="table-busy" class="text-center text-danger my-2">
                <b-spinner class="align-middle" style="margin-right:5px; margin-top:12px;"></b-spinner>
                <strong>Loading, Please Wait...</strong>
            </div>  
        </b-table>
    </div>
</template>

<script>
import moment from 'moment'

export default {
    components: {
    },
    props: {
        items: Array,
        slug: [String],
        isLoading: Boolean,
    },
    data: () => ({
        fields: [
            {key: 'number', sortable: true, label: 'License #'},
            {key: 'formattedStatus', sortable: true, label: 'License Status'},
            {key: 'effectivePeriod', sortable: true, label: 'Dates Effective'},
            {key: 'formattedCategory', sortable: true, label: 'License Category'},
            {key: 'licenseType.description', sortable: true, label: 'License Type'},
            {key: 'pendingApplication', sortable: true, label: 'Pending Application', class: 'paCol'},
            {key: 'actions', label: 'Actions'}
        ],
    }),

    methods: {
        launchRenewal(item) {
            this.$router.push({ name: 'renewal', params: { token: item.id } })
        },

        isInRenewalPeriod(item) {
            if (item.status === 'ACTIVE' && item.pendingApplication === false) {
                
                const a = moment().add(1, 'months')
                const b = moment(item.expirationDate)
                return b <= a
            } else {
                return false
            }
        }
    }
}
</script>
<style>
.paCol { width: 15%; }
</style>