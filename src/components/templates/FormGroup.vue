<template>
<div>
  <b-form-group
    :invalid-feedback="firstErrorMessage"
    :state="isValid"
    :label="fullLabel"
    :label-class="[!this.validator.required ? 'label-required' : '']"
    v-bind="$attrs">

    <slot
      :attrs="{ state: isValid }"
      :listeners="{ input: () => preferredValidator.$touch() }" />
  </b-form-group>
</div>
</template>

<script>
import { singleErrorExtractorMixin } from "vuelidate-error-extractor";

export default {
  inheritAttrs: false,
  extends: singleErrorExtractorMixin,
  computed: {
    fullLabel: function() {
      //if (!this.validator.required) {
      //  return this.label + " (required)";
      //} else {
        return this.label;
      //}
    }
  }
};
</script>