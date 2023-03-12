<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2 class="modal-title">ChatGPT</h2>
        <button class="modal-close" @click.stop="closeModal">&times;</button>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue"

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    closeModal() {
      this.$emit("closeModal")
      console.log(this.visible)
    }
  }
})
</script>

<style>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
}

.modal-container {
  background-color: #fff;
  border-radius: 5px;
  box-shadow: none;
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #ccc;
}

.modal-title {
  margin: 0;
}

.modal-close {
  background-color: transparent;
  border: none;
  color: #ccc;
  font-size: 1.5em;
  cursor: pointer;
}

.modal-close:hover {
  color: #000;
}
</style>
