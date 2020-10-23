<template>
  <div class="info">
    <van-form @submit="onSubmit" ref="form">
      <card class="body" title="工单类型：">
        <template #right>
          <select-a v-model="form.order_type" :options="options"></select-a>
        </template>

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
      </card>
      <div style="margin-top: 1rem">
        <van-button
          round
          block
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          native-type="submit"
          >下一步</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import select from "@/components/select/index.vue";

export default {
  setup() {
    const options = [
      { value: 1, text: "保修工单" },
      { value: 2, text: "内部" },
      { value: 3, text: "外部" },
      { value: 4, text: "保养" },
      { value: 5, text: "交机前检查" },
      { value: 6, text: "交机" },
      { value: 7, text: "大修" },
    ];
    return {
      options,
    };
  },
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
    "select-a": select,
  },
  methods: {
    tpMachineInfo() {
      this.$api.tpMachineInfo(this.form.serial_number).then((res) => {
        this.form.delivery_time = res.create_time;
        this.form.pl_location = res.location;
      });
    },
    isModel() {
      if (this.form.itemList) {
        this.form.item.forEach((it) => {
          const item = this.form.itemList.find(
            (m) => m.item_name === it.item_name
          );
          const model = item.model.find(
            (m) => m.model_name === this.form.model
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
    onSubmit() {
      this.$emit("next");
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep .van-field__label {
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
::v-deep .van-field__control {
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
