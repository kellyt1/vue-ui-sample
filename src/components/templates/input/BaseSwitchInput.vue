<template>

    <form-group :validator="v" :label="label" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-checkbox :id="id" v-model="bool" switch
                v-bind="attrs"
                :state="v.$dirty ? !v.$error : null"
                v-on="listeners">
                {{label}}
            </b-form-checkbox>
        </template>
    </form-group>
    
</template>

<script>
import _ from "lodash"

export default {

    props: {
        value: [Boolean],
        v: [Object],
        label: [String],
        tip: [String]
    },
    computed: {
        id() {
            return _.uniqueId('switch')
        },
        bool: {
            get() {
                return this.value;
            },
            set(value) {
                this.v.$touch();
                this.$emit("input", value);
            }
        }   
    }
}
</script>