<template>
  <div class="order">
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search">
        <h4>部件名称</h4>
      </div>
      <div style="height: 90%; overflow: auto">
        <van-cell
          v-for="(v, i) in list"
          :key="i"
          :value="v.part_name"
          @click="search(v.part_id)"
        ></van-cell>
      </div>
    </van-popup>
    <van-dialog
      :close-on-click-overlay="true"
      v-model="showTime"
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
      style="overflow: visible; padding: 0.2rem 1rem"
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
      <van-cell title="状态筛选:">
        <span
          class="round"
          @click="statuCheck(0)"
          :class="{ active: is_create === 0 }"
          >未生成报告</span
        >
        <span
          class="round"
          @click="statuCheck(1)"
          :class="{ active: is_create === 1 }"
          >已生成报告</span
        >
      </van-cell>
    </card>
    <div class="cardFlex">
      <van-cell @click="showPopup = true" title="按部件查看:">
        <img class="img" src="@/assets/img/查看.png" />
      </van-cell>
      <van-cell @click="scanCode" title="扫描条形码:">
        <img class="img" src="@/assets/img/扫码.png" />
      </van-cell>
    </div>
    <card
      v-for="(item, index) in stationList"
      :key="index"
      @click="cardClick(item)"
      class="stations"
      :top="false"
      :hed="false"
    >
      <div class="flex hed">
        <span>客户名：{{ item.custom_name }}</span>
      </div>
      <div class="flex">
        <span>机身编号：{{ item.serial_number }}</span>
        <span>部件：{{ item.part_name }}</span>
      </div>
      <div class="flex">
        <span>工单号：{{ item.order_number }}</span>
        <span>AX工单号：{{ item.ax_number }}</span>
      </div>
      <div class="flex">
        <span>油样标签：{{ item.sos_number_code }}</span>
        <span>取样日期：{{ item.create_time }}</span>
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
import { Dialog } from "vant";
import { biz } from "dingtalk-jsapi";

export default {
  components: {
    card,
  },
  data() {
    return {
      showPopup: false,
      showTime: false,
      currentDate: new Date(),
      stationList: [],
      list: [],
      sdate: "",
      edate: "",
      is_create: 1,
      dateType: 1,
    };
  },
  created() {
    this.$api.sosPart().then((res) => {
      this.list = res;
    });
    this.sdate =
      sessionStorage.getItem("sdate") ||
      this.filterTime(
        new Date(new Date().getTime() - 3600 * 24 * 30 * 1000),
        "YYYY-mm-dd"
      );
    this.edate =
      sessionStorage.getItem("edate") ||
      this.filterTime(new Date(), "YYYY-mm-dd");
    this.statuCheck(0);
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
      sessionStorage.setItem("sdate", this.sdate);
      sessionStorage.setItem("edate", this.edate);
      this.getOrderList({
        sdate: this.sdate,
        edate: this.edate,
        is_create: this.is_create,
      });
    },
    // 搜索
    search(part_id) {
      this.getOrderList({ part_id });
      this.showPopup = false;
    },
    statuCheck(is_create) {
      this.is_create = is_create;
      this.getOrderList({
        is_create,
        sdate: this.sdate,
        edate: this.edate,
      });
    },
    getOrderList(obj) {
      this.$api.sos(obj).then((res) => {
        this.stationList = res;
      });
    },
    // 时间选择
    showDate(type) {
      this.dateType = type;
      this.showTime = true;
    },
    cardClick(item) {
      sessionStorage.setItem("sos_number_code", item.sos_number_code);
      this.$router.push({ name: "oilInfoDetails" });
    },
    scanCode() {
      biz.util
        .scan({
          type: String, // type 为 all、qrCode、barCode，默认是all。
        })
        .then(({ text }) => {
          sessionStorage.setItem("sos_number_code", text);
          this.$api
            .sosDetails()
            .then(({ edit }) => {
              if (edit === 0) {
                this.$router.push({ name: "oilInfoDetails" });
              } else {
                this.$router.push({ name: "scanCode" });
              }
            })
            .catch((err) => Dialog(err));
        })
        .catch(() => Dialog({ message: "请在钉钉手机端使用" }));
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
}
::v-deep .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep .van-dialog {
  border-radius: 1rem;
}
.cardFlex {
  display: flex;
  .van-cell {
    flex: 1;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.5rem;
    display: flex;
    padding: 0.5rem 1rem;
    align-items: center;
    margin-top: 1rem;
    box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.08);
    &:nth-child(1) {
      margin-right: 1rem;
    }
    &__title {
      white-space: nowrap;
    }
    &__value {
      line-height: 50%;
      justify-content: flex-end;
    }
    .img {
      height: 2rem;
    }
  }
}
::v-deep .van-icon {
  transform: scale(0.5);
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.search {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.5rem 1rem;
  height: 2rem;
  ::v-deep .van-field {
    border-radius: 0.3rem;
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  h4 {
    margin: 0;
  }
}
.stations {
  font-size: 0.8rem;
  padding-bottom: 0.5rem;
  .flex {
    font-size: 0.8rem;
    padding: 0.5rem 0 0 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    span {
      flex: 1;
    }
  }
  .hed {
    font-size: 1rem;
    color: #ffffff;
    font-weight: 600;
    padding: 0.2rem 1rem;
    background: #434343;
  }
}
.card {
  ::v-deep .van-cell {
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
      margin-left: 1rem;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
    }
    &__title {
      width: 22%;
      white-space: nowrap;
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
}
::v-deep .van-field {
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
    ::v-deep .cell {
      font-weight: normal;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      border-radius: 1rem;
      width: 5rem;
      font-size: 0.81rem;
    }
  }
}
</style>
