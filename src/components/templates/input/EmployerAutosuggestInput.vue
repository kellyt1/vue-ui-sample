<template>

    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <vue-autosuggest
                    v-model="text"
                    :componentAttrIdAutosuggest="id + '-autosuggest'"
                    @selected="onSelected"
                    :suggestions="filtered"
                    :input-props="{id: id, class: 'form-control'}"
                    :getSuggestionValue="getSuggestionValue"
                    :should-render-suggestions="(size, loading) => size >= 0 && !loading && value !== ''"
                    ref="autocomplete"
                    :required="!v.required"
                    class="autosuggest"
            >
                <template slot-scope="{suggestion}">
                    <div>{{ suggestion.item.name }}</div>
                </template>
                <template slot="after-suggestions">
                    <p v-if="filtered.length == 0" style="text-align: center;">No Results</p>
                </template>
            </vue-autosuggest>
        </template>
    </form-group>
    
</template>

<script>
import _ from "lodash"
import { VueAutosuggest } from 'vue-autosuggest';
import axios from "axios"
import axiosRetry from 'axios-retry'

axiosRetry(axios, { retries: 3,
    retryDelay: axiosRetry.exponentialDelay  })

export default {
    components: {
        VueAutosuggest
    },
    props: {
        value: [String, Number],
        v: [Object],
        label: [String],
        tip: [String],
        setId: [String],
    },
    data() {
        return {
            filtered: [],
            employer: null
        }
    },
    computed: {
        text: {
            get() {
                return this.value;
            },
            set(value) {
                this.v.$touch();
                this.$emit("input", value);
                this.filteredOptions(value)
            }
        },
        id() {
            if (this.setId === null) {
                return _.uniqueId('emp')
            } else {
                return this.setId
            }
        },
    },
    methods: {
        filteredOptions(val) {
            let filtered = []
            if(!val){
                this.filtered = []
            } else {
                axios.get(`${process.env.VUE_APP_API_BASE_URL}/Employer/public/${val}`, { ignoreHeader: true })
                    .then(response => {
                        filtered = response.data
                        if (response.data.length > 0) {
                            this.filtered = [{ data: Object.freeze(filtered)}]
                        } else {
                            this.filtered = [];
                        }
                    })
            }
        },
        getSuggestionValue(item) {
            return item.item.name;
        },
        onSelected(...args) {
            const item = args[0]
            if(!item){
                return
            }
            this.employer = {
                employerId : item.item.employerId,
                applicatonId: null,
                name: item.item.name,
                streetAddress: item.item.streetAddress,
                city: item.item.city,
                state: item.item.state,
                postalCode: item.item.postalCode,
                phone: item.item.phone,
                emailAddress: item.item.emailAddress,
                startDate: item.item.startDate,
                endDate: item.item.endDate
            }
            this.$emit("employer", this.employer);
        }
    },
}
</script>
<style>
.form-group > label {
    font-weight: 750;
}

.autosuggest.autosuggest__input-open {
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
}

.autosuggest__results-container {
    position: relative;
    width: 100%;
}

.autosuggest__results {
    font-weight: 300;
    margin: 0;
    position: absolute;
    z-index: 10000001;
    width: 100%;
    border: 1px solid #e0e0e0;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    background: white;
    padding: 0px;
    overflow: scroll;
    max-height: 200px;
}

.autosuggest__results ul {
    padding-left: 0;
    margin: 0;
}

.autosuggest__results ul li {
    list-style: none;
}

.autosuggest__results .autosuggest__results_item {
    cursor: pointer;
    padding: 15px;
}

.autosuggest ul:nth-child(1) > .autosuggest__results_title {
    border-top: none;
}

.autosuggest__results .autosuggest__results_title {
    color: gray;
    font-size: 11px;
    margin-left: 0;
    padding: 15px 13px 5px;
    border-top: 1px solid lightgray;
}

.autosuggest__results .autosuggest__results_item:active,
.autosuggest__results .autosuggest__results_item:hover,
.autosuggest__results .autosuggest__results_item:focus,
.autosuggest__results .autosuggest__results_item.autosuggest__results_item-highlighted {
    background-color: #ddd;
}
</style>