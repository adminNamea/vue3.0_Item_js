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
          @click="
            ResumeTypeList.order_item_name = v.item_name;
            ResumeTypeList.order_item_id = v.order_item_id;
            showOrder = false;
          "
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
      v-model="showTime"
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
      <div v-for="v in list5" :key="v.type_id">
        <van-field
          class="bg"
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
    <div class="b_fixed" v-if="ResumeTypeList.order_item_id">
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
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
  },
  created() {
    this.search();
    this.orderResumeType();
  },
  data() {
    return {
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
    };
  },
  computed: {
    list1() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 1);
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
      return this.ResumeTypeList.list.filter((v) => v.parentid === 5);
    },
    list6() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 6);
    },
    list7() {
      return this.ResumeTypeList.list.filter((v) => v.parentid === 7);
    },
    lists() {
      return this.popupTitle === "辛劳津贴" ? this.xList : this.tList;
    },
  },
  methods: {
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
        this.ResumeTypeList.list.push({
          parentid: type,
          type_name: "",
          cost: 0,
        });
      }
    },
    orderResumeType() {
      this.$api
        .orderResumeType()
        .then((res) => {
          console.log();
          this.xList = res.list.filter((v) => v.parentid === 5 && !v.cost);
          this.tList = res.list.filter((v) => v.parentid === 6 && !v.cost);
          res.list = res.list.filter(
            (v) => (v.parentid !== 6 && v.parentid !== 5) || v.cost
          );
          if (res.list.filter((v) => v.parentid === 7).length === 0) {
            res.list.push({ parentid: 7, type_name: "", cost: 0 });
          }
          if (res.list.filter((v) => v.parentid === 3).length === 0) {
            res.list.push({ parentid: 3, type_name: "", cost: 0 });
          }
          this.ResumeTypeList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    search() {
      this.$api
        .orderItem({ keyword: this.keyword })
        .then((res) => {
          this.itemList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    dialogConfirm() {
      this.ResumeTypeList.date = this.filterTime(this.currentDate);
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
    submit() {
      const resume = this.ResumeTypeList.list.filter((v) => {
        if (v.parentid === 3 || v.parentid === 7) {
          return v.type_name !== "";
        }
        return v.cost !== "";
      });
      console.log(resume);
      const obj = {
        date: this.ResumeTypeList.date,
        order_item_id: this.ResumeTypeList.order_item_id,
        resume,
      };
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
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  ::v-deep() .van-icon {
    transform: scale(1.4);
  }
}
.addFees {
  font-family: AlibabaPuHuiTi;
}
.body {
  height: 90%;
  overflow: auto;
}
.search {
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
  ::v-deep() .van-field {
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
  align-items: center;
  overflow: visible;
  &__value {
    overflow: visible;
  }
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
.dialogTime {
  ::v-deep() .van-dialog__header {
    padding: 0.7rem;
    background-color: #ffcd11;
  }
  ::v-deep() .van-dialog {
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
.card {
  ::v-deep() .van-field {
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
