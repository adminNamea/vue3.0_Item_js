<template>
  <div class="approvalDetails">
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="show"
      :showConfirmButton="false"
    >
      <div
        @click="upSatatus(1)"
        style="
          border-bottom: 0.01rem solid rgb(153, 153, 153);
          padding-bottom: 0.5rem;
        "
      >
        已派工
      </div>
      <div
        @click="upSatatus(2)"
        style="
          border-bottom: 0.01rem solid rgb(153, 153, 153);
          padding-bottom: 0.5rem;
        "
      >
        进行中
      </div>
      <div @click="upSatatus(3)">已完成</div>
    </van-dialog>
    <card
      class="stations"
      :top="false"
      title="工单类型："
      :rightTitle="orderDetails.order_type_name"
    >
      <div class="left">提交人</div>
      <p>{{ orderDetails.au_name_cn }}</p>
      <div class="leftBlock">
        <div class="left">工单详情</div>
        <span @click="$router.push({ name: 'index' })" class="backHome"
          >返回首页</span
        >
      </div>
      <div class="body">
        <div class="flex">
          <van-cell
            title="工单号:"
            :value="orderDetails.order_number"
          ></van-cell>
          <van-cell
            title="AX工单号:"
            :value="orderDetails.ax_number"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="主修:"
            :value="orderDetails.major_user && orderDetails.major_user.name_cn"
          ></van-cell>
          <van-cell title="副修:">
            <span
              style="margin-right: 0.5rem"
              v-for="(v, i) in orderDetails.minor_user"
              :key="i"
              >{{ v.name_cn }}</span
            >
          </van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="服务车牌号:"
            :value="orderDetails.service_car"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell title="客户:" :value="orderDetails.custom_name"></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="客户编号:"
            :value="orderDetails.custom_number"
          ></van-cell>
          <van-cell
            title="客户电话:"
            :value="orderDetails.custom_phone"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="客户反馈："
            :value="orderDetails.order_reason"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="联系人："
            :value="orderDetails.contact_name"
          ></van-cell>
          <van-cell title="联系电话：" :value="orderDetails.phone"></van-cell>
        </div>
        <div class="flex">
          <van-cell title="机器型号：" :value="orderDetails.model"></van-cell>
          <van-cell
            title="机身编号："
            :value="orderDetails.serial_number"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="机器运行小时数:"
            :value="orderDetails.total_hour"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="机器地点:"
            :value="orderDetails.m_location"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="PL机器位置:"
            :value="orderDetails.pl_location"
          ></van-cell>
        </div>
      </div>
      <div class="left">工单信息</div>
      <van-cell
        class="not"
        @click="$router.push({ name: 'take5' })"
        title="安全5步法"
        is-link
        value="未录入"
      ></van-cell>
      <van-cell
        class="not"
        title="维修日志"
        is-link
        value
        @click="$router.push({ name: 'serviceLog' })"
      ></van-cell>
      <van-cell
        class="not"
        @click="toFillInfo"
        value
        title="回访联系人"
        is-link
      ></van-cell>
      <van-cell
        class="not"
        title="工单状态"
        is-link
        :value="orderDetails.status_name"
      ></van-cell>
      <van-cell class="not" title="TA1" is-link value="去填写"></van-cell>
      <div v-if="orderDetails.order_type == 7" @click="toStationList">
        <div class="left">工位信息</div>
        <div style="max-height: 14.5rem; overflow: auto">
          <div v-for="(station, index) in orderDetails.station" :key="index">
            <div class="flex">
              <van-cell title="工位：" is-link>
                <div>
                  {{ station.station_name }}
                  <span style="color: #940a0a"
                    >（{{ station.statu_name }}）</span
                  >
                </div>
              </van-cell>
            </div>
            <div class="flex">
              <van-cell
                title="预计使用时间："
                :value="
                  (station.sdate && station.sdate + '至' + station.edate) ||
                  '无'
                "
              ></van-cell>
            </div>
            <div class="flex">
              <van-cell title="维修人员：">
                <div
                  style="margin-right: 1rem"
                  v-for="(v, i) in station.user"
                  :key="i"
                >
                  {{ v.name_cn }}
                </div>
              </van-cell>
            </div>
            <div class="flex">
              <van-cell title="绑定项目：" title-class="not">
                <div
                  style="margin-right: 1rem"
                  v-for="(v, i) in station.item"
                  :key="i"
                >
                  {{ v.item_name }}
                </div>
              </van-cell>
            </div>
            <van-divider v-if="index < 1" :style="{ padding: '0 1rem' }" />
          </div>
        </div>
      </div>
      <van-cell title="现场发现：" style="padding: 1rem">
        <img
          v-for="(v, index) in orderDetails.spot_img_aliyun"
          :key="index"
          style="height: 4rem; width: 4rem"
          :src="v.url"
        />
      </van-cell>
      <van-cell
        v-if="myOrder == 1"
        title="备注和建议："
        :value="orderDetails.repair_way"
      >
      </van-cell>
      <van-field
        v-else
        v-model="orderDetails.order_reason"
        label="备注"
        class="textarea"
        type="textarea"
      />
      <div class="left">项目</div>
      <van-cell
        title-class="not"
        style="padding: 1rem"
        v-for="(obj, index) in orderDetails.item"
        :key="index"
        @click="to(obj.order_item_id)"
        :title="obj.item_name"
        is-link
      >
        <span>预计工时：{{ obj.item_cost_time }}小时</span>
      </van-cell>
    </card>
    <div
      v-if="myOrder == 1 && orderDetails.aproval_status_id != 2"
      style="margin-top: 1rem"
    >
      <van-button
        round
        block
        @click="$router.push({ name: 'workDetails' })"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="submit"
        >去修改</van-button
      >
    </div>
    <div
      v-if="myOrder != 1 && orderDetails.aproval_status_id != 2"
      class="b_fixed"
    >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(1)"
        >同意</van-button
      >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(2)"
        >不同意</van-button
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
      // 工单信息
      orderDetails: { item: [] },
      // 图片预览列表
      fileList: [],
      show: false,
      myOrder: sessionStorage.getItem("myOrder"),
      order_id: Number(sessionStorage.getItem("order_id")),
    };
  },
  created() {
    this.getOrderDetails();
  },
  methods: {
    onSubmit(is_adopt) {
      this.$api
        .confirmOrderApproval({
          order_id: this.order_id,
          is_adopt,
          faile_note: this.orderDetails.a_faile_note,
        })
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    toFillInfo() {
      const item = this.orderDetails;
      sessionStorage.setItem("log_contacts", item.log_contacts || "");
      sessionStorage.setItem("log_machine_no", item.log_machine_no || "");
      sessionStorage.setItem("log_phone", item.log_phone || "");
      this.$router.push({ name: "fillInfo" });
    },
    toStationList() {
      this.$router.push({
        name: "stationList",
      });
      sessionStorage.setItem("isWork", true);
    },
    to(order_item_id) {
      if (this.orderDetails.status_name === "已派工") {
        return;
      }
      this.$router.push({ name: "orderProject", params: { order_item_id } });
    },
    upSatatus(type) {
      if (type < this.orderDetails.status_id) {
        Dialog({ message: "状态不能回退" });
        return;
      }
      this.$api
        .upOrderStatus({ order_id: this.order_id, status_id: type })
        .then((res) => {
          Dialog({ message: res.msg });
          this.show = false;
          this.getOrderDetails();
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    // 查询工单数据
    getOrderDetails() {
      this.$api.orderDetails(this.order_id).then((res) => {
        this.orderDetails = res;
      });
    },
    // 图片上传
    afterRead(fileList) {
      console.log(fileList);
      console.log(this.fileList);
    },
  },
};
</script>

<style lang="scss" scoped>
.preview-cover {
  position: absolute;
  box-sizing: border-box;
  bottom: 0;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
.b_fixed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 49%;
  }
}
::v-deep .van-dialog {
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.2rem;
  &__content {
    text-align: center;
    div {
      margin: 0.5rem 0;
    }
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
    border-bottom: 0.1rem solid #dadada;
  }
}
.search {
  text-align: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.8rem 0;
  height: 2.2rem;
  ::v-deep .van-field {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
  }
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
.stations {
  overflow: hidden !important;
  font-size: 1rem;
  font-weight: 600;
  position: relative;
  .flex {
    &:nth-child(1) .van-cell {
      padding-top: 0;
    }
    &:last-child .van-cell {
      padding-bottom: 0;
    }
    .van-cell:nth-child(1) {
      flex: 1.5;
    }
    .van-cell:nth-child(2) {
      flex: 1;
      .van-cell__title {
        width: 4rem;
      }
    }
    display: flex;
    justify-content: space-between;
    ::v-deep .van-cell {
      &__value {
        text-align: left;
        color: #656565;
      }
    }
  }
  ::v-deep .van-cell {
    padding: 0.1rem 1rem;
    &__title {
      font-size: 0.75rem;
      &:not(.not) {
        flex: none;
      }
      width: 6.5rem;
      font-weight: normal;
    }
    &__value {
      font-size: 0.75rem;
      font-weight: normal;
      .van-button {
        margin-top: 0.1rem;
        font-size: 0.75rem;
        font-weight: 800;
        background: linear-gradient(90deg, #ffcd11, #ffe775);
        height: 1.5rem;
        width: 4.5rem;
        &__content {
          color: #000;
        }
      }
    }
    &:not(.not)::after {
      display: none;
    }
    &.not {
      padding-bottom: 0.5rem;
    }
  }
  .left {
    margin: 1rem 0 1rem 0;
    display: inline-block;
    font-size: 1rem;
    padding: 0.2rem 1rem;
    left: 0;
    border-radius: 0 1rem 1rem 0;
    background: linear-gradient(267deg, #fbd01f, #fee568);
  }
}
.backHome {
  color: rgba(250, 207, 6, 1);
  font-size: 0.8rem;
}
p {
  margin: 0;
  padding-left: 1rem;
}
.leftBlock {
  margin: 0;
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
    background: linear-gradient(267deg, #fbd01f, #fee568);
    color: #333333;
  }
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.del {
  width: 1.6rem;
  height: 1rem;
  border-radius: 2rem;
  float: right;
  justify-content: center;
  padding: 0.24rem 0.6rem;
  color: #fff;
  display: flex;
  align-items: center;
  background-color: #c8c8c8;
  margin: 0.2rem;
}
.edit {
  margin: 0.2rem;
  width: 1.6rem;
  height: 1rem;
  border-radius: 2rem;
  float: right;
  justify-content: center;
  padding: 0.24rem 0.6rem;
  color: #fff;
  display: flex;
  align-items: center;
  background-color: #ffcd11;
}
.textarea {
  ::v-deep .van-field__control {
    height: 5rem;
    color: #666666;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
    border-radius: 0.08rem;
  }
}
</style>
