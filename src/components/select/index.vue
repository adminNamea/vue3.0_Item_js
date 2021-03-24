<template>
  <div class="select" :style="{ height: hs }">
    <van-overlay v-model:show="show" @click="onClick" />
    <div class="cell" @click.stop="onClick" :style="is ? 'z-index:3' : ''">
      <div class="title" :style="{ height: hs }">
        <div>
          <span v-if="label">{{ label }}</span>
          <span>{{ title }}</span>
        </div>
        <img src="./img/drop_down_2.png" />
      </div>
      <div class="body" :style="is ? 'max-height: 10rem;' : 'max-height: 0'">
        <div
          v-for="(item, index) in options"
          :key="index"
          @click="select(item)"
        >
          {{ item.text }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    options: {
      default() {
        return [];
      },
      type: Array,
    },
    label: {
      default: "",
      type: String,
    },
    modelValue: {
      default: "",
      type: [Number, String],
    },
    disable: {
      default: false,
      type: Boolean,
    },
    h: {
      default: 1.2,
      type: [Number, String],
    },
  },
  data() {
    return {
      show: false,
      is: false,
      text: "请选择",
    };
  },
  computed: {
    hs() {
      if (typeof this.h === "string") {
        return this.h;
      }
      return `${this.h}rem`;
    },
    title() {
      const filterObj = this.options.find(
        (item) => item.value === this.modelValue
      );
      if (filterObj) {
        return filterObj.text;
      }
      return "请选择";
    },
  },
  methods: {
    onClick() {
      if (this.disable) {
        return;
      }
      this.is = !this.is;
      this.show = !this.show;
      this.$emit("click");
    },
    select(item) {
      this.$emit("update:modelValue", item.value);
      this.$emit("select", item);
    },
  },
};
</script>

<style lang="scss" scoped>
.select {
  height: 1rem;
  width: 100%;
}
::v-deep() .van-overlay {
  z-index: 2;
}
.cell {
  position: relative;
  z-index: 0;
  font-size: 0.7rem;
  width: 88%;
  transition: max-height 0.2s;
  overflow: hidden;
  background: linear-gradient(
    0deg,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 1) 100%
  );
  color: #343434;
  padding-left: 0.1rem;
  border-radius: 0.1rem;
  .body {
    position: relative;
    padding-left: 0.5rem;
    width: 100%;
    transition: max-height 0.2s;
    overflow: auto;
    text-align: left;
    div {
      padding: 0.2rem 0 0.1rem 0;
      border-bottom: 0.01rem solid rgba($color: #fff, $alpha: 0.5);
      &:last-child {
        border-bottom: 0;
      }
    }
  }
  .title {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 0.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  img {
    filter: contrast(0.5);
    height: 0.4rem;
  }
}
</style>
