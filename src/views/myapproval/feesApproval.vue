<template>
  <div class="order">
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      title="时间筛选"
      show-cancel-button
    >
      <div class="timeTile">
        <div>年</div>
        <div>月</div>
        <div>日</div>
      </div>
      <van-datetime-picker
        v-model="currentDate"
        :show-toolbar="false"
        type="date"
      />
    </van-dialog>
    <div v-sticky="true">
      <card
        style="overflow: visible; padding: 0.2rem 1rem"
        :top="false"
        :hed="false"
      >
        <van-cell title="时间筛选:">
          <span class="round" @click="showDate(1)" style="color: #000">{{
            sdate
          }}</span>
          <van-icon :name="require('@/assets/img/to.png')" />
          <span class="round" @click="showDate(2)" style="color: #000">{{
            edate
          }}</span>
        </van-cell>
        <van-cell title="状态筛选:">
          <span
            class="round"
            @click="statuCheck(1)"
            :class="{ active: status === 1 }"
            >未审批{{ status === 1 ? "：" + stationList.length : "" }}</span
          >
          <span
            class="round"
            @click="statuCheck(2)"
            :class="{ active: status === 2 }"
            >已审批{{ status === 2 ? "：" + stationList.length : "" }}</span
          >
        </van-cell>
        <div class="flex">
          <select-a :h="'5vw'" v-model="value" :options="options"></select-a>
          <van-field v-model="keyword" placeholder="请输入搜索内容">
          </van-field>
          <van-button @click="search" round>搜索</van-button>
        </div>
      </card>
    </div>
    <card
      v-for="(item, index) in stationList"
      :key="index"
      @click="cardClick(item)"
      class="stations"
      :style="index == 0 ? '' : 'margin-top: 1rem;'"
      :top="false"
      :hed="false"
    >
      <div class="left">{{ item.name_cn }}（{{ item.order_number }}）</div>
      <div class="right">{{ item.item_name }}</div>
    </card>
    <van-empty
      v-if="stationList.length === 0"
      image="error"
      description="暂无数据"
    />
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import select from "@/components/select/index.vue";

export default {
  name: "feesApproval",
  components: {
    card,
    "select-a": select,
  },
  data() {
    return {
      showTime: false,
      currentDate: new Date(),
      stationList: [],
      keyword: "",
      sdate: "",
      edate: "",
      status: 1,
      value: "serial_model",
      dateType: 1,
      options: [
        { text: "机型", value: "serial_model" },
        { text: "机身编号", value: "serial_number" },
        { text: "工单号", value: "order_number" },
        { text: "AX工单号", value: "ax_number" },
        { text: "客户名", value: "custom_name" },
        { text: "客户编号", value: "custom_number" },
      ],
    };
  },
  created() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    this.sdate = this.filterTime(new Date(y, m - 1, d), "YYYY-mm-dd");
    this.edate = this.filterTime(new Date(y, m, d), "YYYY-mm-dd");
    this.statuCheck(1);
  },
  activated() {
    this.statuCheck(this.status);
  },
  methods: {
    // 时间筛选
    dialogConfirm() {
      if (this.dateType === 1) {
        this.sdate = this.filterTime(this.currentDate, "YYYY-mm-dd");
      } else {
        this.edate = this.filterTime(this.currentDate, "YYYY-mm-dd");
      }
      this.showTime = false;
      this.getReimbursement({
        sdate: this.sdate,
        edate: this.edate,
        status: this.status,
      });
    },
    // 搜索
    search() {
      this.getReimbursement({ [this.value]: this.keyword, status: 0 });
    },
    statuCheck(status) {
      this.status = status;
      this.getReimbursement({
        status,
        sdate: this.sdate,
        edate: this.edate,
      });
    },
    getReimbursement(obj) {
      this.$api.ReimbursementApprovalList(obj).then((res) => {
        this.stationList = res;
      });
    },
    // 时间选择
    showDate(type) {
      this.dateType = type;
      this.showTime = true;
    },
    cardClick(item) {
      this.$router.push({
        name: "feesDetails",
      });
      sessionStorage.setItem("myFees", 0);
      sessionStorage.setItem("resume_aproval_id", item.resume_aproval_id);
    },
  },
};
</script>

<style lang="scss" scoped>
@include myStyle;
::v-deep() .stations {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem !important;
  padding-left: 1rem;
  .body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      font-family: PingFang SC;
      font-weight: bold;
      flex: 1;
      color: rgba(101, 101, 101, 1);
    }
    .right {
      display: inline-block;
      font-size: 1.1rem;
      padding: 0.2rem 1rem;
      border-radius: 1rem 0 0 1rem;
      flex: 0.6;
      background: #434343;
      color: #ffffff;
    }
  }
}
</style>
