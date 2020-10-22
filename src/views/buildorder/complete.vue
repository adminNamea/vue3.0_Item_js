<template>
  <div class="other">
    <card title="工单类型：">
      <p>
        完成
        <span
          @click="$router.push({ name: 'index' })"
          style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
          >返回首页</span
        >
      </p>
      <van-cell title="客户：" :value="form.custom_name"></van-cell>
      <van-cell title="客户编号：" :value="form.custom_number"></van-cell>
      <van-cell title="客户反馈：" :value="form.order_reason"></van-cell>
      <van-cell title="机身编号：" :value="form.serial_number"></van-cell>
      <van-cell title="机型：" :value="form.model"></van-cell>
      <van-cell title="机器地点：" :value="form.m_location"></van-cell>
      <van-cell title="PL机器位置：" :value="form.pl_location"></van-cell>
      <van-cell title="联系人：" :value="form.contact_name"></van-cell>
      <van-cell title="联系电话：" :value="form.phone"></van-cell>
    </card>
    <div style="margin-top: 1rem">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit"
        >完成</van-button
      >
    </div>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import { Dialog, Toast } from "vant";

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
      Toast.loading({
        message: "正在提交",
        forbidClick: true,
      });
      this.form.station.forEach((s) => {
        if (typeof s.user_id !== "string") {
          s.user_id = s.user_id.join(",");
          s.item_key = s.item_key.join(",");
        }
      });
      this.$api
        .addOrder(this.form)
        .then((res) => {
          Toast.clear();
          Dialog({ message: res.msg });
          this.$router.push({ name: "myorder" });
        })
        .catch((message) => {
          Toast.clear();
          Dialog({ message });
        });
    },
  },
};
</script>
<style lang='scss' scoped>
/deep/.van-cell .van-cell__title {
  color: #000;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  flex: none;
  width: 20%;
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
p {
  margin: 0;
  margin-top: 1rem;
  margin-left: 1rem;
  font-size: 1rem;
  span {
    float: right;
    margin-right: 1.5rem;
  }
}
</style>
