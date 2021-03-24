<template>
  <div>
    <!-- 删除提示框 -->
    <a-dialog
      class="delDialog"
      v-model:show="delShow"
      title="删除确认"
      :del="false"
    >
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
        v-if="isWork != 'true' && !approval"
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
        <span style="color: #656565">{{ data.sdate }}至{{ data.edate }}</span>
      </div>
      <img
        class="delImg"
        v-if="isWork != 'true' && !approval"
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
      approval: Number(sessionStorage.getItem("approval")),
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
  font-size: 4vw;
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
  font-size: 3vw;
  padding: 0.2rem 3vw;
  left: 0;
  color: #fff;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
}
.date {
  font-size: 2.5vw;
  color: #333333;
  position: absolute;
  right: 2vw;
  top: 3.5vw;
}
::v-deep() .van-cell {
  display: flex;
  align-items: center;
  font-size: 2.5vw;
  padding: 0 1.5rem;
  &__title {
    font-weight: bold;
    flex: 0.2;
    @media all and (max-width: 500px) {
      flex: 0.35;
    }
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
  font-size: 2vw;
  font-weight: 500;
  margin: 0.2rem;
}
::v-deep() .dialog.delDialog {
  .info {
    display: inline-block;
    margin: 1rem;
    padding: 0.1rem 8%;
  }
  .van-dialog {
    height: 10rem;
  }
}
::v-deep() .vanButton {
  display: flex;
  justify-content: space-around;
  .van-button {
    width: 35%;
  }
  .van-button__content {
    color: #000;
  }
}
</style>
