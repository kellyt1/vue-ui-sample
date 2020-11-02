<template>
    <div class="card">
        <div class="card-header" tabindex="0">Type of License You are Applying For?</div>
        <div class="card-body">
            
            <b-row>
                <b-col>
                    Minnesota offers several variations of the Body Art license - what type are you applying for?
                </b-col>
            </b-row>

            <b-row class="mt-5">
                <b-col cols="12" lg="3" class="mb-2">
                    <p class="h4">Guest Technician</p>
                    <b-button variant="primary" @click="setCategory('GUEST')">Apply For Guest Technician</b-button>
                </b-col>
                <b-col cols="12" lg="6"><p class="text-muted">Information about the license type, links, fees can go here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum, purus molestie auctor interdum, odio felis feugiat lectus, et laoreet eros dui non nunc. Pellentesque ornare, diam a vehicula dapibus, lorem elit tincidunt purus, quis interdum purus ligula eget nunc. In hac habitasse platea dictumst. Vestibulum et tempus velit. Aliquam non sodales ipsum, et interdum dolor. Aenean eu dui et nibh eleifend tincidunt. Fusce tincidunt neque vel convallis consectetur. Aliquam ac feugiat purus, nec rutrum ipsum. Nam faucibus purus ut est faucibus commodo. Nunc lacus justo, consectetur ac mi id, tincidunt facilisis tortor.
                    Duis sit amet convallis neque. Sed sed dui congue, blandit tellus id, maximus libero. Phasellus et nisi urna. Maecenas quis dolor urna. Morbi iaculis cursus faucibus. Nunc porttitor sem diam, pretium lobortis metus suscipit non. Donec vitae varius risus, vel congue mauris.</p>
                </b-col>
            </b-row>
            <hr/>
            
            <b-row>
                <b-col cols="12" lg="3" class="mb-2">
                    <p class="h4">Temporary Technician</p>
                    <b-button variant="primary" @click="setCategory('TEMPORARY')">Apply For Temporary Technician</b-button>
                </b-col>
                <b-col cols="12" lg="6"><p class="text-muted">Information about the license type, links, fees can go here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum, purus molestie auctor interdum, odio felis feugiat lectus, et laoreet eros dui non nunc. Pellentesque ornare, diam a vehicula dapibus, lorem elit tincidunt purus, quis interdum purus ligula eget nunc. In hac habitasse platea dictumst. Vestibulum et tempus velit. Aliquam non sodales ipsum, et interdum dolor. Aenean eu dui et nibh eleifend tincidunt. Fusce tincidunt neque vel convallis consectetur. Aliquam ac feugiat purus, nec rutrum ipsum. Nam faucibus purus ut est faucibus commodo. Nunc lacus justo, consectetur ac mi id, tincidunt facilisis tortor.
                    Duis sit amet convallis neque. Sed sed dui congue, blandit tellus id, maximus libero. Phasellus et nisi urna. Maecenas quis dolor urna. Morbi iaculis cursus faucibus. Nunc porttitor sem diam, pretium lobortis metus suscipit non. Donec vitae varius risus, vel congue mauris.</p>
                </b-col>
            </b-row>
            <hr/>

            <b-row>
                <b-col cols="12" lg="3" class="mb-2">
                    <p class="h4">Technician</p>
                    <b-button variant="primary" @click="setCategory('FULL')">Apply For Technician</b-button>
                </b-col>
                <b-col cols="12" lg="6"><p class="text-muted">Information about the license type, links, fees can go here. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi interdum, purus molestie auctor interdum, odio felis feugiat lectus, et laoreet eros dui non nunc. Pellentesque ornare, diam a vehicula dapibus, lorem elit tincidunt purus, quis interdum purus ligula eget nunc. In hac habitasse platea dictumst. Vestibulum et tempus velit. Aliquam non sodales ipsum, et interdum dolor. Aenean eu dui et nibh eleifend tincidunt. Fusce tincidunt neque vel convallis consectetur. Aliquam ac feugiat purus, nec rutrum ipsum. Nam faucibus purus ut est faucibus commodo. Nunc lacus justo, consectetur ac mi id, tincidunt facilisis tortor.
                    Duis sit amet convallis neque. Sed sed dui congue, blandit tellus id, maximus libero. Phasellus et nisi urna. Maecenas quis dolor urna. Morbi iaculis cursus faucibus. Nunc porttitor sem diam, pretium lobortis metus suscipit non. Donec vitae varius risus, vel congue mauris.</p>
                </b-col>
            </b-row>

        </div>
    </div>

</template>
<script>
import { required } from 'vuelidate/lib/validators'

export default {
    data() {
        return {
            category: 'TECHNICIAN',
            subCategory: '',
        }
    },
    
    validations() {
        return {
            subCategory: { required },
            form: [ 'subCategory' ]
        }
    },

    methods: {
        setCategory(s) {
            this.subCategory = s;
        },

        validate() {
            let isValid = true
            if (!this.subCategory) {
                isValid = false
                this.showMissingCategory()
            }
            this.$emit('on-validate', this.$data, isValid)
            return isValid
        },

        showMissingCategory() {
            this.$bvModal.msgBoxOk('You must select a type of license before proceeding.', {
            title: 'Missing License Type',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'primary',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
            })
            .then(value => {
                // do nothing
            })
            .catch(err => {
                // An error occurred
            })
        }
    }
}
</script>
<style>
</style>
