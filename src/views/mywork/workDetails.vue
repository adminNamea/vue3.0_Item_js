<template>
  <div class="workDetails">
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
      <div class="left">工单详情</div>
      <span @click="$router.push({ name: 'index' })" class="backHome"
        >返回首页</span
      >
      <div class="body">
        <div class="flex minP">
          <van-cell
            title="工单号:"
            :value="orderDetails.order_number"
          ></van-cell>
          <van-cell
            title="AX工单号:"
            :value="orderDetails.ax_number"
          ></van-cell>
        </div>
        <div class="flex minP" v-if="orderDetails.is_dispatch !== 0">
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
            :value="orderDetails.service_car || ''"
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
        @click="to('take5')"
        title="安全5步法"
        is-link
        :value="orderDetails.take == 0 ? '未录入' : '已录入'"
      ></van-cell>
      <van-cell
        class="not"
        title="工单状态"
        is-link
        @click="show = true"
        :value="orderDetails.status_name || ''"
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
              <van-cell title="维修人员：" value-class="itemValue">
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
              <van-cell title="绑定项目：" value-class="itemValue">
                <div
                  style="margin-right: 1rem"
                  v-for="(v, i) in station.item"
                  :key="i"
                >
                  {{ v.item_name }}
                </div>
              </van-cell>
            </div>
            <van-divider
              v-if="index + 1 < orderDetails.station.length"
              :style="{ padding: '0 1rem' }"
            />
          </div>
        </div>
      </div>
      <div class="left">发现</div>
      <div class="flex">
        <van-cell title="现场发现：">
          <van-uploader
            :max-count="maxCount"
            :deletable="isDeletable"
            :preview-options="{ closeable: true }"
            v-model="orderDetails.spot_img_aliyun"
            :after-read="afterRead"
            multiple
            @delete="deleteImg"
          >
            <img
              style="height: 4rem; width: 4rem"
              src="@/assets/img/uploader.png"
            />
            <template #preview-cover="file">
              <div class="preview-cover van-ellipsis">
                {{ filterPath(file.path) }}
              </div>
            </template>
          </van-uploader>
        </van-cell>
      </div>
      <div class="left">项目</div>
      <van-cell
        title-class="not"
        v-for="(obj, index) in orderDetails.item.filter(
          (v) => v.item_type === 0
        )"
        :key="index"
        @click="to('orderProject', obj)"
        :title="obj.item_name"
        is-link
      >
        <span>预计工时：{{ obj.item_cost_time }}小时</span>
      </van-cell>
      <van-cell
        v-if="orderDetails.item.filter((v) => v.item_type === 0).length === 0"
        title="暂无"
        value
        is-link
      ></van-cell>
      <div class="left">自定义项目</div>
      <van-cell
        title-class="not"
        v-for="(obj, index) in orderDetails.item.filter(
          (v) => v.item_type === 1
        )"
        :key="index"
        @click="to('orderProject', obj)"
        :title="obj.item_name"
        value
        is-link
      >
        <span>预计工时：{{ obj.item_cost_time }}小时</span>
      </van-cell>
      <van-cell
        v-if="orderDetails.item.filter((v) => v.item_type === 1).length === 0"
        title="暂无"
        value
        is-link
      ></van-cell>
      <div class="left">其他</div>
      <van-cell
        title="维修日志"
        class="not"
        @click="$router.push({ name: 'serviceLog' })"
        value
        is-link
      />
      <van-cell
        title="补充信息"
        class="not"
        @click="toFillInfo"
        value
        is-link
      />
    </card>
    <div
      v-sticky="false"
      v-if="orderDetails.status_id === 3 || orderDetails.status_id === 7"
    >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="submit"
        >提交审批</van-button
      >
    </div>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import { Dialog, Toast } from "vant";

export default {
  components: {
    card,
  },
  data() {
    return {
      // 工单信息
      orderDetails: { item: [], spot_img_aliyun: [] },
      show: false,
      order_id: Number(sessionStorage.getItem("order_id")),
    };
  },
  computed: {
    isDeletable() {
      const id = this.orderDetails.status_id;
      let status = false;
      if (id === 2 || id === 3 || id === 6 || id === 7) {
        status = true;
      }
      return status;
    },
    maxCount() {
      return this.isDeletable ? 9 : 0;
    },
  },
  created() {
    if (!this.order_id) {
      this.order_id = this.getRequest().order_id;
      sessionStorage.setItem("order_id", this.order_id);
    }
    this.getOrderDetails();
  },
  methods: {
    filterPath(v = "") {
      return v ? v.replace("spotImg/", "") : "";
    },
    deleteImg(file) {
      this.delOSS(file.path).then((res) => {
        if (res) {
          this.editOrderSpotImg();
        }
      });
    },
    submit() {
      this.$api
        .addOrderApproval(this.order_id)
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
    to(name, obj = {}) {
      if (this.orderDetails.status_name === "已派工") {
        Dialog({ message: "请修改状态为进行中" });
        return;
      }
      if (name === "take5" && this.orderDetails.take > 0) {
        name = "take5ListDetails";
      }
      sessionStorage.setItem("take_id", this.orderDetails.take);
      sessionStorage.setItem("order_item_id", obj.order_item_id);
      this.$router.push({ name });
    },
    upSatatus(type) {
      Toast.loading({
        message: "请稍后...",
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
      if (type < this.orderDetails.status_id) {
        Toast.clear();
        Dialog({ message: "状态不能回退" });
        return;
      }
      if (type === this.orderDetails.status_id) {
        Toast.clear();
        Dialog({ message: "状态重复" });
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
        })
        .finally(() => Toast.clear());
    },
    // 查询工单数据
    getOrderDetails() {
      this.$api.orderDetails(this.order_id).then((res) => {
        console.log(res);
        this.orderDetails = res;
      });
    },
    // 图片上传
    async afterRead(f) {
      let arr = [f];
      if (f.length) {
        arr = [...f];
      }
      for (const v of arr) {
        v.status = "uploading";
        v.message = "等待上传...";
      }
      for (const v of arr) {
        v.message = "上传中...";
        v.path = await this.putOSS(v);
        if (v.path) {
          v.status = "done";
        } else {
          v.status = "failed";
          v.message = "上传失败";
        }
      }
      this.editOrderSpotImg();
    },
    editOrderSpotImg() {
      this.$api
        .editOrderSpotImg(
          this.orderDetails.spot_img_aliyun.map((v) => ({ path: v.path }))
        )
        .then((res) => {
          Dialog({ message: res.msg });
          this.getOrderDetails();
        })
        .catch((message) => Dialog({ message }));
    },
  },
};
</script>

<style lang="scss" scoped>
.itemValue {
  display: flex;
  flex-wrap: wrap;
}
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
::v-deep() .van-dialog {
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
::v-deep() .search {
  text-align: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.8rem 0;
  height: 2.2rem;
  .van-field {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .van-button {
    position: absolute;
    bottom: 0;
    height: 2.6rem;
  }
}
::v-deep() .stations {
  overflow: hidden !important;
  font-size: 1rem;
  font-weight: 600;
  position: relative;

  .textarea {
    background: #f9f9fa;
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.2rem;
    width: 90%;
    margin: 1rem auto;
    min-height: 6rem;
  }
  .flex {
    &:nth-child(1) .van-cell {
      padding-top: 0;
    }
    &:last-child .van-cell {
      padding-bottom: 0;
    }
    display: flex;
    @media all and (min-width: 550px) {
      .van-cell:nth-child(2) {
        .van-cell__title {
          width: 5rem;
        }
      }
    }
    justify-content: space-between;
    .van-cell {
      &__value {
        text-align: left;
        color: #666666;
      }
    }
  }
  .minP {
    @media all and (max-width: 550px) {
      display: block;
    }
  }
  .van-cell {
    flex: 1;
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
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.backHome {
  color: rgba(250, 207, 6, 1);
  font-size: 0.8rem;
  position: absolute;
  right: 1rem;
  top: 4rem;
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
</style>
