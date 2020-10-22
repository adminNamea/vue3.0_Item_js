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
        <span
          class="round"
          @click="statuCheck(3)"
          :class="{ active: status === 3 }"
          >被审批{{ status === 3 ? "：" + stationList.length : "" }}</span
        >
      </van-cell>
      <div class="flex">
        <select-a :h="1.8" v-model="value" :options="options"></select-a>
        <van-field v-model="keyword" placeholder="请输入搜索内容"> </van-field>
        <van-button @click="search" round>搜索</van-button>
      </div>
    </card>
    <card
      v-for="(item, index) in stationList"
      :key="index"
      @click="cardClick(item)"
      class="stations"
      :top="false"
      :hed="false"
    >
      <div class="left">
        {{ item.order_number
        }}<span>({{ filterBl(item.ax_number_code) }})</span>
      </div>
      <div class="right">{{ item.create_time }}</div>
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
    this.sdate = this.filterTime(
      new Date(
        new Date().getTime() - 3600 * 24 * 30 * 1000
      ).toLocaleDateString(),
      "YYYY-mm-dd"
    );
    this.edate = this.filterTime(new Date().toLocaleDateString(), "YYYY-mm-dd");
    this.statuCheck(1);
  },
  methods: {
    filterBl(value) {
      if (String(value).length < 2) {
        return `00${value}`;
      }
      if (String(value).length < 3) {
        return `0${value}`;
      }
      return value;
    },
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
      this.$api.Reimbursement(obj).then((res) => {
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
      sessionStorage.setItem("myFees", 1);
      sessionStorage.setItem("resume_aproval_id", item.resume_aproval_id);
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
  & .select {
    position: relative;
    .cell {
      font-weight: normal;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.08);
      border-radius: 1rem;
      width: 5rem;
      font-size: 0.81rem;
      .title {
        margin-top: 0.15rem;
      }
      img {
        top: 0.3rem;
        right: 0;
      }
    }
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
    justify-content: space-between;
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
/deep/ .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
/deep/ .van-dialog {
  border-radius: 1rem;
}
/deep/ .van-field {
  padding: 1rem 0 1rem 1rem;
  &__value {
    width: 90%;
    background: #ffffff;
    box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.08);
    border-radius: 0.8rem;
    padding: 0.2rem 0 0.2rem 0.5rem;
  }
}
/deep/ .van-icon {
  transform: scale(0.5);
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .van-button {
    height: 2rem;
    width: 6.5rem;
  }
  .select {
    width: 20%;
    /deep/ .cell {
      font-weight: normal;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      border-radius: 1rem;
      width: 5rem;
      font-size: 0.81rem;
    }
  }
}
.stations {
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 3rem !important;
  padding-left: 1rem;
  /deep/ .body {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .left {
      font-family: PingFang SC;
      font-weight: bold;
      color: #019fbc;
      span {
        margin-left: 0.5rem;
        color: rgba(0, 0, 0, 0.3);
      }
    }
    .right {
      display: inline-block;
      font-size: 1.1rem;
      padding: 0.2rem 1rem;
      border-radius: 1rem 0 0 1rem;
      background: #434343;
      color: #ffffff;
    }
  }
}
</style>
