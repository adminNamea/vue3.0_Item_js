<template>
  <div class="order">
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
        <select-a :h="1.8" v-model="value" :options="options"></select-a>
        <van-field v-model="keyword" placeholder="请输入搜索内容"> </van-field>
        <van-button @click="search" round>搜索</van-button>
      </div>
    </card>
    <card
      v-for="(item, index) in stationList"
      :key="index"
      @click="cardClick(item)"
      class="station"
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
  created() {
    this.statuCheck(1);
  },
  methods: {
    // 搜索
    search() {
      this.getOrderList({ [this.value]: this.keyword, status: 0 });
    },
    statuCheck(status) {
      this.status = status;
      this.getOrderList({
        status,
      });
    },
    getOrderList(obj) {
      this.$api.OrderApproval(obj).then((res) => {
        this.stationList = res;
      });
    },
    cardClick(item) {
      this.$router.push({ name: "approvalDetails" });
      sessionStorage.setItem("myOrder", 1);
      sessionStorage.setItem("order_id", item.order_id);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-icon {
  transform: scale(0.5);
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
</style>
