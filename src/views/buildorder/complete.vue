<template>
  <div class="other">
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
};
</script>
<style lang='scss' scoped>
::v-deep().van-cell .van-cell__title {
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
::v-deep() .van-cell__value {
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
