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
        style="min-height: 3rem; width: 55%"
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
        style="min-height: 3rem; width: 40%"
        :top="false"
        :hed="false"
        class="top"
      >
        <van-cell title="修改编辑：" @click="cardClick">
          <template #right-icon>
            <van-icon size="1.5rem" :name="icon" />
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
        时间：{{ filterTime(item.start_time, "HH:SS") }}-{{
          filterTime(item.end_time, "HH:SS")
        }}
      </div>
      <div class="right">
        <div class="icon"></div>
      </div>
      <div class="upDate">{{ item.type_name }}</div>
      <van-cell
        v-if="item.type == 5"
        title="项目："
        :value="item.item_name"
      ></van-cell>
      <van-cell title="类型：" :value="item.description_name"></van-cell>
      <van-cell
        v-if="item.type == 5"
        title="派工日期："
        :value="item.promise_work_time"
      ></van-cell>
      <van-cell
        v-if="item.type == 5 || item.type == 4"
        title="加班类型："
        :value="item.ot_name"
      ></van-cell>
      <van-cell title="备注：" :value="item.description"></van-cell>
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
    if (sessionStorage.getItem("cardItem")) {
      const obj = sessionStorage.getItem("cardItem");
      this.date = JSON.parse(obj).date;
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
.top {
  ::v-deep() .van-cell {
    font-size: 1.1rem;
    padding: 12px 16px;
    line-height: normal;
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
      display: flex;
      align-items: center;
      font-weight: 600;
    }
    &__value {
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
.stations {
  display: flex;
  justify-content: space-between;
  min-height: 3rem !important;
  ::v-deep() .van-cell {
    display: inline-flex;
    width: 30%;
    &__value {
      text-align: left;
    }
    &:nth-child(4),
    &:nth-child(6) {
      width: 60%;
    }
    &::after {
      display: none;
    }
    &:last-child {
      width: 100%;
    }
  }
  ::v-deep() .body {
    width: 100%;
  }
}
.left {
  width: 30%;
  margin-top: 2%;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 0.2rem 1rem;
  border-radius: 0 1rem 1rem 0;
  color: #fff;
  background: rgba(67, 67, 67, 1);
}
.upDate {
  font-family: PingFang SC;
  font-weight: bold;
  color: #019fbb;
  position: absolute;
  right: 50%;
  top: 1rem;
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
