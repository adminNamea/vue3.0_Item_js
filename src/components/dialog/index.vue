<template>
  <div class="dialog">
    <van-dialog
      v-model:show="showD"
      :close-on-click-overlay="true"
      :show-confirm-button="false"
    >
      <template #title>
        <div class="title">
          <span>{{ title }}</span>
          <img
            v-if="del"
            src="@/assets/img/del.png"
            @click="$emit('update:show', false)"
          />
        </div>
      </template>
      <slot></slot>
    </van-dialog>
  </div>
</template>

<script>
export default {
  props: {
    show: {
      default: false,
      type: Boolean,
    },
    title: {
      default: "提示",
      type: String,
    },
    del: {
      default: true,
      type: Boolean,
    },
  },
  data() {
    return {};
  },
  computed: {
    showD: {
      get() {
        return this.show;
      },
      set(value) {
        this.$emit("update:show", value);
      },
    },
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 0.8rem;
  justify-content: space-between;
  color: #fff;
  display: flex;
  align-items: center;
  img {
    height: 1.5rem;
    width: 1.5rem;
  }
}
::v-deep .van-dialog__header {
  background-color: #434343;
  padding: 0.2rem 1rem 0.5rem 1rem;
  height: 1.2rem;
}
// ::v-deep .van-dialog__content {
//   height: 60%;
// }
::v-deep .van-dialog {
  width: 90%;
  // height: 65%;
  overflow: hidden;
  border-radius: 0.5rem;
}
</style>
