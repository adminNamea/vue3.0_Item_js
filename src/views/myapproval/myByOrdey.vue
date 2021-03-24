<template>
  <div class="order">
    <div v-sticky="true">
      <card
        style="overflow: visible; padding: 0.2rem 1rem"
        :top="false"
        :hed="false"
      >
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
            >被拒审{{ status === 3 ? "：" + stationList.length : "" }}</span
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
      :style="index == 0 ? '' : 'margin-top: 1rem;'"
      :top="false"
      :hed="false"
    >
      <div class="left">工单类型：{{ item.order_type_name }}</div>
      <div class="right">
        <img v-if="item.srt_order_id" src="@/assets/img/srt.png" />
        <div v-else class="icon"></div>
      </div>
      <div class="upDate">
        <span></span
        ><span>{{ item.create_time }} {{ item.aproval_status_name }}</span>
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
  name: "myByOrdey",
  components: {
    card,
    "select-a": select,
  },
  data() {
    return {
      stationList: [],
      keyword: "",
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
  activated() {
    this.statuCheck(this.status);
  },
  methods: {
    // 搜索
    search() {
      this.getOrderList({ [this.value]: this.keyword, status: this.status });
    },
    statuCheck(status) {
      this.status = status;
      this.getOrderList({
        status,
      });
    },
    getOrderList(obj) {
      this.$api.OrderApproval(obj).then((res) => {
        console.log(res);
        this.stationList = res;
      });
    },
    cardClick(item) {
      this.$router.push({ name: "approvalDetails" });
      sessionStorage.setItem("approval", 1);
      sessionStorage.setItem("myOrder", 1);
      sessionStorage.setItem("order_id", item.order_id);
    },
  },
};
</script>

<style lang="scss" scoped>
@include myStyle;
</style>
