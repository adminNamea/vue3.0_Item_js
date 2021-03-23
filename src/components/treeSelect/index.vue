<template>
  <div class="treeSelect">
    <div class="left">
      <div
        :class="{ act: index == li }"
        @click="$emit('leftclick', v), (li = index)"
        v-for="(v, index) in left"
        :key="index"
      >
        {{ v.text }}
      </div>
    </div>
    <div class="right">
      <div
        :class="{ act: index == ri }"
        @click="$emit('rightclick', { left: left[li], right: v }), (ri = index)"
        v-for="(v, index) in right"
        :key="index"
      >
        {{ v.text }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  setup(p) {
    return {
      ...p,
    };
  },
  data() {
    return {
      li: 0,
      ri: -1,
    };
  },
};
</script>

<style lang="scss" scoped>
.treeSelect {
  margin-top: 1rem;
  display: flex;
  .left {
    flex: 1;
    background: #ffffff;
    height: 41rem;
    overflow: auto;
    div {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.8rem 0;
      border-bottom: 0.01rem solid rgba(0, 0, 0, 0.08);
      &:last-child {
        border-bottom-color: rgba(0, 0, 0, 0);
      }
      color: #434343;
      &.act {
        color: #f0be00;
      }
    }
  }
  .right {
    height: 41rem;
    overflow: auto;
    flex: 4;
    div {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 45%;
      margin: 0.3rem 0 0.5rem 1.2rem;
      height: 2.2rem;
      color: #434343;
      background: #ffffff;
      box-shadow: 0 0 0.5rem 0 rgba(0, 0, 0, 0.08);
      border-radius: 0.3rem;
      &.act {
        color: #f0be00;
      }
    }
  }
}
</style>
