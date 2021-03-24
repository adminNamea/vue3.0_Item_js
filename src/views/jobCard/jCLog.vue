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
    <div class="cardG">
      <card
        style="min-height: 7vw; width: 55%"
        :top="false"
        :hed="false"
        class="top"
      >
        <van-cell title="时间筛选：">
          <span class="round" @click="showTime = true" style="color: #000">{{
            date
          }}</span>
        </van-cell>
      </card>
      <card
        style="min-height: 7vw; width: 40%"
        :top="false"
        :hed="false"
        class="top"
      >
        <van-cell title="修改编辑：" @click="cardClick">
          <template #right-icon>
            <van-icon size="4vw" :name="icon" />
          </template>
        </van-cell>
      </card>
    </div>
    <card
      class="stations"
      :top="false"
      :hed="false"
      @click="cardClick"
      v-for="(item, index) in stationList"
      :key="index"
    >
      <div class="left">
        时间：{{ filterTime(item.start_time, "HH:MM") }}-{{
          filterTime(item.end_time, "HH:MM")
        }}
      </div>
      <div class="right">
        <div class="icon"></div>
      </div>
      <div class="upDate">
        <span></span>
        <span> {{ item.type_name }}</span>
      </div>
      <van-cell v-if="item.type == 5">
        <template #title>
          项目：<span style="color: #969799">{{
            item.ax_item_number + item.item_name
          }}</span>
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          类型：<span style="color: #969799">{{
            item.description_name || item.group_description
          }}</span>
        </template>
      </van-cell>
      <van-cell v-if="item.type == 5">
        <template #title>
          派工日期：<span style="color: #969799">{{
            item.promise_work_time
          }}</span>
        </template>
      </van-cell>
      <van-cell v-if="item.type == 5 || item.type == 4">
        <template #title>
          加班类型：<span style="color: #969799">{{ item.ot_name }}</span>
        </template>
      </van-cell>
      <van-cell>
        <template #title>
          备注：<span style="color: #969799">{{ item.description }}</span>
        </template>
      </van-cell>
    </card>
    <van-empty
      v-if="stationList.length == 0"
      image="error"
      description="暂无数据"
    />
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
      icon: require("@/assets/img/编辑.png"),
      date: this.filterTime(new Date(), "YYYY-mm-dd"),
    };
  },
  created() {
    const cardItem =
      JSON.parse(sessionStorage.getItem("cardItem")) || this.getRequest();
    if (cardItem && cardItem.date) {
      this.date = cardItem.date;
      this.currentDate = new Date(this.date);
    }
    this.dialogConfirm();
  },
  methods: {
    // 时间筛选
    dialogConfirm() {
      this.date = this.filterTime(this.currentDate, "YYYY-mm-dd");
      this.showTime = false;
      this.getworkRecordDetails({
        date: this.date,
      });
    },
    getworkRecordDetails(obj) {
      this.$api.workRecordDetails(obj).then((res) => {
        console.log(res);
        this.stationList = res.data || [];
      });
    },
    cardClick() {
      this.$router.push({ name: "editJCard" });
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
.cardG {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
::v-deep() .top {
  .van-cell {
    font-size: 3vw;
    padding: 12px 16px;
    line-height: normal;
    .round {
      white-space: nowrap;
      background: #ffffff;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.08);
      border-radius: 4vw;
      padding: 0 2vw;
      height: 4vw;
      margin-right: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &__title {
      display: flex;
      align-items: center;
    }
    &__value {
      flex: 1.2;
      display: flex;
      align-items: center;
    }
  }
}
::v-deep() .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep() .van-dialog {
  border-radius: 1rem;
}
::v-deep() .stations {
  display: flex;
  justify-content: space-between;
  min-height: 3rem !important;
  .van-cell {
    display: inline-flex;
    width: 49%;
    font-size: 3vw;
    &__value {
      text-align: left;
    }
    &::after {
      display: none;
    }
  }
  .body {
    width: 100%;
    font-size: 3vw;
  }
}
.left {
  width: 30vw;
  margin-top: 2%;
  font-size: 3vw;
  padding: 0.2rem 1rem;
  border-radius: 0 1rem 1rem 0;
  color: #fff;
  background: rgba(67, 67, 67, 1);
}
.upDate {
  font-family: PingFang SC;
  color: #019fbb;
  display: flex;
  width: 100%;
  position: absolute;
  top: 1rem;
  span {
    flex: 1;
    &:nth-child(1) {
      padding-left: 2rem;
    }
  }
}
.right {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 1;
  .icon {
    position: relative;
    right: 1.5rem;
    top: 1rem;
    width: 1.3rem;
    height: 1.3rem;
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 50%;
  }
}
::v-deep() .van-icon {
  transform: scale(1.5);
}
</style>
