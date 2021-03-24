<template>
  <div class="addFees">
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search">
        <h4>{{ popupTitle }}</h4>
      </div>
      <div style="height: 90%; overflow: auto">
        <van-cell
          v-for="(v, i) in lists"
          :key="i"
          :title="v.type_name"
          @click="itemClick(v)"
        ></van-cell>
      </div>
    </van-popup>
    <!-- 当日工单筛选 -->
    <van-popup
      v-model:show="showOrder"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search">
        <van-field
          @input="search"
          left-icon="search"
          class="not"
          v-model="keyword"
          placeholder="请输入客户名/工单号/AX工单号/项目名"
        />
      </div>
      <div class="body">
        <div
          class="item"
          v-for="(v, i) in itemList"
          :key="i"
          @click="thisItemClick(v)"
        >
          <p>
            <span style="font-size: 0.8rem; color: #333333"
              >客户名：{{ v.custom_name }}</span
            ><span>AX工单号：{{ v.ax_number }}</span>
          </p>
          <p>
            <span>项目名：{{ v.item_name }}</span
            ><span>工单号：{{ v.order_number }}</span>
          </p>
        </div>
      </div>
    </van-popup>
    <van-dialog
      class="dialogTime"
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      title="开始时间"
      show-cancel-button
    >
      <div class="timeTile">
        <div>年</div>
        <div>月</div>
        <div>日</div>
        <div>时</div>
        <div>分</div>
      </div>
      <van-datetime-picker
        v-model="currentDate"
        :show-toolbar="false"
        type="datetime"
      />
    </van-dialog>
    <card :hed="false" :top="false">
      <van-cell
        title="费用基本信息"
        title-class="title"
        @click="showTime = true"
        value
      >
        <template #right-icon>
          <span @click="$router.push({ name: 'index' })" class="backHome"
            >返回首页</span
          >
        </template>
      </van-cell>
      <van-cell
        title="开始时间"
        @click="showTime = true"
        is-link
        :value="ResumeTypeList.date"
      >
      </van-cell>
      <van-cell
        title="当日工单"
        @click="showOrder = true"
        is-link
        :value="ResumeTypeList.order_item_name"
      >
      </van-cell>
    </card>
    <card :hed="false" :top="false">
      <div class="leftBlock">
        <div class="left">差旅费</div>
        <span>公司代付</span>
      </div>
      <van-field
        v-for="(v, i) in list1"
        :key="i"
        v-model="v.cost"
        :label="v.type_name"
        type="number"
        placeholder="请填写（RMB）"
      >
        <template #right-icon v-if="i == 0">
          <van-icon
            @click="v.is_company_pay = Number(!v.is_company_pay)"
            :name="v.is_company_pay == 1 ? checkedIcon : noCheckedIcon"
          />
        </template>
      </van-field>
      <van-cell v-for="(v, i) in list8" :key="i" :title="v.type_name">
        <div class="zc">
          <div>
            0
            <van-icon
              @click="v.cost = 0"
              :name="v.cost == 0 ? checkedIcon : noCheckedIcon"
            />
          </div>
          <div>
            {{ v.type_name == "早餐津贴" ? 20 : 40 }}
            <van-icon
              @click="ysClick(v)"
              :name="ysxf(v) ? checkedIcon : noCheckedIcon"
            />
          </div>
        </div>
      </van-cell>
    </card>
    <card :hed="false" :top="false">
      <div class="leftBlock">
        <div class="left">路桥费</div>
        <span>公司代付</span>
      </div>
      <van-field
        v-for="(v, i) in list2"
        :key="i"
        type="number"
        v-model="v.cost"
        :label="v.type_name"
        placeholder="请填写（RMB）"
      >
        <template #right-icon v-if="i == 0">
          <van-icon
            @click="v.is_company_pay = Number(!v.is_company_pay)"
            :name="v.is_company_pay == 1 ? checkedIcon : noCheckedIcon"
          />
        </template>
      </van-field>
    </card>
    <card :hed="false" :top="false">
      <div class="leftBlock">
        <div class="left">燃油费</div>
        <span>公司代付</span>
      </div>
      <van-field
        v-for="(v, i) in list4"
        :key="i"
        type="number"
        v-model="v.cost"
        :label="v.type_name"
        placeholder="请填写（RMB）"
      >
        <template #right-icon v-if="i == 0">
          <van-icon
            @click="v.is_company_pay = Number(!v.is_company_pay)"
            :name="v.is_company_pay == 1 ? checkedIcon : noCheckedIcon"
          />
        </template>
      </van-field>
    </card>
    <card :hed="false" :top="false">
      <div class="leftBlock">
        <div class="left">其他津贴</div>
      </div>
      <van-cell title="辛劳津贴（真的恶劣艰苦环境）" class="bg">
        <template #right-icon>
          <van-icon size="1rem" :name="addIcon" @click="additem(5)" />
        </template>
      </van-cell>
      <div
        v-for="(v, i) in list5"
        :key="v.type_id"
        :class="i + 1 == list5.length ? 'bold' : ''"
      >
        <van-field
          class="bg divider"
          type="number"
          v-model="v.cost"
          :label="v.type_name"
          placeholder="请填写（RMB）"
        >
          <template #right-icon>
            <van-icon :name="delIcon" @click="delitem(v)" />
          </template>
        </van-field>
        <van-field v-model="v.note" label="备注" placeholder="请填写" />
        <span></span>
      </div>

      <van-cell title="特殊津贴" class="bg">
        <template #right-icon>
          <van-icon size="1rem" :name="addIcon" @click="additem(6)" />
        </template>
      </van-cell>
      <van-field
        class="bg"
        v-for="v in list6"
        :key="v.type_id"
        v-model="v.cost"
        type="number"
        :label="v.type_name"
        placeholder="请填写（RMB）"
      >
        <template #right-icon>
          <van-icon :name="delIcon" @click="delitem(v)" />
        </template>
      </van-field>
    </card>
    <card :hed="false" :top="false">
      <div class="leftBlock">
        <div class="left">差旅报销其它支出</div>
      </div>
      <div v-for="(v, i) in list3" :key="v.type_id">
        <van-field
          label="费用名称"
          class="bg"
          v-model="v.type_name"
          placeholder="请填写"
        >
          <template #right-icon>
            <van-icon v-if="i == 0" :name="addIcon" @click="additem(3)" />
            <van-icon v-else :name="delIcon" @click="delitem(v)" />
          </template>
        </van-field>
        <van-field
          label="费用金额"
          v-model="v.cost"
          type="number"
          placeholder="请填写（RMB）"
        />
      </div>
    </card>
    <card :hed="false" :top="false">
      <div class="leftBlock">
        <div class="left">报账付款的杂项费用</div>
      </div>
      <div v-for="(v, i) in list7" :key="v.type_id">
        <van-field
          label="费用名称"
          class="bg"
          v-model="v.type_name"
          placeholder="请填写"
        >
          <template #right-icon>
            <van-icon v-if="i == 0" :name="addIcon" @click="additem(7)" />
            <van-icon v-else :name="delIcon" @click="delitem(v)" />
          </template>
        </van-field>
        <van-field
          label="费用金额"
          v-model="v.cost"
          type="number"
          placeholder="请填写（RMB）"
        />
      </div>
    </card>
    <div
      v-sticky="false"
      class="b_fixed"
      v-if="ResumeTypeList.order_item_id && !fees && dateFees == 0"
    >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="keep"
        >暂时保存</van-button
      >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="submit"
        >提交</van-button
      >
    </div>
    <div v-sticky="false" v-if="fees">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="submit"
        >修改</van-button
      >
    </div>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Dialog, Toast } from "vant";
import { onUnmounted } from "vue";

export default {
  setup() {
    onUnmounted(() => {
      sessionStorage.removeItem("feesList");
    });
  },
  components: {
    card,
  },
  created() {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
      overlay: true,
    });
    this.orderResumeType().then(() => {
      this.search();
    });
  },
  data() {
    return {
      dateFees: 0,
      showPopup: false,
      popupTitle: "辛劳津贴",
      itemList: [],
      showOrder: false,
      currentDate: new Date(),
      showTime: false,
      keyword: "",
      resume: {},
      ResumeTypeList: { list: [] },
      addIcon: require("@/assets/img/addicon.png"),
      delIcon: require("@/assets/img/delicon.png"),
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      // 特殊津贴数据
      tList: [],
      // 辛劳津贴数据
      xList: [],
      // 修改费用列表
      fees: JSON.parse(sessionStorage.getItem("feesList")),
    };
  },
  computed: {
    list1() {
      return this.ResumeTypeList.list.filter(
        (v) =>
          v.parentid === 1 &&
          v.type_id !== 5 &&
          v.type_id !== 7 &&
          v.type_id !== 6
      );
    },
    list8() {
      return this.ResumeTypeList.list.filter(
        (v) =>
          v.parentid === 1 &&
          (v.type_id === 5 || v.type_id === 7 || v.type_id === 6)
      );
    },
    list2() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 2);
    },
    list3() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 3);
    },
    list4() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 4);
    },
    list5() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 5).reverse();
    },
    list6() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 6).reverse();
    },
    list7() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 7);
    },
    lists() {
      return this.popupTitle === "辛劳津贴" ? this.xList : this.tList;
    },
  },
  methods: {
    ysClick(v) {
      if (v.type_name === "早餐津贴") {
        v.cost = 20;
      } else {
        v.cost = 40;
      }
    },
    ysxf(v) {
      if (v.type_name === "早餐津贴") {
        return v.cost === 20;
      }
      return v.cost === 40;
    },
    // 选择当日工单
    thisItemClick(v) {
      this.ResumeTypeList.order_item_name = v.item_name;
      this.ResumeTypeList.order_item_id = v.order_item_id;
      this.checkReimbursement();
      this.showOrder = false;
    },
    // 选择津贴项目
    itemClick(v) {
      this.ResumeTypeList.list.push(v);
      this.showPopup = false;
    },
    delitem(item) {
      this.ResumeTypeList.list.forEach((v, i) => {
        if (v === item) {
          this.ResumeTypeList.list.splice(i, 1);
          return false;
        }
      });
    },
    additem(type) {
      if (type === 5) {
        this.popupTitle = "辛劳津贴";
        this.showPopup = true;
      } else if (type === 6) {
        this.popupTitle = "特殊津贴";
        this.showPopup = true;
      } else {
        this.ResumeTypeList.list.unshift({
          parentid: type,
          type_name: "",
          cost: 0,
        });
      }
    },
    async orderResumeType() {
      await this.$api
        .orderResumeType()
        .then((res) => {
          const { fees } = this;
          this.xList = res.list.filter((v) => v.parentid === 5 && !v.cost);
          this.tList = res.list.filter((v) => v.parentid === 6 && !v.cost);
          res.list = res.list.filter(
            (v) => (v.parentid !== 6 && v.parentid !== 5) || v.cost
          );
          if (!fees) {
            const arr = res.cost_list.filter((v) => v.parentid === 3);
            const arr1 = res.cost_list.filter((v) => v.parentid === 7);
            if (arr.length === 0) {
              res.list.push({
                parentid: 3,
                type_name: "",
                cost: 0,
              });
            } else {
              res.list.push(...arr);
            }
            if (arr1.length === 0) {
              res.list.push({
                parentid: 7,
                type_name: "",
                cost: 0,
              });
            } else {
              res.list.push(...arr1);
            }
          } else {
            res.order_item_id = fees.order_item_id;
            res.order_item_name = fees.item_name;
            // 判断有无其他费用
            let isq = false;
            let isq1 = false;
            fees.list.forEach((v) => {
              const item = res.list.find((v1) => v1.type_name === v.type_name);
              if (v.parentid === 7) {
                isq = true;
              } else if (v.parentid === 3) {
                isq1 = true;
              }
              if (item) {
                res.date = v.date;
                item.cost = v.cost;
                item.is_company_pay = v.is_company_pay;
              } else {
                res.list.push(v);
              }
            });
            if (!isq) {
              res.list.push({
                parentid: 7,
                type_name: "",
                cost: 0,
              });
            } else if (!isq1) {
              res.list.push({
                parentid: 3,
                type_name: "",
                cost: 0,
              });
            }
          }
          this.ResumeTypeList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    search() {
      this.$api
        .allOrderItem({ keyword: this.keyword })
        .then((res) => {
          const order_item_id = sessionStorage.getItem("order_item_id");
          if (order_item_id && order_item_id !== "undefined") {
            const obj = res.find((v) => v.order_item_id === order_item_id);
            if (obj) {
              this.ResumeTypeList.order_item_id = order_item_id;
              this.ResumeTypeList.order_item_name = obj.item_name;
            }
          }
          this.itemList = res;
        })
        .catch((message) => {
          Dialog({ message });
        })
        .finally(() => Toast.clear());
    },
    checkReimbursement() {
      this.$api
        .checkReimbursement(
          this.ResumeTypeList.date,
          this.ResumeTypeList.order_item_id
        )
        .then((res) => {
          if (res.data === 1 && this.ResumeTypeList.order_item_id) {
            Dialog({ message: "该工单的当日费用已提交，请重新确认" });
          } else if (res.data === 1) {
            Dialog({ message: "当日已提交费用" });
          }
          this.dateFees = res.data;
        })
        .catch((msg) => console.log(msg));
    },
    dialogConfirm() {
      this.ResumeTypeList.date = this.filterTime(this.currentDate);
      this.checkReimbursement();
    },
    keep() {
      const resume = this.ResumeTypeList.list.filter((v) => {
        if (v.parentid === 3 || v.parentid === 7) {
          return v.type_name !== "";
        }
        return v.cost !== "";
      });
      const obj = {
        date: this.ResumeTypeList.date,
        order_item_id: this.ResumeTypeList.order_item_id,
        resume,
      };
      console.log(resume);
      this.$api
        .addResumeAprovalBack(obj)
        .then((res) => {
          Dialog({ message: res.msg });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    editFees(obj) {
      this.$api
        .editResumeAproval({
          ...obj,
          resume_aproval_id: this.fees.resume_aproval_id,
        })
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.replace({ name: "myByFees" });
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    submit() {
      const resume = this.ResumeTypeList.list.filter((v) => {
        if (v.parentid === 3 || v.parentid === 7) {
          return v.type_name !== "";
        }
        return v.cost !== "";
      });
      const obj = {
        date: this.ResumeTypeList.date,
        order_item_id: this.ResumeTypeList.order_item_id,
        resume,
      };
      if (this.fees) {
        this.editFees(obj);
      } else {
        this.$api
          .addResumeAproval(obj)
          .then((res) => {
            Dialog.alert({ message: res.msg }).then(() => {
              this.$router.go(-1);
            });
          })
          .catch((message) => {
            Dialog({ message });
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.zc {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-right: 2rem;
  div {
    display: flex;
    align-items: center;
    i {
      margin-left: 0.2rem;
    }
  }
}
::v-deep() .bg {
  .van-icon {
    transform: scale(1.4);
  }
}
.bold.van-cell::after {
  border-bottom: 2px solid #666666;
}
.divider::after {
  display: none;
}
.addFees {
  font-family: AlibabaPuHuiTi;
}
.body {
  height: 90%;
  overflow: auto;
}
::v-deep() .search {
  display: flex;
  align-items: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.5rem 0;
  height: 2rem;
  h4 {
    text-align: left;
    padding: 0 1rem;
    margin: 0;
  }
  .van-field {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
    .van-field__control {
      background: #ffffff;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      border-radius: 0.08rem;
    }
  }
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
}
::v-deep() .van-cell {
  justify-content: space-between;
  align-items: center;
  overflow: visible;
  &__value {
    overflow: visible;
  }
}
::v-deep() .van-cell::after {
  transform: scale(1);
}
.item {
  width: 90%;
  margin: 0 auto;
  padding-bottom: 1rem;
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.125);
  p {
    margin: 0;
    padding-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.65rem;
    span {
      font-family: PingFang SC;
      font-weight: bold;
      color: #666666;
    }
  }
}

.b_fixed {
  display: flex;
  justify-content: space-between;
  .van-button {
    width: 48%;
  }
}
::v-deep() .dialogTime {
  .van-dialog__header {
    padding: 0.7rem;
    background-color: #ffcd11;
  }
  .van-dialog {
    border-radius: 1rem;
  }
  .timeTile {
    display: flex;
    justify-content: space-around;
    margin-bottom: 1rem;
    margin-top: 1rem;
    font-size: 0.8rem;
  }
}
.title {
  font-size: 1.2rem;
  position: relative;
}
.backHome {
  color: rgba(250, 207, 6, 1);
  font-size: 0.8rem;
}
.leftBlock {
  margin: 4% 0 2% 0;
  display: flex;
  padding-right: 1rem;
  align-items: center;
  justify-content: space-between;
  .left {
    display: inline-block;
    font-size: 1rem;
    font-size: 1.1rem;
    padding: 0.2rem 1rem;
    border-radius: 0 1rem 1rem 0;
    background: #434343;
    color: #ffffff;
  }
}
.not {
  border-radius: 0.3rem;
}
::v-deep() .card {
  .van-cell__title {
    color: #333333;
    align-items: center;
    flex: none;
    margin: 0;
    font-size: 0.8rem;
    width: 55%;
  }
  .van-field {
    &__label {
      color: #333333;
      align-items: center;
      margin: 0;
      font-size: 0.8rem;
      width: 55%;
    }
    &__right-icon {
      position: absolute;
      right: -2rem;
    }
    &__value {
      color: #666666;
      font-size: 0.8rem;
      margin-right: 2rem;
      padding-left: 0.5rem;
      text-align: left;
      background: rgba(249, 249, 250, 1);
      box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
      border-radius: 0.08rem;
    }
  }
}
</style>
