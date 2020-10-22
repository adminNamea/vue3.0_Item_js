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
    <card
      style="overflow: visible; padding: 0.2rem 1rem"
      :top="false"
      :hed="false"
      class="top"
    >
      <van-cell title="时间筛选:">
        <span class="round" @click="showDate" style="color: #000">{{
          date
        }}</span>
      </van-cell>
      <van-cell title="状态筛选:">
        <span
          class="round"
          @click="statuCheck(0)"
          :class="{ active: status === 0 }"
          >未完成{{ status === 0 ? "：" + stationList.length : "" }}</span
        >
        <span
          class="round"
          @click="statuCheck(1)"
          :class="{ active: status === 1 }"
          >已完成{{ status === 1 ? "：" + stationList.length : "" }}</span
        >
        <span
          class="round"
          @click="statuCheck(2)"
          :class="{ active: status === 2 }"
          >已审批{{ status === 2 ? "：" + stationList.length : "" }}</span
        >
      </van-cell>
    </card>
    <card
      class="station"
      :top="false"
      :hed="false"
      v-if="stationList.length > 0"
    >
      <van-cell
        v-for="(item, index) in stationList"
        :key="index"
        @click="cardClick(item)"
        :title="item.name_cn"
        is-link
        :value="
          item.status == 0
            ? '未录入'
            : item.status == 1
            ? '已录入未满8小时'
            : '已录入满8小时'
        "
      ></van-cell>
    </card>
    <van-empty v-else image="error" description="暂无数据" />
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
      showTime: false,
      currentDate: new Date(),
      stationList: [],
      date: this.filterTime(new Date(), "YYYY-mm-dd"),
      status: 0,
    };
  },
  created() {
    if (sessionStorage.getItem("cardItem")) {
      const obj = sessionStorage.getItem("cardItem");
      this.date = JSON.parse(obj).date;
      this.currentDate = new Date(this.date);
    }
    this.statuCheck(0);
  },
  methods: {
    // 时间筛选
    dialogConfirm() {
      this.date = this.filterTime(this.currentDate, "YYYY-mm-dd");
      this.showTime = false;
      this.getWorkRecord({
        date: this.date,
        approval_status: this.status,
      });
    },
    statuCheck(approval_status) {
      this.status = approval_status;
      this.getWorkRecord({
        approval_status,
        date: this.date,
      });
    },
    getWorkRecord(obj) {
      this.$api.workRecord(obj).then((res) => {
        this.stationList = res;
      });
    },
    // 时间选择
    showDate() {
      this.showTime = true;
    },
    cardClick(item) {
      this.$router.push({
        name: "cardDetails",
      });
      const { userid: user_id } = item;
      sessionStorage.setItem(
        "cardItem",
        JSON.stringify({ date: this.date, user_id })
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.top {
  /deep/ .van-cell {
    font-size: 1.1rem;
    overflow: visible;
    padding: 0.5rem 0 0 0;
    .round {
      white-space: nowrap;
      background: #ffffff;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.08);
      border-radius: 0.8rem;
      height: 1.6rem;
      margin-right: 2.5%;
      margin-left: 0.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    &__title {
      width: 22%;
      flex: none;
      white-space: nowrap;
      overflow: visible;
      font-weight: 600;
    }
    &__value {
      display: flex;
      align-items: center;
      flex: none;
      width: 80%;
    }
    &::after {
      display: none;
    }
    .active {
      color: #000;
      background: linear-gradient(267deg, #fbd01f, #fee568);
    }
  }
}
/deep/ .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
/deep/ .van-dialog {
  border-radius: 1rem;
}
.station {
  display: flex;
  justify-content: space-between;
  min-height: 3rem !important;
  /deep/ .body {
    width: 100%;
  }
}
</style>
