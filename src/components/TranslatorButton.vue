<template>
  <img
      :src="logo"
      class="translator_button"
      @mouseup.stop="e => e"
      @click.stop="handleClick"
   alt="">
</template>

<script>
import logo from '@/assets/icon-32.png'

export default {
  name: "Translator-button",
  data: () => ({
    logo
  }),
  methods: {
    handleClick() {
      this.$emit('click')
    }
  }
}
</script>
