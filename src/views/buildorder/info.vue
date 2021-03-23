<template>
  <div class="info">
    <p>机器信息</p>
    <van-field
      v-model="form.serial_number"
      placeholder="请输入机身编号  (必填)"
      label="机身编号："
      @blur="tpMachineInfo"
      :rules="[{ required: true }]"
    />
    <van-field
      v-model="form.model"
      label="机型："
      placeholder="请输入机型  (必填)"
      @input="isModel"
      :rules="[{ required: true }]"
    />
    <van-field
      v-model="form.m_location"
      label="机器地址："
      placeholder="请输入机器地址  (必填)"
      :rules="[{ required: true }]"
    />
    <van-field
      v-model="form.total_hour"
      placeholder="请输入运行小时数  (必填)"
      label="运行小时数："
      :rules="[{ required: true }]"
    />
    <van-field v-model="form.delivery_time" label="交机日期：" readonly />
    <van-field v-model="form.pl_location" readonly label="PL机器地址：" />
    <p>客户信息</p>
    <van-field
      v-model="form.custom_name"
      label="客户名："
      placeholder="请输入客户名  (必填)"
      :rules="[{ required: true }]"
    />
    <van-field v-model="form.custom_number" label="客户编号：" />
    <van-field v-model="form.custom_phone" label="客户电话：" />
    <van-field
      v-model="form.contact_name"
      label="联系人："
      placeholder="请输入联系人  (必填)"
      :rules="[{ required: true }]"
    />
    <van-field
      v-model="form.phone"
      label="联系人电话："
      placeholder="请输入联系人电话  (必填)"
      :rules="[{ required: true }]"
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
  methods: {
    tpMachineInfo() {
      this.$api
        .tpMachineInfo(this.form.serial_number)
        .then((res) => {
          if (res.delivery_time) this.form.delivery_time = res.delivery_time;
          if (res.m_location) this.form.pl_location = res.m_location;
          if (res.phone) this.form.phone = res.phone;
          if (res.contact_name) this.form.contact_name = res.contact_name;
          if (res.custom_name) this.form.custom_name = res.custom_name;
          if (res.total_hour) this.form.total_hour = res.total_hour;
          if (res.model) this.form.model = res.model;
        })
        .catch((e) => console.log(e));
    },
    isModel() {
      if (this.form.itemList) {
        const modelN = this.form.model;
        this.form.item.forEach((it) => {
          const item = this.form.itemList.find(
            (m) => m.item_name === it.item_name
          );
          const model = item.model.find(
            (m) => modelN >= m.model_start_number && modelN < m.model_end_number
          );
          if (model && model.item_model_cost_time) {
            it.type_model_id = model.type_model_id;
            it.item_cost_time = model.item_model_cost_time;
          } else {
            it.item_cost_time = item.item_cost_time;
          }
        });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep() .van-field__label {
  width: 35%;
  padding-left: 1.5rem;
  color: #000;
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
::v-deep() .van-field__control {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  &:not([readonly]) {
    background: rgba(249, 249, 250, 1);
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.08rem;
  }
}
p {
  margin-top: 1rem;
  margin-left: 1rem;
  font-size: 1rem;
}
</style>
