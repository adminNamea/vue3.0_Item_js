<template>
  <div>
    <van-popup
      v-model:show="showPopup2"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search add">新增维修人员</div>
      <div class="popupBody">
        <div
          class="imgCell"
          v-for="(item, index) in userList"
          :key="index"
          @click="checkedClick(item)"
        >
          <img :src="isChecked(item)" />
          <van-cell class="not" :title="'姓名：' + item.name_cn" />
        </div>
        <van-button
          size="small"
          block
          @click="confirm"
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          >确定</van-button
        >
      </div>
    </van-popup>
    <van-popup
      v-model:show="showPopup1"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search add">
        <span>新增项目</span>
      </div>
      <div class="popupBody">
        <div class="imgCell" v-for="(item, index) in itemList" :key="index">
          <img :src="isProjectChecked(item)" />
          <van-cell
            @click="projectChecked(item)"
            class="not"
            :title="item.item_name"
            :value="'项目编号:' + item.ax_number_code || '无'"
          />
        </div>
        <van-button
          size="small"
          block
          @click="projectConfirm"
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          >确定</van-button
        >
      </div>
    </van-popup>
    <card class="station" :top="false" :hed="false">
      <div class="left">工位基本信息</div>
      <div class="right">
        <div class="icon"></div>
      </div>
      <van-cell title="工位：">
        <select-a
          v-if="isWork != 'true'"
          :h="1.5"
          v-model="station.station_id"
          :options="stationList"
        ></select-a>
        <span v-else style="width: 50%; font-size: 0.9rem">{{
          filterStation(stationList, station.station_id)
        }}</span>
        <div style="font-weight: bold">
          工位类型：
          <span style="color: #656565; font-size: 0.8rem">{{
            stationType[station.station_id]
          }}</span>
        </div>
      </van-cell>
      <van-cell title="预计使用时间：">
        <calendarSelect
          :disable="isWork == 'true'"
          v-model:eDate="station.edate"
          v-model:sDate="station.sdate"
        >
          <template v-if="isWork != 'true'">
            <div class="dateSlot">
              <div>{{ station.sdate || "请选择" }}</div>
              <span>至</span>
              <div>{{ station.edate || "请选择" }}</div>
            </div>
          </template>
        </calendarSelect>
      </van-cell>
      <van-cell title="维修人员：" value>
        <div class="item" v-for="(item, i) in station.user" :key="i">
          {{ item.name_cn }}
          <van-icon
            v-if="isWork != 'true'"
            :name="icon"
            @click="delCrew(item)"
          />
        </div>
        <template v-if="isWork != 'true'" #right-icon>
          <img @click="showSelect(2)" class="iconAdd" :src="icon" />
        </template>
      </van-cell>
      <van-cell title="绑定项目：" value>
        <div class="item" v-for="(item, i) in station.item" :key="i">
          {{ item.item_name }}
          <van-icon
            v-if="isWork != 'true'"
            :name="icon"
            @click="delProject(item)"
          />
        </div>
        <template v-if="isWork != 'true'" #right-icon>
          <img @click="showSelect(1)" class="iconAdd" :src="icon" />
        </template>
      </van-cell>
    </card>
    <card class="station" :top="false" :hed="false">
      <div class="left">工位状态</div>
      <div class="right">
        <div class="icon"></div>
      </div>
      <van-cell title="当前状态：">
        <select-a
          :h="1.5"
          v-model="station.station_statu_id"
          :options="options"
        ></select-a>
        <span style="font-weight: bold; color: #333333">历史状态：</span>
      </van-cell>
      <div class="replaceRecord" style="height: 15rem; overflow: auto">
        <div
          class="body"
          v-for="(item, index) in station.action_log"
          :key="index"
        >
          <span class="leftType">整机工位</span>
          <div class="line" v-if="index + 1 !== logList.length">
            <van-icon :name="dot" />
          </div>
          <div class="cardTltle">
            <div class="title">
              <span>{{ item.action_type_name }}：{{ item.create_time }}</span>
              <span>操作人员：{{ item.action_user_name }}</span>
            </div>
            <div class="content" v-html="filterLog(item.action_log)"></div>
          </div>
        </div>
      </div>
    </card>
    <div style="margin-top: 1rem" v-if="isUser">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="submit"
        @click="onSubmit"
        >提交</van-button
      >
    </div>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import select from "@/components/select/index.vue";
import calendarSelect from "@/components/calendarSelect/index.vue";
import { Dialog, Toast } from "vant";

export default {
  components: {
    card,
    "select-a": select,
    calendarSelect,
  },
  data() {
    return {
      order_station_id: Number(sessionStorage.getItem("order_station_id")),
      order_id: Number(sessionStorage.getItem("order_id")),
      // 人员数据
      userList: [],
      // 项目数据
      itemList: [],
      // 弹出类型
      // 1项目
      // 2人员
      showType: 1,
      // 搜索关键字
      keyword: "",
      // 项目选中数据
      projectCheckedData: [],
      // 人员选中数据
      checkedData: [],
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      // 弹框控制
      showPopup2: false,
      showPopup1: false,
      icon: require("@/assets/img/del.png"),
      dot: require("@/assets/img/dot.png"),
      logList: [],
      station: {
        station_id: 0,
      },
      stationList: [],
      stationStatus: 1,
      // 工位类型
      stationType: {},
      isWork: sessionStorage.getItem("isWork"),
      value: 1,
      options: [
        { text: "待开工", value: 1 },
        { text: "进行中", value: 2 },
        { text: "等零件", value: 3 },
        { text: "确认报价", value: 4 },
        { text: "已完成", value: 5 },
        { text: "设备出厂", value: 6 },
      ],
    };
  },
  created() {
    this.orderStationDetails();
    this.getStationList();
    this.itemSearch();
    this.userSearch();
  },
  computed: {
    isUser() {
      if (this.isWork === "true" && this.station.user) {
        const id = this.$store.state.user.userId;
        const isName = this.station.user.find((u) => u.userid === id);
        return isName;
      }
      return true;
    },
  },
  methods: {
    filterStation(s, id) {
      const obj = s.find((v) => v.value === id);
      return obj && obj.text;
    },
    filterLog(value = "") {
      return value.replace(/\|/g, "<br/>");
    },
    // 工位详情
    orderStationDetails() {
      this.$api.orderStationDetails(this.order_station_id).then((res) => {
        this.station = res;
      });
    },
    // 获取工位列表
    getStationList() {
      this.$api
        .getStationlList()
        .then((res) => {
          this.stationList = res.map((v) => {
            this.stationType[v.station_id] = v.type_name;
            return {
              text: v.name,
              value: v.station_id,
            };
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    // 人员搜索事件
    userSearch() {
      this.$api
        .getOrderUserList(this.order_id)
        .then((res) => {
          this.userList = res;
        })
        .catch((message) => {
          Dialog({ message });
          console.log(message);
        });
    },
    // 项目搜索事件
    itemSearch() {
      this.$api
        .orderItem({ order_id: this.order_id })
        .then((res) => {
          this.itemList = res;
        })
        .catch((message) => {
          Dialog({ message });
          console.log(message);
        });
    },
    // 弹出选择框
    showSelect(showType) {
      this[`showPopup${showType}`] = true;
      this.projectCheckedData = [...this.station.item];
      this.checkedData = [...this.station.user];
    },
    projectConfirm() {
      this.station.order_item_id = this.projectCheckedData
        .map((item) => item.order_item_id)
        .join(",");
      this.station.item = [...this.projectCheckedData];
      this.showPopup1 = false;
    },
    // 选中确定
    confirm() {
      this.station.order_userid = this.checkedData
        .map((v) => v.userid)
        .join(",");
      this.station.user = [...this.checkedData];
      this.showPopup2 = false;
    },
    // 删除项目
    delProject(item) {
      this.station.item.find((obj, index) => {
        if (obj.order_item_id === item.order_item_id) {
          this.station.item.splice(index, 1);
          return true;
        }
      });
      this.station.order_item_id = this.station.item
        .map(() => item.order_item_id)
        .join(",");
    },
    // 删除人员
    delCrew(item) {
      this.station.user.find((obj, index) => {
        if (obj.userid === item.userid) {
          this.station.user.splice(index, 1);
          return true;
        }
      });
      this.station.order_userid = this.station.user
        .map((v) => v.userid)
        .join(",");
    },
    // 人员选择事件
    checkedClick(item) {
      if (this.checkedData.includes(item)) {
        this.checkedData.find((obj, index) => {
          if (obj.userid === item.userid) {
            this.checkedData.splice(index, 1);
            return true;
          }
        });
      } else {
        this.checkedData.push(item);
      }
    },
    // 项目选择事件
    projectChecked(item) {
      if (this.projectCheckedData.includes(item)) {
        this.projectCheckedData.find((obj, index) => {
          if (obj.order_item_id === item.order_item_id) {
            this.projectCheckedData.splice(index, 1);
            return true;
          }
        });
      } else {
        this.projectCheckedData.push(item);
      }
    },
    // 人员是否选中返回对应图片
    isChecked(obj) {
      return this.checkedData.find((item) => item.userid === obj.userid)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    // 项目是否选中返回对应图片
    isProjectChecked(obj) {
      return this.projectCheckedData.find(
        (item) => item.order_item_id === obj.order_item_id
      )
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    onSubmit() {
      Toast.loading({
        message: "请稍后...",
        forbidClick: true,
      });
      this.$api
        .upOrderStation(this.station)
        .then((res) => {
          Toast.clear();
          Dialog({ message: res.msg });
          this.orderStationDetails();
        })
        .catch((message) => {
          Toast.clear();
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.popupBody {
  height: 83.5%;
  overflow: auto;
  .imgCell {
    img {
      height: 1rem;
    }
    width: 90%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    border-bottom: 0.1rem solid #dadada;
  }
}
.search {
  text-align: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding-top: 0.5rem;
  height: 2.2rem;
  /deep/ .van-field {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
  }
  &.add {
    text-align: left;
    padding-left: 5%;
  }
}
/deep/ .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .van-button {
    position: absolute;
    bottom: 0;
    height: 2.6rem;
  }
}
.station {
  position: relative;
  border-radius: 0.8rem;
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
.dateSlot {
  display: flex;
  align-items: center;
  font-size: 0.8rem;
  div {
    background: linear-gradient(0deg, #ffffff 0%, #ffffff 100%);
    border: 1px solid #434343;
    border-radius: 0.4rem;
    padding: 0 0.5rem;
    width: 4.5rem;
    text-align: center;
  }
  span {
    margin-left: 1rem;
    margin-right: 1rem;
  }
}
.right {
  position: absolute;
  right: 0;
  top: 1rem;
  z-index: 1;
  .icon {
    position: relative;
    right: 1rem;
    top: 0rem;
    width: 1.3rem;
    height: 1.3rem;
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 50%;
  }
}
/deep/ .van-icon {
  transform: scale(1.2);
}
.iconAdd {
  height: 1rem;
  transform: rotate(45deg) scale(1.5);
}
/deep/ .van-cell {
  overflow: visible;
  display: flex;
  padding: 0.5rem 1.5rem;
  &__title {
    flex: none;
    font-weight: bold;
    width: 7rem;
  }
  &__value {
    align-items: center;
  }
  .item {
    .van-icon {
      position: absolute;
      top: -0.16rem;
      right: -0.2rem;
    }
  }
  &:not(.not)::after {
    display: none;
  }
  &__value {
    overflow: visible;
    text-align: left;
    display: flex;
    flex-wrap: wrap;
    color: #656565;
  }
  .select {
    width: 50%;
    .cell {
      width: 8rem;
      background: linear-gradient(0deg, #373737 0%, #2b2b2b 100%);
      color: #ffffff;
      border-radius: 0.3rem;
      font-size: 0.9rem;
      .title {
        height: 1.5rem;
      }
    }
  }
}
.item {
  background: linear-gradient(0deg, #ffffff 0%, #ffffff 100%);
  border: 1px solid #434343;
  box-shadow: 0 0.1rem 1rem 0 rgba(0, 0, 0, 0.05);
  border-radius: 0.4rem;
  display: inline-block;
  position: relative;
  padding: 0.1rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 500;
  margin-right: 1rem;
  margin-bottom: 0.5rem;
}
.replaceRecord {
  margin-top: 5%;
  font-weight: 400;
  font-size: 0.7rem;
  .body {
    position: relative;
    width: 90%;
    display: flex;
    padding: 1rem 1.5rem;
    align-items: center;
    justify-content: space-between;
    .leftType {
      background: #f3f3f3;
      border-radius: 4rem;
      padding: 0.3rem 0.7rem;
    }
    .line {
      position: absolute;
      width: 0.08rem;
      top: 0;
      left: 25%;
      height: 100%;
      background: rgba(33, 33, 33, 0.1);
      .van-icon {
        position: relative;
        left: -0.32rem;
        top: 45%;
        z-index: 1;
      }
    }
    .cardTltle {
      font-size: 0.8rem;
      position: relative;
      width: 64%;
      box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.06);
      border-radius: 0.6rem;
      .content {
        font-size: 0.6rem;
        padding: 0.3rem 1rem;
      }
      .title {
        border-radius: 0.6rem 0.6rem 0 0;
        background: #434343;
        color: #fff;
        display: flex;
        align-items: center;
        padding: 0.3rem 1rem;
        height: 1rem;
        font-size: 0.6rem;
        justify-content: space-between;
      }
    }
  }
}
</style>
