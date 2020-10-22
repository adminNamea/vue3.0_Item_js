<template>
  <div class="faultMsg">
    <card :hed="false">
      <p>零件问题</p>
      <van-field
        v-model="form.issue_part_number"
        label="造成问题零件号："
        placeholder="必填"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.issue_parts_count"
        label="造成问题零件数量："
        placeholder="必填"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.issue_part_name"
        label="零件名称："
        placeholder="必填"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.issue_group_number"
        label="所属组件号码："
        placeholder="必填"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.issue_group_name"
        label="组件名称："
        placeholder="必填"
        :rules="[{ required: true }]"
      />
      <van-cell title="耐久性指示器：">
        <van-switch
          :active-value="1"
          :inactive-value="0"
          v-model="form.issue_make_inoperable"
          active-color="#FDDD34"
        />
      </van-cell>
      <van-field
        v-model="form.issue_discription"
        label="损坏原因："
        placeholder="必填"
        :rules="[{ required: true }]"
      />
      <van-cell
        title="零件问题列表："
        @click="$emit('update:comName', 'qList')"
        is-link
        value-class="issue"
        ><div>{{ form.cate_name_cn }}-{{ form.issue_reason_code }}</div>
        <div>{{ form.issue_name }}-{{ form.issue_code }}</div></van-cell
      >
    </card>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";

export default {
  components: {
    card,
  },
  props: {
    comName: {
      default: "",
      type: String,
    },
    form: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      order_item_id: sessionStorage.getItem("order_item_id"),
    };
  },
};
</script>
<style lang='scss' scoped>
.issue {
  display: flex;
  margin-left: -0.75rem;
  justify-content: space-between;
}
/deep/.van-cell .van-cell__title {
  color: #000;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  flex: none;
  width: 30%;
  display: flex;
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
  padding: 0 1rem;
  margin: 0;
  font-size: 1rem;
  span {
    float: right;
    margin-right: 1.5rem;
  }
}
</style>
