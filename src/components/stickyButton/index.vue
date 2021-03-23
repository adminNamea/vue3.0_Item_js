<template>
  <div :class="direction">
    <slot>
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onClick"
        >{{ name }}</van-button
      >
    </slot>
  </div>
</template>
<script>
import { ref, onActivated, onDeactivated } from "vue";

export default {
  emits: {
    // 没有验证
    click: null,
  },
  props: {
    name: {
      default: "",
      type: String,
    },
    sticky: {
      default: "bottom",
      type: String,
    },
  },
  setup(q) {
    const direction = q.sticky === "top" ? "top-sticky" : "end-sticky";
    const displayVideoInline = ref(false);
    onDeactivated(() => {
      displayVideoInline.value = true;
    });
    onActivated(() => {
      displayVideoInline.value = false;
    });
    return {
      direction,
      displayVideoInline,
    };
  },
  methods: {
    onClick() {
      this.$emit("click");
    },
  },
};
</script>

<style lang="scss" scoped>
.top-sticky,
.end-sticky {
  position: sticky;
  left: 0;
  background-color: rgba(249, 249, 250, 1);
  padding: 1rem;
  z-index: 2;
}
.top-sticky {
  top: -1px;
}
.end-sticky {
  bottom: -1px;
}
</style>
