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
      <card style="overflow: visible" :top="false" :hed="false" class="top">
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
  name: "oilInfo",
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
      this.list = [{ part_name: "全部", part_id: 0 }, ...res];
    });
    this.sdate = this.filterTime(
      new Date(new Date().getTime() - 3600 * 24 * 30 * 1000),
      "YYYY-mm-dd"
    );
    this.edate = this.filterTime(new Date(), "YYYY-mm-dd");
    this.statuCheck(0);
  },
  activated() {
    this.statuCheck(this.is_create);
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
          onSuccess: ({ text }) => {
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
              .catch((err) => {
                // eslint-disable-next-line no-alert
                alert(JSON.stringify(err));
              });
          },
          onFail(err) {
            if (err.errorMessage !== "") {
              Dialog({ message: JSON.stringify(err) });
            }
          },
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.card.top {
  @include myStyle;
  padding: 0 2vw 2vw 2vw;
  min-height: 1vw;
  margin-top: 0;
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
}
::v-deep() .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep() .van-dialog {
  border-radius: 1rem;
}
.cardFlex {
  display: flex;
  .van-cell {
    flex: 1;
    background: rgba(255, 255, 255, 1);
    border-radius: 0.5rem;
    font-size: 3vw;
    display: flex;
    padding: 2vw;
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
      height: 6vw;
    }
  }
}
::v-deep() .search {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.5rem 1rem;
  height: 2rem;
  .van-field {
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
  font-size: 2.5vw;
  padding-bottom: 0.5rem;
  .flex {
    padding: 0.5rem 0 0 1rem;
    display: flex;
    flex-wrap: wrap;
    span {
      word-break: break-all;
      flex: 1;
    }
  }
  .hed {
    font-size: 3vw;
    color: #ffffff;
    height: 5.5vw;
    display: flex;
    align-items: center;
    font-weight: 600;
    padding: 0 1rem;
    background: #434343;
  }
}
</style>
