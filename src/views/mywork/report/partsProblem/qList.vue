<template>
  <div>
    <div class="top">
      <van-icon
        @click="$emit('update:comName', 'faultMsg')"
        name="arrow-left"
      />
      <van-field v-model="keyword" placeholder="请输入关键字"></van-field>
      <van-button
        native-type="button"
        size="small"
        @click="getPartsIssueList({ keyword })"
        round
        >搜索</van-button
      >
    </div>
    <treeSelect
      :left="leftList"
      @leftclick="leftClick"
      @rightclick="rightClick"
      :right="rightData"
    ></treeSelect>
  </div>
</template>

<script>
import treeSelect from "@/components/treeSelect/index.vue";
import { Dialog } from "vant";

export default {
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
  components: {
    treeSelect,
  },
  data() {
    return {
      leftList: [],
      rightData: [],
      keyword: "",
    };
  },
  created() {
    this.getPartsIssueCate();
  },
  methods: {
    leftClick(v) {
      this.getPartsIssueList(v);
    },
    rightClick({ right }) {
      this.form.parts_issue_list_id = right.list_id;
      this.form.cate_name_cn = right.issue_reason_desc;
      this.form.issue_reason_code = right.issue_reason_code;
      this.form.issue_name = right.issue_name;
      this.form.issue_code = right.issue_code;
      this.$emit("update:comName", "faultMsg");
    },
    getPartsIssueCate() {
      this.$api
        .getPartsIssueCate()
        .then((res) => {
          this.leftList = res.map((v) => ({ ...v, text: v.cate_name_cn }));
          this.getPartsIssueList(this.leftList[0]);
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    getPartsIssueList(item) {
      this.$api
        .getPartsIssueList(item)
        .then((res) => {
          this.rightData = res.map((v) => ({ ...v, text: v.issue_name }));
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
/deep/ .van-field {
  width: 80%;
  padding: 0.1rem 1rem;
  box-shadow: 0 0.1rem 0.3rem 0.1rem rgba(0, 0, 0, 0.08);
  border-radius: 1rem;
}
/deep/ .van-button {
  height: 1.9rem;
  width: 3.5rem;
  box-shadow: 0 0.1rem 0.3rem 0.1rem rgba(0, 0, 0, 0.08);
}
</style>
