<template>
  <div class="feesDetails">
    <card :top="false" :hed="false">
      <div class="right">
        <img src="@/assets/img/工单信息.png" />
      </div>
      <p>项目名：{{ itemDetails.item_name }}</p>
      <div class="flex">
        <span>工单号：{{ itemDetails.order_number }}</span>
        <span>AX工单号：{{ itemDetails.ax_number }}</span>
      </div>
      <div class="flex">
        <span>提交人：{{ itemDetails.name_cn }}</span>
        <span>状态：{{ itemDetails.is_agree == 1 ? "同意" : "未同意" }}</span>
      </div>
      <span
        class="end"
        @click="$router.push({ name: 'index' })"
        style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
        >返回首页</span
      >
    </card>
    <card :top="false" :hed="false">
      <div class="item" v-for="(v, i) in itemDetails.list" :key="i">
        <p>
          <span style="font-size: 0.8rem; color: #333333"
            >{{ v.parentName }}：{{ v.type_name }}</span
          ><span>金额：{{ v.cost }}</span>
        </p>
        <p>
          <span>报销时间：{{ v.date }}</span
          ><span>是否公司代付：{{ v.is_company_pay == 1 ? "是" : "否" }}</span>
        </p>
      </div>
    </card>
    <card :hed="false" :top="false">
      <div class="left">备注</div>
      <van-field
        v-model="note"
        label="审批步骤"
        class="textarea"
        type="textarea"
      />
    </card>
    <div class="b_fixed" v-if="myFees != 1">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(1)"
        >同意</van-button
      >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(0)"
        >不同意</van-button
      >
    </div>
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
      itemDetails: {},
      note: "",
      myFees: sessionStorage.getItem("myFees"),
    };
  },
  created() {
    this.init();
  },
  methods: {
    onSubmit(is_agree) {
      this.$api
        .approval({ faile_note: this.note, is_agree })
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    init() {
      this.$api
        .resumeDetails()
        .then((res) => {
          this.itemDetails = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  font-family: AlibabaPuHuiTi;
}
.b_fixed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 49%;
  }
}
.end {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}
.flex {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  span {
    flex: 1;
    margin-bottom: 0.1rem;
  }
}
.card {
  overflow: visible !important;
  padding: 0 1rem 1rem 1rem;
}
.right {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  img {
    height: 4rem;
    transform: scale(1.07);
  }
}
p {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}
.item {
  padding-bottom: 1rem;
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.1);
  p {
    margin: 0;
    padding-top: 1rem;
    display: flex;
    align-items: center;
    font-size: 0.65rem;
    span {
      flex: 1;
      font-family: PingFang SC;
      font-weight: bold;
      color: #666666;
    }
  }
}
.textarea {
  padding-left: 0;
  ::v-deep() .van-field__control {
    color: #666666;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
    border-radius: 0.08rem;
    height: 5rem;
  }
}
.left {
  margin: 4% 0 2% -1rem;
  display: inline-block;
  font-size: 1rem;
  font-size: 1.1rem;
  padding: 0.3rem 1rem;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
  color: #ffffff;
}
</style>
