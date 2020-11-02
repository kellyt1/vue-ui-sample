<template>

    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-textarea :id="id" v-model="text" 
                v-bind="attrs"
                :state="v.$dirty ? !v.$error : null"
                rows="3"
                :data-test="slug"
                max-rows="8"
                :required="!v.required"
                v-on="listeners">
            </b-form-textarea>
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
        setId: [String]
    },
    computed: {
        id() {
            if (this.setId === null) {
                return _.uniqueId('paraInput')
            } else {
                return this.setId
            }
        },
        text: {
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