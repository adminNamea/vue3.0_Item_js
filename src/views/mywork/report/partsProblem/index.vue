<template>
  <van-form ref="form">
    <component :form="form" v-model:comName="comName" :is="comName"></component>
    <div v-sticky="false">
      <van-button
        v-if="comName == 'faultMsg'"
        round
        block
        @click="onSubmit"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="submit"
        >提交</van-button
      >
    </div>
  </van-form>
</template>

<script>
import { Dialog } from "vant";
import faultMsg from "./faultMsg.vue";
import qList from "./qList.vue";

export default {
  components: {
    faultMsg,
    qList,
  },
  data() {
    return {
      form: { issue_make_inoperable: 0, issue_name: "", issue_reason_desc: "" },
      comName: "faultMsg",
    };
  },
  created() {
    this.$api
      .getItemPartsIssue()
      .then((res) => {
        res.issue_make_inoperable = res.issue_make_inoperable || 0;
        this.form = res;
      })
      .catch((message) => {
        Dialog({ message });
      });
  },
  methods: {
    // 提交
    onSubmit() {
      this.$refs.form
        .validate()
        .then(() => {
          console.log(this.form);
          this.$api
            .addItemPartsIssue(this.form)
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
        })
        .catch(() => false);
    },
  },
};
</script>
