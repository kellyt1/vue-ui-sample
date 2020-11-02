<template>
<b-alert variant="danger" dismissible :show = hasErrors >
    <strong>The form contains the following errors, please correct these before continuing</strong>
    <div v-for="(error, index) in activeErrorMessages" :key="index">
      <slot
        :error-message="error"
        :error="activeErrors[index]">
        {{ error }}
      </slot>
    </div>
</b-alert>
</template>


<script>
import { multiErrorExtractorMixin } from 'vuelidate-error-extractor'

export default {
  inheritAttrs: false,
  extends: multiErrorExtractorMixin
}
</script>