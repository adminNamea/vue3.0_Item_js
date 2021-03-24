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
        <span>状态：{{ itemDetails.is_agree == 1 ? "已同意" : "未同意" }}</span>
      </div>
      <div class="flex">
        <span>报销时间：{{ itemDetails.date }}</span>
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
        <p v-if="v.is_company_pay == 1">
          <span></span><span>是否公司代付：是</span>
        </p>
      </div>
    </card>
    <card :hed="false" :top="false">
      <div class="left">备注</div>
      <van-field
        v-model="itemDetails.faile_note"
        label="审批备注"
        :readonly="myFees == 1 || itemDetails.is_aproval == 1"
        class="textarea"
        type="textarea"
      />
    </card>
    <div
      v-sticky="false"
      class="b_fixed"
      v-if="myFees != 1 && itemDetails.is_aproval != 1"
    >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(0)"
        >不同意</van-button
      >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(1)"
        >同意</van-button
      >
    </div>
    <div
      v-sticky="false"
      v-if="
        myFees == 1 && itemDetails.is_agree == 0 && itemDetails.is_aproval == 1
      "
    >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="upFees"
        >去修改</van-button
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
      myFees: sessionStorage.getItem("myFees"),
    };
  },
  created() {
    if (!this.myFees) {
      this.myFees = this.getRequest().myFees;
    }
    if (!sessionStorage.getItem("resume_aproval_id")) {
      sessionStorage.setItem(
        "resume_aproval_id",
        this.getRequest().resume_aproval_id
      );
    }
    this.init();
  },
  methods: {
    onSubmit(is_agree) {
      this.$api
        .approval({ faile_note: this.itemDetails.faile_note, is_agree })
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    upFees() {
      sessionStorage.setItem("feesList", JSON.stringify(this.itemDetails));
      this.$router.push({
        name: "addFees",
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
  padding: 0 1rem 0.5rem 1rem;
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
  padding-bottom: 0;
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.1);
  &:last-child {
    border-bottom: 0;
  }
  p {
    margin: 0;
    padding-top: 0.5rem;
    display: flex;
    align-items: center;
    font-size: 0.65rem;
    span {
      flex: 1;
      font-family: PingFang SC;
      font-weight: bold;
      color: #666666;
      &:nth-child(1) {
        flex: 2;
      }
    }
  }
}
::v-deep() .textarea {
  padding-left: 0;
  .van-field__control {
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
