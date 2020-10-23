<template>
  <div class="station">
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
          @click="delStation(false)"
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
    <a-dialog v-model:show="showDialog" title="引用预约">
      <div class="dialogSearch">
        <span>搜索</span>
        <van-field
          left-icon="search"
          v-model="keywordPre"
          placeholder="请输入名称或者角色"
        />
        <img @click="woApiStationOrder" src="@/assets/img/search-blue.png" />
      </div>
      <div class="dialogTitle">
        <van-cell value="预约人员" style="color: #266ccb">
          <template #title>
            <div>
              <span style="display: inline-block; width: 5rem">机身编号</span>
              <span>预约工位</span>
            </div>
          </template>
        </van-cell>
      </div>
      <div class="dialogBody" style="height: 17rem; overflow: auto">
        <van-cell
          v-for="(item, index) in preStationList"
          :key="index"
          :value="item.user_name"
          @click="stationChecked(item)"
        >
          <template #right-icon>
            <img
              style="height: 1rem; width: 1rem"
              :src="isStationChecked(item)"
            />
          </template>
          <template #title>
            <span style="display: inline-block; width: 5rem">{{
              item.machine_sn
            }}</span>
            <span v-for="(s, i) in item.details" :key="i">{{
              s.station_name
            }}</span>
          </template>
        </van-cell>
      </div>
      <div class="dialogButton">
        <van-button size="small" block color="#FFCD11" @click="dialogConfirm"
          >引用</van-button
        >
      </div>
    </a-dialog>
    <van-popup
      v-model:show="showPopup1"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search add">
        <span>新增项目</span>
      </div>
      <div class="popupBody">
        <div class="imgCell" v-for="(item, index) in form.item" :key="index">
          <img :src="isProjectChecked(item)" />
          <van-cell
            @click="projectChecked(item)"
            class="not"
            :title="item.item_name"
            :value="`项目编号:${item.ax_number_code || '无'}`"
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
    <van-popup
      v-model:show="showPopup2"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search add">
        <span>新增维修人员</span>
      </div>
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
    <card title="工单类型：">
      <template #right>
        <select-a
          v-model="form.order_type"
          :options="options"
          @select="select"
        ></select-a>
      </template>
      <p>
        工位选择
        <span class="rightTitle" @click="addStation({})">添加</span>
        <span class="rightTitle" @click="showDialog = true">引用预约工位</span>
      </p>
      <div style="min-height: 35rem; overflow: auto; width: 100%">
        <card
          v-for="(station, i) in form.station"
          :key="i"
          :top="false"
          :hed="false"
          style="width: 95%; margin: 1rem auto"
        >
          <div class="cardTltle">
            <span>添加工位{{ i + 1 }}</span>
            <img src="@/assets/img/del.png" @click="delStation(i)" />
          </div>
          <van-cell title="选择时间：" is-link>
            <calendarSelect
              v-model:sDate="station.sdate"
              v-model:eDate="station.edate"
            ></calendarSelect>
          </van-cell>
          <van-cell title="选择工位：" class="visible">
            <select-a
              v-model="station.station_id"
              :options="stationList"
            ></select-a>
          </van-cell>
          <van-cell title="选择人员：" @click="showSelect(2, station)" is-link>
            <div
              class="crew"
              v-for="(item, index) in station.crew"
              :key="index"
            >
              {{ item.name_cn }}
              <img
                src="@/assets/img/del.png"
                @click.stop="delEvent(station, index, 'crew')"
              />
            </div>
          </van-cell>
          <van-cell title="选择项目：" @click="showSelect(1, station)" is-link>
            <div
              class="crew"
              v-for="(item, index) in station.project"
              :key="index"
            >
              {{ item.item_name }}
              <img
                src="@/assets/img/del.png"
                @click.stop="delEvent(station, index, 'project')"
              />
            </div>
          </van-cell>
        </card>
      </div>
    </card>
    <div style="margin-top: 1rem">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="submit"
        @click="onSubmit"
        >下一步</van-button
      >
    </div>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import select from "@/components/select/index.vue";
import calendarSelect from "@/components/calendarSelect/index.vue";
import dialog from "@/components/dialog/index.vue";
import { Dialog } from "vant";

export default {
  props: {
    form: {
      default() {
        return {};
      },
      type: Object,
    },
    comName: String,
  },
  components: {
    card,
    "select-a": select,
    calendarSelect,
    "a-dialog": dialog,
  },
  computed: {
    // 维修人员数据
    userList() {
      console.log(this.form.item);
      const major = this.form.checkedMajor.userid || "";
      const arr = [...this.form.minorData];
      if (major) {
        arr.push(this.form.checkedMajor);
      }
      const obj = {};
      arr.forEach((s) => {
        obj[s.userid] = s;
      });
      return Object.values(obj);
    },
  },
  mounted() {
    this.woApiStationOrder();
    this.$api
      .getStationlList()
      .then((res) => {
        this.stationList = res.map((v) => ({
          text: v.name,
          value: v.station_id,
        }));
      })
      .catch((message) => {
        Dialog({ message });
      });
  },
  data() {
    return {
      // 工位数据
      stationList: [],
      // 预约工位数据
      preStationList: [],
      // 项目数据
      itemList: [],
      // 弹出类型
      // 1项目
      // 2人员
      showType: 1,
      // 对话框
      showDialog: false,
      // 弹框控制
      showPopup2: false,
      showPopup1: false,
      // 搜索关键字
      keyword: "",
      // 预约搜索关键字
      keywordPre: "",
      // 当前操作工位
      thisStation: {},
      project: [],
      // 工位选中数据
      stationCheckedData: {},
      // 项目选中数据
      projectCheckedData: [],
      // 人员选中数据
      checkedData: [],
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      // 下拉框数据
      options: [
        { value: 0, text: "保修工单" },
        { value: 1, text: "内部" },
        { value: 2, text: "外部" },
        { value: 3, text: "保养" },
        { value: 4, text: "交机" },
        { value: 5, text: "交机前检查" },
        { value: 6, text: "大修" },
      ],
      // 要删除的工位
      delItem: {},
      delShow: false,
    };
  },
  methods: {
    select(item) {
      if (item.value !== 7) {
        this.$emit("update:comName", "other");
      }
    },
    // 添加工位
    addStation(item = {}) {
      this.form.station.push({
        project: [],
        crew: [],
        sdate: "",
        edate: "",
        user_id: [],
        station_id: "",
        item_key: [],
        ...item,
      });
    },
    // 预约工位搜索
    woApiStationOrder() {
      this.$api.woApiStationOrder(this.keywordPre).then((res) => {
        this.preStationList = res;
      });
    },
    // 删除工位
    delStation(index) {
      if (index !== false) {
        this.delItem = index;
        this.delShow = true;
      } else {
        this.form.station.splice(this.delItem, 1);
        this.delShow = false;
      }
    },
    // 引用确认
    dialogConfirm() {
      this.showDialog = false;
      const station = this.stationCheckedData;
      if (!station.details) {
        return;
      }
      station.details.forEach((s) => {
        const { station_id, sdate, edate } = s;
        if (this.form.station.find((v) => v.station_id === station_id)) {
          return true;
        }
        this.addStation({
          order_id: station.order_id,
          station_id: Number(station_id),
          sdate,
          edate,
        });
      });
    },
    // 弹出选择框
    showSelect(showType, station) {
      this[`showPopup${showType}`] = true;
      this.thisStation = station;
      this.projectCheckedData = [...station.project];
      this.checkedData = [...station.crew];
    },
    projectConfirm() {
      this.showPopup1 = false;
      this.thisStation.project = [...this.projectCheckedData];
      this.thisStation.item_key = this.projectCheckedData.map((v) => v.itemId);
    },
    // 选中确定
    confirm() {
      this.thisStation.crew = [...this.checkedData];
      this.thisStation.user_id = this.checkedData.map((v) => v.userid);
      this.showPopup2 = false;
    },
    // 删除项目或人员
    delEvent(station, index, key) {
      station[key].splice(index, 1);
      station.user_id = station.crew && station.crew.map((v) => v.userid);
      station.item_key = station.item && station.item.map((v) => v.itemId);
    },
    // 人员选择事件
    checkedClick(item) {
      const status = this.checkedData.forEach((obj, index) => {
        if (obj === item) {
          this.checkedData.splice(index, 1);
          return false;
        }
        return true;
      });
      if (!status) {
        this.checkedData.push(item);
      }
    },
    // 项目选择事件
    projectChecked(item) {
      const status = this.projectCheckedData.find((obj, index) => {
        if (obj === item) {
          this.projectCheckedData.splice(index, 1);
          return true;
        }
      });
      if (!status) {
        this.projectCheckedData.push(item);
      }
    },
    // 引用预约选择事件
    stationChecked(item) {
      this.stationCheckedData = item;
    },
    // 人员是否选中返回对应图片
    isChecked(id) {
      return this.checkedData.includes(id)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    // 项目是否选中返回对应图片
    isProjectChecked(id) {
      return this.projectCheckedData.includes(id)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    // 工位是否选中返回对应图片
    isStationChecked(item) {
      return this.stationCheckedData === item
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    onSubmit() {
      let status = true;
      this.form.station.forEach((v) => {
        if (v.sdate === "" || v.station_id === "") {
          status = false;
          return false;
        }
        return true;
      });
      if (status) {
        this.$emit("next");
      } else {
        Dialog({ message: "请填写完整时间和工位" });
      }
    },
  },
};
</script>
<style lang='scss' scoped>
.calendarSelect {
  width: 100%;
  text-align: left;
}
.card {
  .cardTltle {
    border-radius: 0.5rem 0.5rem 0 0;
  }
  .van-cell {
    border-radius: 1rem;
  }
  ::v-deep .visible {
    overflow: visible;
    .van-cell__value {
      overflow: visible;
      width: 72.9%;
    }
    .cell {
      width: 100%;
      border-radius: 0.1rem;
      font-size: 1rem;
      padding: 0.2rem;
      .title {
        padding-left: 0.5rem;
        justify-content: space-between;
      }
      .body {
        padding-right: 1.5rem;
        div {
          border-bottom: 0.01rem solid rgba($color: #000000, $alpha: 0.25);
        }
      }
    }
  }
}
::v-deep .van-cell::after {
  transform: scale(1);
}
::v-deep .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .van-button {
    position: absolute;
    bottom: 0;
    height: 2.6rem;
  }
}
.vanButton {
  display: flex;
  justify-content: space-around;
  ::v-deep .van-button {
    width: 35%;
  }
  ::v-deep .van-button__content {
    color: #000;
  }
}
.cardTltle {
  background: #434343;
  height: 1rem;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  justify-content: space-between;
  color: #fff;
  display: flex;
  align-items: center;
  img {
    float: right;
    height: 1.2rem;
    width: 1.2rem;
  }
}
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
    border-bottom: 1px solid #dadada;
  }
}
.card {
  ::v-deep .van-cell__value {
    display: flex;
    align-items: center;
    width: 70%;
    flex: none;
    flex-wrap: wrap;
  }
}
.dialogButton {
  width: 100%;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ::v-deep .van-button {
    .van-button__content {
      color: #000;
    }
    width: 30%;
    border-radius: 4rem;
    color: #000;
  }
}
.dialogBody,
.dialogTitle {
  ::v-deep .van-cell {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
  ::v-deep .van-cell__title {
    font-size: 0.7rem;
    flex: none;
    width: 80%;
  }
  ::v-deep .van-cell__value {
    font-size: 0.7rem;
    display: flex;
  }
  &:not(.dialogTitle) {
    border-bottom: 0.05rem solid rgba(67, 67, 67, 0.4);
  }
}
.dialogSearch {
  text-align: center;
  padding: 0.8rem 0;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  span {
    font-size: 1rem;
    font-weight: 600;
  }
  img {
    height: 2.5rem;
    width: 2.5rem;
    float: right;
  }
  ::v-deep .van-field {
    width: 70%;
    height: 100%;
    display: flex;
    align-items: center;
    background: #f3f3f3;
    border: 1px solid #434343;
    box-shadow: 0px 0.1rem 0.1rem 0px rgba(51, 51, 51, 0.04);
    border-radius: 0.5rem;
  }
}
.search {
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  height: 2.2rem;
  display: flex;
  align-items: center;
  padding-left: 1rem;
}
.crew {
  position: relative;
  border: 0.08rem solid #000;
  color: #000;
  padding: 0 0.4rem;
  text-align: center;
  margin: 0.2rem;
  border-radius: 1rem;
  img {
    position: absolute;
    top: -0.3rem;
    right: -0.5rem;
    height: 1.1rem;
    width: 1.1rem;
  }
}
p {
  margin: 0;
  margin-top: 1rem;
  margin-left: 1rem;
  font-size: 1rem;
  .rightTitle {
    color: #ffffff;
    font-size: 0.8rem;
    padding: 0.1rem 1.5rem 0.1rem 1.5rem;
    background: linear-gradient(to right, #ffcd11 0%, #ffe775 100%);
    float: right;
    margin-right: 5%;
    font-weight: 800;
    border-radius: 1rem;
  }
}
::v-deep.dialog.delDialog {
  .info {
    display: inline-block;
    margin: 1rem;
    padding: 0.1rem 8%;
  }
  .van-dialog {
    height: 10rem;
  }
}
</style>
