<template>

    <form-group :validator="v" :label="label" :label-for="id" :description="tip">
        <template slot-scope="{ attrs, listeners }">
            <b-form-input :id="id" v-model="text"
                v-bind="attrs"
                :state="v.$dirty ? !v.$error : null"
                v-on="listeners"
                :data-test="slug"
                :readonly="plaintext"
                :required="isRequired ? true : false"
                >
            </b-form-input>
        </template>
    </form-group>
    
</template>

<script>
import _ from "lodash"
 

export default {

    props: {
        value: [Number],
        v: [Object],
        label: [String],
        tip: [String],
        slug: [String],
        required: Boolean,
        plaintext: Boolean
    },
    data() {
      return {
        money: {
          decimal: '.',
          thousands: ',',
          prefix: '$ ',
          suffix: ' / hr',
          precision: 2,
          masked: false /* doesn't work with directive */
        }
      }
    },
    computed: {
        id() {
            return _.uniqueId('moneyInput')
        },
        text: {
            get() {
                return this.value;
            },
            set(value) {
                this.v.$touch();
                this.$emit("input", value);
            }
        },
        isRequired: {
            get() {
                return this.required
            }
        }   
    }
}
</script>
<style>
.form-group > label {
    font-weight: 750;
}
</style>