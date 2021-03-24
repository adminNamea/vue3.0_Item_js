<template>
  <div class="order">
    <van-popup
      v-model:show="showPerson"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search">
        <van-field
          @input="search"
          left-icon="search"
          class="not"
          v-model="keyword"
          placeholder="请输入名称或者角色"
        />
      </div>
      <div class="popupBody">
        <div
          class="imgCell"
          v-for="(item, index) in userList"
          :key="index"
          @click="checkedClick(item)"
        >
          <img :src="isChecked(item)" />
          <van-cell
            class="not"
            :title="'姓名：' + item.name_cn"
            :value="'角色：' + item.role_name"
          />
        </div>
      </div>
      <van-button
        size="small"
        block
        @click="confirm"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        >确定</van-button
      >
    </van-popup>
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search">
        <h4>{{ popupTitle }}</h4>
      </div>
      <div style="height: 90%; overflow: auto" v-if="popupTitle == '项目列表'">
        <div class="item" v-for="(v, i) in list" :key="i" @click="itemClick(v)">
          <p>
            <span style="font-size: 0.9rem; color: #333333"
              >客户名：{{ v.custom_name }}</span
            ><span>AX工单号：{{ v.ax_number }}</span>
          </p>
          <p>
            <span>项目名：{{ v.item_name }}</span
            ><span>工单号：{{ v.order_number }}</span>
          </p>
          <p>
            <span>机器型号：{{ v.model }}</span
            ><span>派工日期：{{ v.promise_work_time }}</span>
          </p>
        </div>
      </div>
      <div style="height: 90%; overflow: auto" v-else>
        <van-cell
          v-for="(v, i) in list"
          :key="i"
          :title="v.name"
          @click="itemClick(v)"
        ></van-cell>
      </div>
    </van-popup>
    <del-dialog class="delDialog" v-model:show="delShow" title="删除提醒">
      <span class="info">确认删除此条数据吗？</span>
      <div class="vanButton" style="margin: 1rem">
        <van-button size="small" block color="#373737" @click="del(false)"
          >我确定</van-button
        >
        <van-button size="small" block color="#373737" @click="delShow = false"
          >点错了</van-button
        >
      </div>
    </del-dialog>
    <del-dialog class="delDialog" v-model:show="otherShow" title="其他操作">
      <span class="info">请选择需要进行的操作</span>
      <div class="vanButton" style="margin: 1rem">
        <van-button size="small" block color="#373737" @click="other(1)"
          >帮同事填工卡</van-button
        >
        <van-button size="small" block color="#373737" @click="other(2)"
          >复制同事工卡</van-button
        >
      </div>
    </del-dialog>
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
      <card
        style="overflow: visible; padding: 0.2rem 1rem; margin-top: 0"
        :top="false"
        :hed="false"
        class="top"
      >
        <van-cell title="时间筛选:">
          <span class="round" @click="showDate" style="color: #000">{{
            date
          }}</span>
        </van-cell>
        <van-cell title="假期属性:">
          <span
            class="round"
            @click="is_holiday = 0"
            :class="{ active: is_holiday === 0 }"
            >非假期</span
          >
          <span
            class="round"
            @click="is_holiday = 1"
            :class="{ active: is_holiday === 1 }"
            >休息日</span
          >
          <span
            class="round"
            @click="is_holiday = 2"
            :class="{ active: is_holiday === 2 }"
            >假期</span
          >
        </van-cell>
        <van-cell title="是否上矿:">
          <span
            class="round"
            @click="mine_type == 2 ? (is_mine = 0) : ''"
            :class="{ active: mine_type == 0 || is_mine == 0 }"
            >不上矿</span
          >
          <span
            class="round"
            @click="mine_type == 2 ? (is_mine = 1) : ''"
            :class="{ active: mine_type == 1 || is_mine == 1 }"
            >上矿</span
          >
        </van-cell>
      </card>
    </div>
    <card
      v-for="(v, i) in stationList"
      :key="i"
      class="stations"
      :top="false"
      :hed="false"
      style="overflow: hidden; margin-top: 0.5rem"
      :style="i == 0 ? 'margin-top:0' : ''"
    >
      <img
        v-if="v.is_copy == 1"
        class="bimg"
        :src="require('@/assets/img/帮填.png')"
      />
      <van-cell title="时间：" class="flex">
        <van-field
          :formatter="formatter"
          v-model="v.start_time"
          @blur="isOverlap(v, i)"
        />
        <van-icon class="min" :name="toIcon" />
        <van-field
          :formatter="formatter"
          v-model="v.end_time"
          @blur="isOverlap(v, i)"
        />
        <span>{{
          v.type == 3 ? "请假" : v.type == 4 ? "间接活动" : "工单"
        }}</span>
        <template #right-icon>
          <van-icon class="delxx" size="4vw" :name="icon" @click="del(v, i)" />
        </template>
      </van-cell>
      <van-cell
        v-if="v.type == 5"
        title="项目："
        class="inputCell"
        @click="typeSelect('项目列表', 'orderItem', v)"
        :value="v.item_name || ''"
      >
        <template #right-icon>
          <van-icon class="min" :name="toIcon" />
        </template>
      </van-cell>
      <van-cell
        v-if="v.type == 5"
        title="项目类型："
        class="inputCell"
        @click="typeSelect('项目类型', 'work_record_category_group', v)"
        :value="v.group_description || ''"
      >
        <template #right-icon>
          <van-icon class="min" :name="toIcon" />
        </template>
      </van-cell>
      <van-cell
        v-if="v.type == 3 || v.type == 4"
        title="类型："
        class="inputCell"
        @click="
          typeSelect(v.type == 3 ? '请假类型' : '类型', 'event_description', v)
        "
        :value="v.description_name || ''"
      >
        <template #right-icon>
          <van-icon class="min" :name="toIcon" />
        </template>
      </van-cell>
      <van-cell
        v-if="v.type == 5 || v.type == 4"
        title="加班类型："
        class="inputCell"
        @click="typeSelect('加班类型', 'work_record_ot', v)"
        :value="v.ot_name || ''"
      >
        <template #right-icon>
          <van-icon class="min" :name="toIcon" />
        </template>
      </van-cell>
      <van-field
        v-if="v.group_id == 7 || v.group_id == 8"
        label="出发地："
        v-model="v.path_store"
      />
      <van-field
        v-if="v.group_id == 7 || v.group_id == 8"
        label="目的地："
        v-model="v.path_end"
      />
      <van-field
        v-if="v.group_id == 7 || v.group_id == 8"
        label="公里数："
        type="number"
        v-model="v.path_length"
      />
      <van-field
        v-model="v.description"
        label="备注"
        class="textarea"
        type="textarea"
      />
    </card>
    <van-empty
      v-if="stationList.length == 0"
      image="error"
      description="暂无数据"
    />
    <div v-sticky="false">
      <card
        style="
          overflow: visible;
          padding: 0 1rem;
          min-height: 8vw;
          margin-bottom: 1rem;
          margin-top: 0;
        "
        :top="false"
        :hed="false"
        class="top"
      >
        <van-cell title="添加工卡:">
          <span
            class="round"
            @click="addJCard(4)"
            :class="{ active: status === 4 }"
            >间接活动</span
          >
          <span
            class="round"
            @click="addJCard(5)"
            :class="{ active: status === 5 }"
            >工单</span
          >
          <span
            class="round"
            @click="addJCard(3)"
            :class="{ active: status === 3 }"
            >请假</span
          >
          <span
            class="round"
            @click="addJCard(0)"
            v-if="!getRequest().date"
            :class="{ active: status === 0 }"
            >其他操作</span
          >
        </van-cell>
      </card>
      <van-button
        v-if="stationList.length > 0"
        round
        block
        style="height: 7vw; font-size: 3vw"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="button"
        @click="onSubmit"
        >提交</van-button
      >
    </div>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import dialog from "@/components/dialog/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
    "del-dialog": dialog,
  },
  data() {
    return {
      // 用户数据
      userList: [],
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      checkedData: [],
      // 搜索关键字
      keyword: "",
      otherShow: false,
      showPopup: false,
      popupTitle: "",
      list: [],
      toIcon: require("@/assets/img/to.png"),
      icon: require("@/assets/img/del.png"),
      showTime: false,
      delShow: false,
      currentDate: new Date(),
      stationList: [],
      date: this.filterTime(new Date(), "YYYY-mm-dd"),
      is_holiday: 0,
      status: -1,
      delItem: {},
      isCopyType: "",
      editItem: {},
      showPerson: false,
      mine_type: this.$store.state.mine_type,
      is_mine:
        this.$store.state.mine_type === 2 ? 0 : this.$store.state.mine_type,
      work_record_ot: [],
      event_description3: [],
      event_description4: [],
      work_record_category_group: [],
      orderItem: [],
    };
  },
  created() {
    const cardItem = JSON.parse(sessionStorage.getItem("cardItem"));
    if (cardItem && cardItem.date) {
      this.date = cardItem.date;
      this.currentDate = new Date(this.date);
    }
    if (this.getRequest().date) {
      this.date = this.getRequest().date;
    }
    this.search();
    this.$api.work_record_ot().then((res) => {
      this.work_record_ot = res.map((v) => ({ ...v, name: v.ot_name }));
      this.work_record_ot.push({ name: "无", ot_name: "", record_ot_id: null });
    });
    this.$api.event_description(3).then((res) => {
      this.event_description3 = res.map((v) => ({ ...v, name: v.description }));
    });
    this.$api.event_description(4).then((res) => {
      this.event_description4 = res.map((v) => ({ ...v, name: v.description }));
    });
    this.$api.work_record_category_group().then((res) => {
      this.work_record_category_group = res.map((v) => ({
        ...v,
        name: v.group_description,
      }));
    });
    this.$api.allOrderItem().then((res) => {
      this.orderItem = res;
    });
    this.getworkRecordDetails();
  },
  methods: {
    // 选中用户提交
    confirm() {
      const user_id = this.checkedData.map((v) => v.userid).join(",");
      if (this.isCopyType === 1) {
        this.$api
          .syncWorkRecord({ date: this.date, user_id })
          .then((res) => {
            Dialog({ message: res.msg });
            this.showPerson = false;
          })
          .catch((message) => {
            Dialog({ message });
          });
      } else {
        this.$api
          .copyWorkRecord({ date: this.date, user_id })
          .then((res) => {
            const arr = res || [];
            this.stationList = arr;
            console.log(res);
            Dialog({ message: "操作成功" });
            this.showPerson = false;
          })
          .catch((message) => {
            Dialog({ message });
          });
      }
    },
    // 搜索事件
    search() {
      this.$api
        .getUserList({ keyword: this.keyword })
        .then((res) => {
          this.userList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    // 选中用户
    checkedClick(item) {
      if (this.isCopyType === 1) {
        const status = this.checkedData.find((obj, index) => {
          if (obj.userid === item.userid) {
            this.checkedData.splice(index, 1);
            return true;
          }
        });
        if (!status) {
          this.checkedData.push(item);
        }
      } else {
        this.checkedData = [item];
      }
    },

    // 是否选中返回对应图片
    isChecked(id) {
      return this.checkedData.includes(id)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    onSubmit() {
      const obj = {
        data: this.stationList.map((v) => ({ ...v })),
        is_holiday: this.is_holiday,
        is_mine: this.is_mine,
        start_date: this.date,
      };
      obj.data.forEach((v) => {
        const sdate = `${this.date} ${v.start_time.substr(
          0,
          2
        )}:${v.start_time.substr(2, 2)}:00`;
        const edate = `${this.date} ${v.end_time.substr(
          0,
          2
        )}:${v.end_time.substr(2, 2)}:00`;
        v.start_time = this.filterTime(sdate);
        v.end_time = this.filterTime(edate);
      });
      console.log(obj);
      this.$api
        .addWorkRecord(obj)
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    isOverlap(item, i) {
      if (item.end_time !== "" && item.end_time.length < 4) {
        let a = "0";
        for (let index = 1; index < 4 - item.end_time.length; index++) {
          a += "0";
        }
        item.end_time += a;
      }
      if (item.start_time.length < 4) {
        let a = "0";
        for (let index = 1; index < 4 - item.start_time.length; index++) {
          a += "0";
        }
        item.start_time += a;
      }
      if (item.end_time !== "" && item.end_time < item.start_time) {
        Dialog({ message: "结束时间必须大于开始时间" });
        return false;
      }
      this.stationList.forEach((v, index) => {
        if (i === index) {
          return true;
        }
        if (item.start_time < v.start_time) {
          if (item.end_time > v.start_time) {
            Dialog({ message: "当前工卡时间重叠" });
            return false;
          }
        } else if (item.start_time < v.end_time) {
          Dialog({ message: "当前工卡时间重叠" });
          return false;
        }
      });
    },
    itemClick(v) {
      v.record_ot_id !== undefined &&
        (this.editItem.record_ot_id = v.record_ot_id);
      v.order_item_id && (this.editItem.order_item_id = v.order_item_id);
      v.group_id && (this.editItem.group_id = v.group_id);
      v.description_id && (this.editItem.event_description = v.description_id);
      v.ot_name !== undefined && (this.editItem.ot_name = v.ot_name);
      v.group_description &&
        (this.editItem.group_description = v.group_description);
      v.description && (this.editItem.description_name = v.description);
      v.item_name && (this.editItem.item_name = v.item_name);
      this.showPopup = false;
    },
    typeSelect(name, f, v) {
      this.editItem = v;
      if (f === "event_description") {
        this.list = this[f + v.type];
      } else {
        this.list = this[f];
      }
      this.popupTitle = name;
      this.showPopup = true;
    },
    del(v, i) {
      if (v) {
        this.delShow = true;
        if (v.del) {
          v.del = i;
        }
        v.index = i;
        this.delItem = v;
      } else {
        if (this.delItem.del !== undefined) {
          this.stationList.splice(this.delItem.del, 1);
        } else {
          this.$api
            .deWorkRecord(this.delItem.record_id)
            .then(() => {
              Dialog({ message: "删除成功" });
              this.getworkRecordDetails();
            })
            .catch((message) => {
              Dialog({ message });
            });
        }
        this.delShow = false;
      }
    },
    formatter(value = "") {
      let sdate;
      let edate;
      if (value.length > 5) {
        sdate = this.filterTime(value, "HH");
        edate = this.filterTime(value, "MM");
        return sdate + String(edate);
      }
      if (value.length > 0) {
        sdate = value.substr(0, 2);
        if (!Number.isNaN(sdate)) {
          sdate = sdate > 23 ? 23 : sdate;
        } else {
          sdate = "00";
        }
        edate = value.substr(2, 2);
        if (!Number.isNaN(edate)) {
          edate = edate > 59 ? 59 : edate;
        } else {
          edate = "00";
        }
        return sdate + String(edate);
      }
      return value;
    },
    addJCard(type) {
      const obj = {
        data: this.stationList.map((v) => ({ ...v })),
        is_holiday: this.is_holiday,
        is_mine: this.is_mine,
        start_date: this.date,
      };
      let start_time = "";
      let is_copy = 0;
      const urlReq = this.getRequest();
      if (urlReq) {
        is_copy = urlReq.is_copy;
      }
      obj.data.forEach((v, index) => {
        const sdate = `${this.date} ${v.start_time.substr(
          0,
          2
        )}:${v.start_time.substr(2, 2)}:00`;
        const edate = `${this.date} ${v.end_time.substr(
          0,
          2
        )}:${v.end_time.substr(2, 2)}:00`;
        v.start_time = this.filterTime(sdate);
        v.end_time = this.filterTime(edate);
        if (index + 1 === obj.data.length) {
          start_time = edate;
        }
        if (v.is_copy === 1) {
          is_copy = true;
        }
      });
      if (obj.data.length > 0 && !is_copy) {
        this.$api
          .addWorkRecord(obj)
          .then(() => {
            this.getworkRecordDetails().then(() => {
              if (type !== 0) {
                this.stationList.push({
                  start_time,
                  end_time: "",
                  type,
                  del: true,
                  path_length: "",
                  path_end: "",
                  path_store: "",
                });
              } else {
                this.otherShow = true;
              }
            });
          })
          .catch((message) => {
            Dialog({ message });
          });
      } else if (type !== 0) {
        this.stationList.push({
          start_time,
          end_time: "",
          type,
          del: true,
          path_length: "",
          path_end: "",
          path_store: "",
        });
      } else {
        this.otherShow = true;
      }
      this.status = type;
    },
    other(v) {
      this.checkedData = [];
      this.isCopyType = v;
      this.otherShow = false;
      this.showPerson = true;
    },
    // 时间筛选
    dialogConfirm() {
      this.date = this.filterTime(this.currentDate, "YYYY-mm-dd");
      this.showTime = false;
      this.getworkRecordDetails({
        date: this.date,
      });
    },
    async getworkRecordDetails(obj) {
      let data = obj;
      if (this.getRequest().date) {
        data = { ...obj, ...this.getRequest() };
      }
      await this.$api.workRecordDetails(data).then((res) => {
        this.stationList = res.data || [];
      });
    },
    // 时间选择
    showDate() {
      if (!this.getRequest().date) {
        this.showTime = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.delxx {
  position: relative;
  top: -0.5rem;
  right: -0.35rem;
}
.min {
  transform: scale(0.6);
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
    border-radius: 0.3rem;
    width: 35%;
  }
  .van-button__content {
    color: #ffffff;
  }
}
.not {
  font-size: 0.8rem;
}
::v-deep() .card {
  .van-field {
    overflow: visible;
    &__label {
      color: #333333;
      align-items: center;
      margin: 0;
      font-size: 2.5vw;
    }
    &__body {
      width: 100%;
    }
    &__value {
      color: #666666;
      font-size: 2.5vw;
      padding: 0.5vw 1vw;
      @media all and (max-width: 500px) {
        padding: 0 1vw;
      }
      background: rgba(249, 249, 250, 1);
      box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
      border-radius: 0.08rem;
    }
  }
  .van-cell::after {
    display: none;
  }
}
.inputCell {
  font-size: 2.5vw;
  .min {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    @media all and (max-width: 500px) {
      bottom: 1.1rem;
    }
  }
  .van-cell__title {
    flex: none;
    width: 15.5vw;
  }
  .van-cell__value {
    text-align: left;
    color: #666666;
    font-size: 2.5vw;
    padding: 0.5vw 1vw;
    @media all and (max-width: 500px) {
      padding: 0 1vw;
    }
    background: rgba(249, 249, 250, 1);
    box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
    border-radius: 0.08rem;
  }
}
::v-deep() .textarea {
  .van-cell__title {
    font-size: 2.5vw;
  }
  .van-field__control {
    height: 5rem;
  }
}
::v-deep() .flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 2.5vw;
  .van-cell {
    padding: 0 0.5rem 0 0;
    &:nth-child(3) {
      padding: 0 0.5rem 0 0.5rem;
    }
    &__value {
      display: flex;
      overflow: visible;
      align-items: center;
      justify-content: space-between;
      span {
        color: rgba(1, 159, 187, 1);
        white-space: nowrap;
        text-align: left;
        width: 25%;
      }
    }
    &__title {
      flex: none;
      width: 15.5vw;
    }
  }
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
::v-deep() .top {
  .van-cell {
    font-size: 3vw;
    overflow: visible;
    align-items: center;
    padding: 1vw 0;
    .round {
      white-space: nowrap;
      background: #ffffff;
      border: 0.05rem solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 0 0.2rem 0 rgba(0, 0, 0, 0.08);
      border-radius: 4vw;
      height: 5vw;
      margin-right: 2%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      &:last-child {
        margin-right: 0;
      }
    }
    &__title {
      width: 18vw;
      flex: none;
      white-space: nowrap;
      overflow: visible;
    }
    &__value {
      display: flex;
      align-items: center;
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
  .body {
    width: 100%;
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
.popupBody {
  height: 85.8%;
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
.item {
  width: 93%;
  margin: 0 auto;
  padding-bottom: 1rem;
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.1);
  p {
    margin: 0;
    padding-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 2vw;
    span {
      font-family: PingFang SC;
      font-weight: bold;
      color: #666666;
    }
  }
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
}
.bimg {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 4rem;
  transform: scale(1.1);
  z-index: 1;
}
</style>
