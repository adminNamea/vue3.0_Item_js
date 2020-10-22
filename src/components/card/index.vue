<template>
  <div class="card" @click="$emit('click')">
    <div class="hed" v-if="hed">
      <span v-if="title">{{ title }}</span>
      <span style="float: right" v-if="rightTitle">{{ rightTitle }}</span>
      <div class="title">
        <slot name="title"></slot>
      </div>
      <div class="right">
        <slot name="right"></slot>
      </div>
    </div>
    <div class="body">
      <div class="top" v-if="top">
        <div v-for="item in 7" :key="item"></div>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    img: String,
    title: String,
    top: {
      default: true,
      type: Boolean,
    },
    rightTitle: String,
    hed: {
      default: true,
      type: Boolean,
    },
  },
};
</script>

<style lang="scss" scoped>
.card {
  overflow: hidden;
  position: relative;
  background: rgba(255, 255, 255, 1);
  border-radius: 0.5rem;
  min-height: 5rem;
  margin-top: 1rem;
  box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.08);
}
.body {
  .top {
    display: flex;
    justify-content: space-between;
    div {
      margin: 1rem;
      width: 1.2rem;
      height: 1.2rem;
      box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
      border-radius: 50%;
    }
  }
}
.hed {
  position: relative;
  .right {
    position: absolute;
    right: 1rem;
    top: 0.7rem;
    width: 6rem;
    height: 2rem;
  }
  text-align: left;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.5rem 1.1rem 0.5rem 1.1rem;
  height: 1.5rem;
}
</style>
