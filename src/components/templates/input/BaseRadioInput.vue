<template>
    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-radio-group :id="id" :value="value"
                           :state="v.$dirty ? !v.$error : null"
                           v-bind="attrs"
                           v-on="listeners"
                           :data-test="slug"
                           :required="!v.required"
                           @input="updateValue" @change="updateValue" :options="options">
            </b-form-radio-group>
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
                    return _.uniqueId('radio')
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
<style>
    .custom-control-input.is-valid ~ .custom-control-label {
        color: #408600;
    }

    .custom-control-input.is-valid:checked ~ .custom-control-label::before {
        border-color: #408600;
        background-color: #408600;
    }
</style>