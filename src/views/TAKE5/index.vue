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
      style="overflow: visible; padding: 0.2rem 1.2rem"
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
      <div class="flex hed">
        <span>工单号：{{ item.order_number }}</span>
        <span>AX工单号：{{ item.ax_number }}</span>
      </div>
      <div class="flex">
        <span>提交时间：{{ item.order_number }}</span>
        <span>take5标识码：{{ item.ax_number }}</span>
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
    this.l_sdate = this.filterTime(
      new Date(
        new Date().getTime() - 3600 * 24 * 30 * 1000
      ).toLocaleDateString(),
      "YYYY-mm-dd"
    );
    this.l_edate = this.filterTime(
      new Date().toLocaleDateString(),
      "YYYY-mm-dd"
    );
    this.statuCheck(1);
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
      this.$router.push({ name: "workDetails" });
      sessionStorage.setItem("order_id", item.order_id);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep() .van-icon {
  transform: scale(0.5);
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
::v-deep() .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep() .van-dialog {
  border-radius: 1rem;
}
.stations {
  font-size: 0.8rem;
  .flex {
    font-size: 0.8rem;
    padding: 0.3rem 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      flex: 1;
    }
  }
  .hed {
    font-size: 0.9rem;
    color: #ffffff;
    font-weight: 600;
    padding: 0.2rem 1rem;
    background: #434343;
  }
}
::v-deep() .van-cell {
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
    margin-right: 0.2rem;
    margin-left: 0.2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
  }
  &__title {
    width: 22%;
    flex: none;
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

::v-deep() .van-field {
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
    ::v-deep() .cell {
      font-weight: normal;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      border-radius: 1rem;
      width: 5rem;
      font-size: 0.81rem;
    }
  }
}
</style>
