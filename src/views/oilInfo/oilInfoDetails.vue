<template>
  <div class="other">
    <card :hed="false">
      <p>
        油样详细信息
        <span
          v-if="form.edit == 1"
          @click="$router.push({ name: 'scanCode' })"
          style="color: rgba(250, 207, 6, 1); font-size: 0.9rem"
          >修改</span
        >
      </p>
      <van-cell :title="'填写人：' + form.name_cn"></van-cell>
      <van-cell :title="'客户名：' + form.custom_number"></van-cell>
      <van-cell :title="'客户编号：' + form.custom_number"></van-cell>
      <van-cell :title="'联系人：' + form.contact_name"></van-cell>
      <van-cell :title="'电话号码：' + form.custom_phone"></van-cell>
      <van-cell :title="'AX号码：' + form.ax_number"></van-cell>
      <van-cell :title="'工作单：' + form.sos_number_code"></van-cell>
      <van-cell :title="'省份：' + form.jobsite_state"></van-cell>
      <van-cell :title="'地区：' + form.jobsite_name"></van-cell>
      <van-cell :title="'取样日期：' + form.sampling_date"></van-cell>
      <van-cell :title="'寄出日期：' + form.send_date"></van-cell>
      <van-cell :title="'机时数（维修报告）：' + form.run_hour"></van-cell>
      <van-cell :title="'机时数（油样报告）：' + form.run_hour"></van-cell>
      <van-cell :title="'部件/方位：' + form.part_name"></van-cell>
      <van-cell :title="'油用时数：' + form.use_hour"></van-cell>
      <van-cell :title="'油品品牌：' + form.brand_name"></van-cell>
      <van-cell :title="'粘度等级：' + form.level_name"></van-cell>
      <van-cell
        :title="
          form.is_change_brand == 1 ? '是否更换油样：是' : '是否更换油样：否'
        "
      ></van-cell>
      <van-cell
        :title="
          form.is_change_filter == 1 ? '是否更换滤芯：是' : '是否更换滤芯：否'
        "
      ></van-cell>
      <van-cell
        :title="form.priority == 1 ? '是否优先处理：是' : '是否优先处理：否'"
      ></van-cell>
      <van-cell :title="'备注：' + form.note"></van-cell>
    </card>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";

export default {
  components: {
    card,
  },
  data() {
    return {
      form: {},
    };
  },
  created() {
    this.$api.sosDetails().then((res) => {
      console.log(res);
      this.form = res;
    });
  },
};
</script>
<style lang='scss' scoped>
::v-deep() .van-cell .van-cell__title {
  color: #000;
  padding-left: 1.5rem;
  font-size: 0.8rem;
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
p {
  margin: 0;
  padding-left: 1rem;
  font-size: 1rem;
  span {
    float: right;
    margin-right: 1rem;
  }
}
</style>
