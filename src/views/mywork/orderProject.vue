<template>
  <div>
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      :title="
        timeType === 1
          ? '零件需求日期'
          : timeType === 2
          ? '零件领取日期'
          : timeType === 3
          ? '额外零件需求日期'
          : '额外零件来领取日期'
      "
      show-cancel-button
    >
      <div class="timeTile">
        <div>年</div>
        <div>月</div>
        <div>日</div>
        <div>时</div>
        <div>分</div>
      </div>
      <van-datetime-picker
        v-model="currentDate"
        :show-toolbar="false"
        type="datetime"
      />
    </van-dialog>
    <card class="station" :top="false" :hed="false">
      <h3>项目名：{{ stationList.item_name }}</h3>
      <p>
        项目编号：{{ stationList.ax_number_code }}
        <span
          @click="$router.push({ name: 'index' })"
          style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
          >返回首页</span
        >
      </p>
    </card>
    <card class="station" :top="false" :hed="false">
      <div class="left">报告</div>
      <van-cell
        :title="filterType(stationList.order_item_type)"
        @click="toReport(stationList.order_item_type)"
        :value="stationList.report_status == 1 ? '已填写' : '未填写'"
        is-link
      />
      <van-cell
        title="工单总工时"
        value
        @click="$router.push({ name: 'jCLog' })"
        is-link
      />
      <van-cell
        title="费用列表"
        value
        @click="$router.push({ name: 'feesList' })"
        is-link
      />
    </card>
    <card class="station" :top="false" :hed="false">
      <div class="left">零件</div>
      <van-cell
        title="零件需求日期"
        @click="showTimeDialog(1)"
        :value="stationList.deadline_parts_time || '未填写'"
        is-link
      />
      <van-cell
        title="零件领取日期"
        @click="showTimeDialog(2)"
        :value="stationList.real_parts_time || '未填写'"
        is-link
      />
      <van-cell title="零件清单" value="未录入" is-link />
    </card>
    <card class="station" :top="false" :hed="false">
      <div class="left">额外零件</div>
      <van-cell
        title="额外零件申请"
        @click="$router.push({ name: 'parts', params: { stationList } })"
        :value="stationList.extra_parts || '未填写'"
        is-link
      />
      <van-cell
        title="额外零件需求日期"
        @click="showTimeDialog(3)"
        :value="stationList.extra_deadline_parts_time || '未填写'"
        is-link
      />
      <van-cell
        title="额外零件来领取日期"
        @click="showTimeDialog(4)"
        :value="stationList.extra_real_parts_time || '未录入'"
        is-link
      />
    </card>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Dialog, Toast } from "vant";

export default {
  components: {
    card,
  },
  created() {
    Toast.loading({
      duration: 0,
      message: "加载中...",
      forbidClick: true,
      overlay: true,
    });
    const order_item_id = sessionStorage.getItem("order_item_id");
    this.$api
      .getItemDetails(order_item_id)
      .then((res) => {
        console.log(res);
        if (!res.order_item_type) {
          res.order_item_type = res.order_type;
        }
        this.stationList = res;
      })
      .catch((message) => {
        Dialog({ message });
      })
      .finally(() => Toast.clear());
  },
  data() {
    return {
      stationList: {},
      showTime: false,
      timeType: 1,
      currentDate: new Date(),
    };
  },
  methods: {
    filterType(value) {
      const obj = {
        4: "保养项目清单",
        5: "交机前检查报告",
        6: "交机报告",
        7: "大修报告",
      };

      return obj[value] || "维修报告";
    },
    // 报告跳转
    toReport(n) {
      const reportData =
        n === 4
          ? { title: "保养项目清单", value: "list" }
          : n === 5
          ? { title: "交机前检查报告", value: "" }
          : n === 6
          ? { title: "交机报告", value: "reportJ" }
          : { title: "维修报告", value: "reportW" };
      sessionStorage.setItem("reportData", JSON.stringify(reportData));
      this.$router.push({ name: "report" });
    },
    // 时间对话框弹出
    showTimeDialog(type) {
      this.showTime = true;
      this.timeType = type;
    },
    // 弹框确认
    dialogConfirm() {
      const time = [
        "deadline_parts_time",
        "real_parts_time",
        "extra_deadline_parts_time",
        "extra_real_parts_time",
      ];
      this.stationList[time[this.timeType - 1]] = this.filterTime(
        this.currentDate
      );
      this.$api
        .upItemParts(this.stationList)
        .then((res) => {
          Dialog({ message: res.msg });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep() .timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
.van-dialog {
  border-radius: 1rem;
}
.station {
  position: relative;
  border-radius: 0.8rem;
  overflow: hidden !important;
  padding-bottom: 1rem;
}
.left {
  margin: 3% 0 2% 0;
  display: inline-block;
  font-size: 1rem;
  padding: 0.2rem 1rem;
  left: 0;
  color: #fff;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
}

p,
h3 {
  margin: 0;
  padding: 1rem 1rem 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
