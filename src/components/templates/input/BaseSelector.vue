<template>
    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-select :id="id" :value="value"
                :state="v.$dirty ? !v.$error : null"
                v-bind="attrs"
                v-on="listeners"
                :data-test="slug"
                :required="!v.required"
                @input="updateValue" @change="updateValue" :options="options">
                <template v-slot:first>
                    <option :value="null" disabled>-- Please select an option --</option>
                </template>
            </b-form-select>
        </template>
    </form-group>
</template>

<script>
import _ from "lodash"

export default {
    props: {
        value: [String, Number],
        label: [String],
        tip: [String],
        slug: [String],
        options: Array,
        v: [Object],
        setId: [String]
    },
    created() {
        if (this.value != null) {
            this.updateValue(this.value)
        }
    },
    computed: {
        id() {
            if (this.setId === null) {
                return _.uniqueId('selector')
            } else {
                return this.setId
            }
        },
    },
    methods: {
        updateValue(value) {
            this.$emit('input', value)
        }
    }
}
</script>