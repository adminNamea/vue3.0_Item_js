<template>
  <div class="other">
    <p>
      其他
      <span
        @click="$router.push({ name: 'index' })"
        style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
        >返回首页</span
      >
    </p>
    <van-cell title="是否停机:" class="checkIcon">
      <div @click="form.is_halt = 1">
        <span>是</span>
        <img :src="form.is_halt === 1 ? checkedIcon : noCheckedIcon" />
      </div>
      <div @click="form.is_halt = 2">
        <span>否</span>
        <img :src="form.is_halt === 2 ? checkedIcon : noCheckedIcon" />
      </div>
    </van-cell>
    <van-field v-model="form.service_car" label="服务车牌号：" />
    <van-field
      class="textarea"
      v-model="form.order_reason"
      type="textarea"
      label="客户反馈："
    />
    <van-field
      class="textarea"
      v-model="form.order_note"
      type="textarea"
      label="备注："
    />
  </div>
</template>
<script>
export default {
  props: {
    form: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      // 选中图标
      checkedIcon: require("@/assets/img/选中.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/未选中.png"),
    };
  },
};
</script>
<style lang='scss' scoped>
::v-deep() .checkIcon {
  .van-cell__value {
    display: flex;
    flex: none;
    justify-content: space-between;
    width: 30%;
    div {
      display: flex;
      align-items: center;
    }
    span {
      margin: 0.1rem 1rem 0 0;
    }
    img {
      height: 1rem;
      width: 1rem;
    }
  }
}
::v-deep() .van-cell .van-cell__title {
  color: #000;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  width: 40%;
  &::before {
    content: "";
    position: absolute;
    left: 1.1rem;
    top: 1rem;
    border-radius: 50%;
    width: 0.7rem;
    height: 0.7rem;
    background-color: #fad23f;
  }
}
::v-deep() .van-cell__value {
  font-size: 0.8rem;
}
::v-deep() .van-field__control {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  background: rgba(249, 249, 250, 1);
  box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
  border-radius: 0.08rem;
}
p {
  padding: 1rem 1rem;
  margin: 0;
  font-size: 1rem;
  span {
    float: right;
    margin-right: 1.5rem;
  }
}
::v-deep() .textarea {
  height: 7rem;
  .van-field__body,
  .van-field__control {
    height: 100%;
    overflow: visible;
  }
}
</style>
