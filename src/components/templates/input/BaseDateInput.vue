<template>

    <form-group :validator="v" :label="label" :label-for="id"
        :description="tip ? tip : 'Format: YYYY-MM-DD.'">
        <template slot-scope="{ attrs, listeners }">
            <date-picker :id="id" v-model="text"
                v-bind="attrs"
                :state="v.$dirty ? !v.$error : null"
                v-on="listeners"
                :config="options"
                :data-test="slug"
                :required="!v.required"
                :disabled = "disabled === true"
            >
            </date-picker>
        </template>
    </form-group>

</template>

<script>
import _ from "lodash"
import datePicker from 'vue-bootstrap-datetimepicker';
import 'pc-bootstrap4-datetimepicker/build/css/bootstrap-datetimepicker.css';

export default {
    components: {
        datePicker,
    },
    props: {
        value: [String, Number],
        v: [Object],
        label: [String],
        tip: [String],
        slug: [String],
        plaintext: Boolean,
        disabled: Boolean,
        setId: [String]
    },
    data() {
        return {
            options: {
                format: 'YYYY-MM-DD',
                useCurrent: false,
            },
        }
    },
    computed: {
        id() {
            if (this.setId === null) {
                return _.uniqueId('date')
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
<style>
    .form-group > label {
        font-weight: 750;
    }
    input:not(:focus) {
        box-shadow: 0 0 #ced4da;
    }
    .is-invalid input {
        border-color: #dc3545;
        padding-right: calc(1.5em + 0.75rem);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545' viewBox='0 0 12 12'%3e%3ccircle cx='6' cy='6' r='4.5'/%3e%3cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3e%3ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    .is-invalid input:focus {
        border-color: #dc3545;
        -webkit-box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
        box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25);
    }
    .is-valid input {
        border-color: #408600;
        padding-right: calc(1.5em + 0.75rem);
        background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
        background-repeat: no-repeat;
        background-position: right calc(0.375em + 0.1875rem) center;
        background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
    }
    .is-valid input:focus {
        border-color: #408600;
        -webkit-box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
        box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
    }
</style>