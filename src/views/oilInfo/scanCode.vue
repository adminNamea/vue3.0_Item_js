<template>
  <div class="other">
    <van-popup
      v-model:show="showPopup"
      position="bottom"
      :style="{ height: '77%' }"
    >
      <div class="search">
        <h4>{{ popupTitle }}</h4>
      </div>
      <div style="height: 90%; overflow: auto" v-if="popupTitle == '工单列表'">
        <div class="item" v-for="(v, i) in list" :key="i" @click="itemClick(v)">
          <p>
            <span style="font-size: 0.9rem; color: #333333"
              >客户名：{{ v.custom_name }}</span
            ><span>AX工单号：{{ v.ax_number }}</span>
          </p>
          <p>
            <span>机身编号：{{ v.item_name }}</span
            ><span>工单号：{{ v.order_number }}</span>
          </p>
          <p>
            <span>机器型号：{{ v.model }}</span
            ><span>联系人：{{ v.promise_work_time }}</span>
          </p>
        </div>
      </div>
      <div style="height: 90%; overflow: auto" v-else>
        <van-cell
          v-for="(v, i) in list"
          :key="i"
          :title="
            v.part_name ||
            v.brand_name ||
            v.jobsite_state ||
            v.level_name ||
            v.jobsite_name
          "
          @click="itemClick(v)"
        ></van-cell>
      </div>
    </van-popup>
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      :title="timeType === 1 ? '取样日期' : '寄出日期'"
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
    <card :top="false" :hed="false">
      <div class="right">
        <img src="@/assets/img/工单信息.png" />
      </div>
      <p class="title" @click="onShowPopup('工单列表', 'MyOrderList')">
        工单：
        <span
          >{{ itemDetails.order_number || "请选择工单" }}
          <img src="@/assets/img/to.png" />
        </span>
      </p>
      <div class="flex">
        <span>AX工单号：{{ itemDetails.ax_number }}</span>
        <span>机器运行小时数：{{ itemDetails.total_hour }}</span>
      </div>
      <div class="flex">
        <span>客户名：{{ itemDetails.custom_name }}</span>
        <span>客户编号：{{ itemDetails.custom_number }}</span>
      </div>
      <div class="flex">
        <span>机器编号：{{ itemDetails.serial_number }}</span>
        <span>机器型号：{{ itemDetails.model }}</span>
      </div>
      <div class="flex">
        <span>联系人：{{ itemDetails.contact_name }}</span>
        <span>电话号码：{{ itemDetails.custom_phone }}</span>
      </div>
    </card>
    <card :hed="false">
      <p style="padding-top: 0">
        其他信息
        <span
          @click="$router.push({ name: 'index' })"
          style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
          >返回首页</span
        >
      </p>
      <van-cell
        title="取样日期："
        @click="
          timeType = 1;
          showTime = true;
        "
        :value="itemDetails.sampling_date"
        is-link
      ></van-cell>
      <van-cell
        title="寄出日期："
        @click="
          timeType = 2;
          showTime = true;
        "
        :value="itemDetails.send_date"
        is-link
      ></van-cell>
      <van-cell
        title="省份："
        :value="itemDetails.jobsite_state"
        @click="onShowPopup('省份', 'sosAddress')"
        is-link
      ></van-cell>
      <van-cell
        title="地区："
        :value="itemDetails.jobsite_name"
        @click="
          onShowPopup('地区', 'sosAddress', {
            address_type: 2,
            jobsite_branch_code: itemDetails.jobsite_branch_code,
          })
        "
        is-link
      ></van-cell>
      <van-cell
        title="部件："
        :value="itemDetails.part_name"
        @click="onShowPopup('部件', 'sosPart')"
        is-link
      ></van-cell>
      <van-cell
        title="油样品牌："
        :value="itemDetails.brand_name"
        @click="onShowPopup('油样品牌', 'sosBrand')"
        v-if="itemDetails.brand_id !== 0"
        is-link
      ></van-cell>
      <van-field v-else v-model="itemDetails.brand_name" label="油样品牌：" />
      <van-cell
        title="粘度等级："
        :value="itemDetails.level_name"
        @click="onShowPopup('粘度等级', 'sosLevel', itemDetails.brand_id || 0)"
        v-if="itemDetails.level_id != 0"
        is-link
      ></van-cell>
      <van-field v-else v-model="itemDetails.level_name" label="粘度等级" />
      <van-cell title="是否更换油样：">
        <div class="btn" @click="itemDetails.is_change_brand = 1">
          是：<img
            :src="
              itemDetails.is_change_brand == 1 ? checkedIcon : noCheckedIcon
            "
          />
        </div>
        <div class="btn" @click="itemDetails.is_change_brand = 0">
          否：<img
            :src="
              itemDetails.is_change_brand == 0 ? checkedIcon : noCheckedIcon
            "
          />
        </div>
      </van-cell>
      <van-cell title="是否更换滤芯：">
        <div class="btn" @click="itemDetails.is_change_filter = 1">
          是：<img
            :src="
              itemDetails.is_change_filter == 1 ? checkedIcon : noCheckedIcon
            "
          />
        </div>
        <div class="btn" @click="itemDetails.is_change_filter = 0">
          否：<img
            :src="
              itemDetails.is_change_filter == 0 ? checkedIcon : noCheckedIcon
            "
          />
        </div>
      </van-cell>
      <van-cell title="是否优先处理：">
        <div class="btn" @click="itemDetails.priority = 1">
          是：<img
            :src="itemDetails.priority == 1 ? checkedIcon : noCheckedIcon"
          />
        </div>
        <div class="btn" @click="itemDetails.priority = 0">
          否：<img
            :src="itemDetails.priority == 0 ? checkedIcon : noCheckedIcon"
          />
        </div>
      </van-cell>
      <van-field
        v-model="itemDetails.run_hour"
        label="运行小时数（油样报告）："
        type="number"
      />
      <van-field
        type="number"
        v-model="itemDetails.use_hour"
        label="油用时数："
      />
      <van-field
        v-model="itemDetails.note"
        label="备注"
        class="textarea"
        type="textarea"
      />
    </card>
    <div v-sticky v-if="itemDetails.order_id">
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
import { Dialog } from "vant";

export default {
  components: {
    card,
  },
  data() {
    return {
      showPopup: false,
      popupTitle: "",
      list: [],
      showTime: false,
      timeType: 1,
      currentDate: new Date(),
      itemDetails: { priority: 0, is_change_filter: 0, is_change_brand: 0 },
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
    };
  },
  created() {
    this.$api.sosDetails().then((res) => {
      this.itemDetails = res;
    });
  },
  methods: {
    onSubmit() {
      console.log(this.itemDetails);
      this.$api
        .sosEdit(this.itemDetails)
        .then((res) => {
          Dialog({ message: res.msg });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    dialogConfirm() {
      if (this.timeType === 1) {
        this.itemDetails.sampling_date = this.filterTime(
          this.currentDate,
          "YYYY-mm-dd"
        );
      } else {
        this.itemDetails.send_date = this.filterTime(
          this.currentDate,
          "YYYY-mm-dd"
        );
      }
    },
    itemClick(v) {
      const item = { ...v };
      if (item.brand_id === 0) {
        item.brand_name = "";
      }
      if (item.level_id === 0) {
        item.level_name = "";
      }
      if (v.jobsite_state) {
        item.jobsite_name = null;
        item.jobsite_id = null;
      }
      this.itemDetails = { ...this.itemDetails, ...item };
      this.showPopup = false;
    },
    onShowPopup(name, fn, data) {
      this.popupTitle = name;
      this.showPopup = true;
      this.$api[fn](data)
        .then((res) => {
          this.list = res;
        })
        .catch((message) => Dialog({ message }));
    },
  },
};
</script>
<style lang='scss' scoped>
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
::v-deep() .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep() .van-dialog {
  border-radius: 1rem;
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
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
.btn {
  display: flex;
  align-items: center;
  justify-content: space-between;
  img {
    margin-left: 2rem;
    height: 1rem;
  }
}
.title {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  span {
    width: 68%;
    border: 0.1rem solid #000;
    padding: 0.2rem 1rem;
    border-radius: 0.7rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    img {
      height: 0.6rem;
    }
  }
}
::v-deep() .card {
  .van-cell {
    &__title {
      color: #000;
      padding-left: 1.5rem;
      font-size: 0.8rem;
      &::before {
        content: "";
        position: absolute;
        left: 1.1rem;
        top: 1rem;
        border-radius: 50%;
        width: 0.7rem;
        height: 0.7rem;
        background-color: #fad23f;
      }
    }
    &__value {
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
  }
}
p {
  margin: 0;
  padding: 1rem 1rem 0.5rem 1rem;
  font-size: 1rem;
  span {
    float: right;
  }
}
.flex {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  padding: 0 0 0.5rem 1rem;
  span {
    flex: 1;
    margin-bottom: 0.1rem;
  }
}
.card {
  overflow: visible !important;
}
.right {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  img {
    height: 4rem;
    transform: scale(1.07);
  }
}
::v-deep() .van-field {
  &__label {
    flex: 1;
    margin-right: 0;
  }
  &__body {
    width: 100%;
  }
  &__control {
    color: #666666;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
    border-radius: 0.08rem;
  }
}
::v-deep() .textarea {
  .van-field {
    &__label {
      flex: none;
    }
    &__control {
      height: 5rem;
    }
  }
}
.item {
  width: 93%;
  margin: 0 auto;
  padding-bottom: 0.5rem;
  border-bottom: 0.01rem solid rgba(0, 0, 0, 0.1);
  p {
    margin: 0;
    padding: 0.5rem 0 0 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.7rem;
    span {
      font-family: PingFang SC;
      font-weight: bold;
      color: #666666;
    }
  }
}
</style>
