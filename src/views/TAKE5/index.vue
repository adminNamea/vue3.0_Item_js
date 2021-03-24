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
        class="top"
        style="overflow: visible; min-height: 1vw; margin-top: 0"
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
        <div class="flex" style="padding-bottom: 1vw">
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
      @click="cardClick(item.take_id)"
      class="stations"
      style="min-height: 2rem; margin-top: 0"
      :top="false"
      :hed="false"
    >
      <div class="flex hed">
        <span>工单号：{{ item.order_number }}</span>
        <span>AX工单号：{{ item.ax_number }}</span>
      </div>
      <div class="flex">
        <span>提交时间：{{ item.create_date }}</span>
        <span>take5标识码：{{ item.random_code }}</span>
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
  name: "TAKE5",
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
      value: "ax_number",
      dateType: 1,
      options: [
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
    this.sdate = this.filterTime(new Date(y, m - 1, d), "YYYY-mm-dd");
    this.edate = this.filterTime(new Date(y, m, d), "YYYY-mm-dd");
  },
  activated() {
    this.getTakeFiveList({
      sdate: this.sdate,
      edate: this.edate,
    });
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
      this.getTakeFiveList({
        sdate: this.sdate,
        edate: this.edate,
      });
    },
    // 搜索
    search() {
      this.getTakeFiveList({ [this.value]: this.keyword });
    },
    getTakeFiveList(obj) {
      this.$api.takeFiveList(obj).then((res) => {
        this.stationList = res;
      });
    },
    // 时间选择
    showDate(type) {
      this.dateType = type;
      this.showTime = true;
    },
    cardClick(id) {
      this.$router.push({ name: "take5ListDetails" });
      sessionStorage.setItem("take_id", id);
    },
  },
};
</script>

<style lang="scss" scoped>
@include myStyle;
.top {
  padding: 0 1rem;
}
.stations {
  margin: 0 0 1rem 0;
  .flex {
    color: #666666;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 2vw;
    padding: 0;
    span {
      word-break: break-all;
      padding: 1vw;
    }
    &.hed {
      height: auto;
      color: #ffffff;
      background: #434343;
      box-shadow: 0px 5px 18px 2px rgba(0, 0, 0, 0.08);
    }
  }
}
</style>
