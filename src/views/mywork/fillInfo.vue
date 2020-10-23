<template>
  <div class="fillInfo">
    <van-form @submit="onSubmit">
      <card :hed="false">
        <p>填写回访联系人信息</p>
        <van-field v-model="log_contacts" label="联系人姓名：" />
        <van-field v-model="log_phone" label="电话：" />
        <van-field v-model="log_machine_no" label="机器编号：" />
      </card>
      <div class="b_fixed">
        <van-button
          round
          block
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
  },
  data() {
    return {
      log_contacts: sessionStorage.getItem("log_contacts"),
      log_machine_no: sessionStorage.getItem("log_machine_no"),
      log_phone: sessionStorage.getItem("log_phone"),
      order_id: sessionStorage.getItem("order_id"),
    };
  },
  methods: {
    // 提交
    onSubmit() {
      this.$api
        .upOrderContacts({
          order_id: this.order_id,
          log_contacts: this.log_contacts,
          log_machine_no: this.log_machine_no,
          log_phone: this.log_phone,
        })
        .then((res) => {
          Dialog.alert({
            message: res.msg,
          }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep.van-cell .van-cell__title {
  color: #000;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  width: 25%;
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
::v-deep .van-cell__value {
  font-size: 0.8rem;
}
::v-deep .van-field__control {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  background: rgba(249, 249, 250, 1);
  box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
  border-radius: 0.08rem;
}
p {
  padding: 0 1rem;
  margin: 0;
  font-size: 1rem;
  span {
    float: right;
    margin-right: 1.5rem;
  }
}
</style>
