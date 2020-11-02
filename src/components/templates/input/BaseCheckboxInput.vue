<template>
    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-checkbox :id="id" :v-model="value"
                          :state="v.$dirty ? !v.$error : null"
                          v-bind="attrs"
                          v-on="listeners"
                          :data-test="slug"
                          :required="!v.required"
                          :checked="value"
                          @input="updateValue" @change="updateValue" >
            </b-form-checkbox>
        </template>
    </form-group>
</template>

<script>
    import _ from "lodash"

    export default {
        props: {
            value: [Boolean],
            label: [String],
            tip: [String],
            slug: [String],
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
                    return _.uniqueId('radios')
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
