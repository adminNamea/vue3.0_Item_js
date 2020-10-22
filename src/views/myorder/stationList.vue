<template>
  <div>
    <!-- 删除提示框 -->
    <a-dialog class="delDialog" :show="delShow" title="删除确认" :del="false">
      <span class="info">确认删除此工位？</span>
      <div class="vanButton" style="margin: 1rem">
        <van-button
          size="small"
          round
          block
          color="#FFCD11"
          @click.stop="delStation(false)"
          >确认</van-button
        >
        <van-button
          size="small"
          round
          block
          color="linear-gradient(to right, #FDFBFD,#F7F9F9)"
          @click="delShow = false"
          >取消</van-button
        >
      </div>
    </a-dialog>
    <h3>
      工单号：{{ order_number }}
      <img
        v-if="isWork != 'true'"
        @click="$router.push({ name: 'addStationList' })"
        src="@/assets/img/添加图片.png"
      />
    </h3>
    <card
      class="station"
      v-for="(data, index) in stationList"
      @click="stationClick(data)"
      :key="index"
      :top="false"
      :hed="false"
    >
      <div class="left">{{ data.station_name }}({{ data.statu_name }})</div>
      <div class="date">
        <span>预计使用时间：</span>
        <span style="font-size: 0.7rem; color: #656565"
          >{{ data.sdate }}至{{ data.edate }}</span
        >
      </div>
      <img
        class="delImg"
        v-if="isWork != 'true'"
        @click.stop="delStation(data)"
        src="@/assets/img/del.png"
      />
      <van-cell title="维修人员：">
        <div class="item" v-for="(v, i) in data.user" :key="i">
          {{ v.name_cn }}
        </div>
      </van-cell>
      <van-cell title="绑定项目：">
        <div class="item" v-for="(v, i) in data.item" :key="i">
          {{ v.item_name }}
        </div>
      </van-cell>
    </card>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Dialog } from "vant";
import dialog from "@/components/dialog/index.vue";

export default {
  components: {
    card,
    "a-dialog": dialog,
  },
  created() {
    this.getOrderStation();
  },
  data() {
    return {
      order_number: sessionStorage.getItem("order_number"),
      order_id: Number(sessionStorage.getItem("order_id")),
      delItem: {},
      delShow: false,
      stationList: [],
      isWork: sessionStorage.getItem("isWork"),
    };
  },
  methods: {
    stationClick(item) {
      this.$router.push({ name: "details" });
      console.log(item);
      sessionStorage.setItem("order_station_id", item.order_station_id);
    },
    // 删除工位
    delStation(item) {
      if (item) {
        this.delItem = item;
        this.delShow = true;
      } else {
        this.$api
          .delOrderStation(this.delItem.order_station_id)
          .then((res) => {
            Dialog({ message: res.msg });
            this.getOrderStation();
          })
          .catch((message) => {
            Dialog({ message });
          });
        this.delShow = false;
      }
    },
    getOrderStation() {
      this.$api
        .getOrderStation(this.order_id)
        .then((res) => {
          this.stationList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
h3 {
  display: flex;
  justify-content: space-between;
  align-items: center;
  img {
    height: 2rem;
  }
}
.delImg {
  position: absolute;
  top: 0.5rem;
  right: 1rem;
  height: 1.5rem;
}
.station {
  position: relative;
  border-radius: 0.8rem;
  overflow: hidden !important;
  padding-bottom: 1rem;
}
.left {
  margin: 3% 0 2% 0;
  display: inline-block;
  font-size: 1rem;
  padding: 0.2rem 1rem;
  left: 0;
  color: #fff;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
}
.date {
  font-size: 0.8rem;
  color: #333333;
  position: absolute;
  right: 4rem;
  top: 1.5rem;
}
/deep/ .van-cell {
  display: flex;
  align-items: center;
  padding: 0 1.5rem;
  &__title {
    flex: none;
    font-weight: bold;
    width: 6rem;
  }
  &:not(.not)::after {
    display: none;
  }
  &__value {
    text-align: left;
    color: #656565;
  }
}
.item {
  background: linear-gradient(0deg, #ffffff 0%, #ffffff 100%);
  border: 1px solid #434343;
  box-shadow: 0 0.1rem 1rem 0 rgba(0, 0, 0, 0.05);
  border-radius: 0.4rem;
  display: inline-block;
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  margin: 0.2rem;
}
/deep/.dialog.delDialog {
  .info {
    display: inline-block;
    margin: 1rem;
    padding: 0.1rem 8%;
  }
  .van-dialog {
    height: 10rem;
  }
}
.vanButton {
  display: flex;
  justify-content: space-around;
  /deep/ .van-button {
    width: 35%;
  }
  /deep/ .van-button__content {
    color: #000;
  }
}
</style>
