<template>
    <span style="display:inline-block; margin-bottom:20px;">
        <label style="margin-bottom:1px;"><strong>{{label}}</strong></label>
        <br/>{{value}}
    </span>
</template>

<script>
export default {
    props: {
        value: [String, Number],
        label: [String],
    }
}
</script>