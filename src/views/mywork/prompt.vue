<template>
  <div class="prompt">
    <card :hed="false">
      <p>
        注意事项
        <span
          @click="$router.push({ name: 'index' })"
          style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
          >返回首页</span
        >
      </p>
      <van-cell
        title="1.请在出发前通知客户预计到达时间和了解配件需求"
      ></van-cell>
      <van-cell title="2.确认车辆状况（轮胎，油，故障灯）"></van-cell>
      <van-cell title="3.确认零件准备情况"></van-cell>
      <van-cell title="4.确认工具齐备和状况"></van-cell>
    </card>
    <card :hed="false" :top="false">
      <p>备注</p>
      <van-cell :title="'备注详情：' + $route.params.order_note"></van-cell>
    </card>
    <div v-sticky>
      <van-button
        round
        block
        @click="onSubmit"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="submit"
        >已知悉</van-button
      >
    </div>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";

export default {
  props: {
    form: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  components: {
    card,
  },
  methods: {
    // 提交
    onSubmit() {
      sessionStorage.setItem("approval", 0);
      this.$router.replace({ name: "workDetails" });
    },
  },
};
</script>
<style lang='scss' scoped>
.checkIcon {
  /deep/ .van-cell__value {
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
/deep/.van-cell .van-cell__title {
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
/deep/ .van-cell__value {
  font-size: 0.8rem;
}
/deep/ .van-field__control {
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
.textarea {
  height: 7rem;
  /deep/ .van-field__body,
  /deep/ .van-field__control {
    height: 100%;
    overflow: visible;
  }
}
</style>
