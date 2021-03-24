<template>
  <div class="order">
    <div v-sticky="true">
      <card style="overflow: visible" :top="false" :hed="false" class="top">
        <van-cell title="状态筛选:">
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
          <span
            class="round"
            @click="statuCheck(3)"
            :class="{ active: status === 3 }"
            >被拒审</span
          >
        </van-cell>
      </card>
      <p @click="$router.push({ name: 'addFees' })">
        添加费用：<img src="@/assets/img/addF.png" />
      </p>
    </div>
    <card
      :top="false"
      :hed="false"
      style="min-height: 1rem"
      v-if="stationList.length > 0"
    >
      <van-cell
        v-for="(item, index) in stationList"
        :key="index"
        @click="feesClick(item)"
        :title="'报销时间：' + item.create_time"
        is-link
        class="va"
        value="去查看"
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
      stationList: [],
      status: 1,
    };
  },
  created() {
    this.statuCheck(1);
  },
  methods: {
    statuCheck(status) {
      this.status = status;
      this.getReimbursement({
        status,
        sdate: this.sdate,
        edate: this.edate,
        order_item_id: sessionStorage.getItem("order_item_id"),
      });
    },
    getReimbursement(obj) {
      this.$api.Reimbursement(obj).then((res) => {
        this.stationList = res;
      });
    },
    feesClick(item) {
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
p {
  font-size: 3vw;
  display: flex;
  align-items: center;
  margin: 1rem 0 0 0;
  justify-content: flex-end;
  img {
    margin-top: 0.8vw;
    height: 5vw;
  }
}
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
  min-height: auto;
}
.va {
  font-size: 2.5vw;
  white-space: nowrap;
}
</style>
