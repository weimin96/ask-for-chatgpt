<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <div class="modal-logo">
          <img :src="logo" alt="logo" width="16" height="16" />
          <div class="modal-title">{{ name }}</div>
        </div>
      </div>
      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      logo: require("@/assets/icon-48.png"),
      name: chrome.i18n.getMessage("name")
    };
  },
  methods: {
    closeModal() {
      this.$emit("closeModal");
    }
  }
});
</script>

<style lang="scss">
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
  .modal-container {
    width: 550px;
    background-color: #fff;
    border-radius: 5px;
    max-width: 90%;
    max-height: 90%;
    overflow: auto;
    position: relative;
    box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.16);
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #ccc;
      .modal-logo {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        margin-right: auto;
        img {
          margin-right: 5px;
        }
        .modal-title {
          margin: 0;
        }
      }
      .modal-close {
        background-color: transparent;
        border: none;
        color: #ccc;
        font-size: 1.5em;
        cursor: pointer;
        &:hover {
          color: #000;
        }
      }
    }
    .modal-content {
      padding: 10px;
    }
  }
}
</style>
