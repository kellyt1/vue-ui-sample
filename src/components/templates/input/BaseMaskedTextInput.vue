<template>

    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-input :id="id" v-model="text" 
                v-bind="attrs"
                :state="v.$dirty ? !v.$error : null"
                v-on="listeners"
                :data-test="slug"
                :readonly="plaintext"
                :required="!v.required"
                v-mask="mask"
                masked="false">
            </b-form-input>
        </template>
    </form-group>
    
</template>

<script>
import _ from "lodash"

export default {

    
    props: {
        value: [String, Number],
        v: [Object],
        label: [String],
        tip: [String],
        slug: [String],
        plaintext: Boolean,
        mask: [String],
        setId: [String]
    },
    computed: {
        text: {
            get() {
                return this.value;
            },
            set(value) {
                this.v.$touch();
                this.$emit("input", value);
            }
        },
        id() {
            if (this.setId === null) {
                return _.uniqueId('masktext')
            } else {
                return this.setId
            }
        },  
    }
}
</script>
<style>
.form-group > label {
    font-weight: 750;
}
</style>