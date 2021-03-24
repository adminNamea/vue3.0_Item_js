<template>
  <div class="order">
    <div v-sticky="true">
      <card style="overflow: visible" :top="false" :hed="false" class="top">
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
            >未完成</span
          >
          <span
            class="round"
            @click="statuCheck(1)"
            :class="{ active: status === 1 }"
            >未审批</span
          >
          <span
            class="round"
            @click="statuCheck(2)"
            :class="{ active: status === 2 }"
            >已审批</span
          >
        </van-cell>
      </card>
    </div>
    <card
      :top="false"
      :hed="false"
      style="min-height: 1rem"
      v-if="stationList.length > 0"
    >
      <div v-if="status === 0">
        <van-cell
          v-for="(item, index) in stationList"
          :key="index"
          @click="cardClick(item)"
          :title="item.name_cn"
          is-link
          class="va"
          :value="
            item.status == 0
              ? '未录入'
              : item.status == 1
              ? '已录入未满8小时'
              : '已录入满8小时'
          "
        ></van-cell>
      </div>
      <div v-else>
        <van-cell
          v-for="(item, index) in nameList"
          :key="index"
          value-class="va1"
        >
          <span
            v-for="(v, i) in item"
            :key="i"
            @click="cardClick(v)"
            style="color: #3b54d4"
            >{{ v.name_cn }}</span
          >
        </van-cell>
      </div>
    </card>
    <van-empty v-else image="error" description="暂无数据" />
  </div>
</template>
<script>
import card from "@/components/card/index.vue";

export default {
  name: "cardApproval",
  components: {
    card,
  },
  data() {
    return {
      nameList: {},
      showTime: false,
      currentDate: new Date(),
      stationList: [],
      date: this.filterTime(new Date(), "YYYY-mm-dd"),
      status: 0,
    };
  },
  activated() {
    this.statuCheck(this.status);
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
        this.nameList = {};
        if (this.status !== 0) {
          if (window.innerWidth > 375) {
            const length = Math.ceil(res.length / 3);
            for (let i = 0; i <= length; i++) {
              const a = res[i * 3 + 0] || {};
              const b = res[i * 3 + 1] || {};
              const c = res[i * 3 + 2] || {};
              this.nameList[i] = [a, b, c];
            }
          } else {
            const length = Math.ceil(res.length / 2);
            for (let i = 0; i < length; i++) {
              const a = res[i * 2 + 0] || {};
              const b = res[i * 2 + 1] || {};
              this.nameList[i] = [a, b];
            }
          }
        }
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
.va1 {
  display: flex;
  span {
    flex: 1;
    &:nth-child(2) {
      text-align: center;
    }
    &:nth-child(3) {
      text-align: right;
    }
  }
}
.top {
  @include myStyle;
  padding: 0 1rem 1rem 1rem;
  margin-top: 0;
}
body .card {
  margin-top: 0;
}
.va {
  font-size: 2.5vw;
}
</style>
