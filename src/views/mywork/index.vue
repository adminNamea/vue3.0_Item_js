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
        style="margin-top: 0rem; overflow: visible; padding: 0.2rem 1rem"
        :top="false"
        :hed="false"
      >
        <van-cell title="时间筛选:">
          <span class="round" @click="showDate(1)" style="color: #000">{{
            l_sdate
          }}</span>
          <van-icon :name="require('@/assets/img/to.png')" />
          <span class="round" @click="showDate(2)" style="color: #000">{{
            l_edate
          }}</span>
        </van-cell>
        <van-cell title="状态筛选:">
          <span
            class="round"
            @click="statuCheck(1)"
            :class="{ active: status === 1 }"
            >未完成{{ status === 1 ? "：" + stationList.length : "" }}</span
          >
          <span
            class="round"
            @click="statuCheck(2)"
            :class="{ active: status === 2 }"
            >已完成{{ status === 2 ? "：" + stationList.length : "" }}</span
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
      class="station"
      :style="index == 0 ? 'margin-top: 0rem;' : ''"
      :top="false"
      :hed="false"
    >
      <div class="left">工单类型：{{ item.order_type_name }}</div>
      <div class="right">
        <img v-if="item.srt_order_id" src="@/assets/img/srt.png" />
        <div v-else class="icon"></div>
      </div>
      <div class="upDate">
        <span></span><span>{{ item.create_time }} {{ item.status_name }}</span>
      </div>
      <div class="body">
        <div class="flex">
          <span>工单号：{{ item.order_number }}</span>
          <span>AX工单号：{{ item.ax_number }}</span>
        </div>
        <div class="flex">
          <span>机器型号：{{ item.model }}</span>
          <span>机身编号：{{ item.serial_number }}</span>
        </div>
        <div class="flex">
          <span>机器地点：{{ item.m_location }}</span>
        </div>
        <div class="flex">
          <span>PL机器位置：{{ item.pl_location }}</span>
        </div>
        <div class="flex">
          <span>客户：{{ item.custom_name }}</span>
          <span>客户编号：{{ item.custom_number }}</span>
        </div>
        <div class="flex">
          <span>客户反馈：{{ item.order_reason }}</span>
        </div>
        <div class="flex">
          <span>联系人：{{ item.contact_name }}</span>
          <span>联系电话：{{ item.phone }}</span>
        </div>
      </div>
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
  name: "mywork",
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
      l_sdate: "",
      l_edate: "",
      status: 1,
      value: "machine_model",
      dateType: 1,
      options: [
        { text: "机型", value: "machine_model" },
        { text: "机身编号", value: "machine_number" },
        { text: "工单号", value: "order_number" },
        { text: "AX工单号", value: "ax_number" },
      ],
    };
  },
  created() {
    const date = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const d = date.getDate();
    this.l_sdate = this.filterTime(new Date(y, m - 1, d), "YYYY-mm-dd");
    this.l_edate = this.filterTime(new Date(y, m, d), "YYYY-mm-dd");
    this.statuCheck(1);
  },
  activated() {
    this.statuCheck(this.status);
  },
  methods: {
    // 时间筛选
    dialogConfirm() {
      if (this.dateType === 1) {
        this.l_sdate = this.filterTime(this.currentDate, "YYYY-mm-dd");
      } else {
        this.l_edate = this.filterTime(this.currentDate, "YYYY-mm-dd");
      }
      this.showTime = false;
      this.getOrderList({
        l_sdate: this.l_sdate,
        l_edate: this.l_edate,
        status: this.status,
      });
    },
    // 搜索
    search() {
      this.getOrderList({ [this.value]: this.keyword, status: 0 });
    },
    statuCheck(status) {
      this.status = status;
      this.getOrderList({
        status,
        l_sdate: this.l_sdate,
        l_edate: this.l_edate,
      });
    },
    getOrderList(obj) {
      this.$api.MyOrderList(obj).then((res) => {
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
        name: "prompt",
        params: { order_note: item.order_note },
      });
      sessionStorage.setItem("order_id", item.order_id);
    },
  },
};
</script>

<style lang="scss" scoped>
@include myStyle;
.station {
  margin-top: 1rem;
}
</style>
