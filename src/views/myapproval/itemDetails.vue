<template>
  <div>
    <card :hed="false" :top="false" style="min-height: 3rem">
      <div class="title">
        <span>项目名：{{ dsList.item.item_name }}</span>
        <span
          @click="$router.push({ name: 'index' })"
          style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
          >返回首页</span
        >
      </div>
    </card>
    <card :hed="false" :top="false">
      <div class="leftTitle">
        <span class="left">零件</span>
        <u class="right" @click="pClick">零件清单</u>
      </div>
      <div class="f">零件详情</div>
      <van-cell
        title="零件需求日期："
        :value="dsList.item.deadline_parts_time"
      ></van-cell>
      <van-cell
        title="零件领取日期："
        :value="dsList.item.real_parts_time"
      ></van-cell>
      <div class="f">额外零件详情</div>
      <van-cell title="零件：" :value="dsList.item.extra_parts"></van-cell>
      <van-cell
        title="零件需求日期："
        :value="dsList.item.extra_deadline_parts_time"
      ></van-cell>
      <van-cell
        title="零件领取日期："
        :value="dsList.item.extra_real_parts_time"
      ></van-cell>
    </card>
    <card :hed="false" :top="false">
      <div class="leftTitle">
        <span class="left">{{ filterType(dsList.item.order_item_type) }}</span>
      </div>
      <div class="not" v-if="dsList.item.order_item_type != 6">
        <div class="f">基础信息</div>
        <div class="flex" v-if="dsList.item.order_item_type != 4">
          <van-cell>
            <template #title>
              交机日期：
              <span style="color: #969799">{{
                dsList.report.delivery_date
              }}</span>
            </template>
          </van-cell>
          <van-cell>
            <template #title>
              机器行驶公里数：
              <span style="color: #969799">{{
                dsList.report.drive_distance
              }}</span>
            </template>
          </van-cell>
        </div>
        <div class="flex">
          <van-cell>
            <template #title>
              机器工作小时数：
              <span style="color: #969799">{{ dsList.report.drive_hour }}</span>
            </template>
          </van-cell>
          <van-cell v-if="dsList.item.order_item_type == 4">
            <template #title>
              单程距离：
              <span style="color: #969799">{{ dsList.report.distance }}</span>
            </template>
          </van-cell>
          <van-cell v-else>
            <template #title>
              工地：
              <span style="color: #969799">{{ dsList.report.end_area }}</span>
            </template>
          </van-cell>
        </div>
        <div class="flex">
          <van-cell>
            <template #title>
              始发地：
              <span style="color: #969799">{{ dsList.report.start_area }}</span>
            </template>
          </van-cell>
          <van-cell v-if="dsList.item.order_item_type != 4">
            <template #title>
              零件问题：
              <span style="color: #969799">{{
                dsList.report.issue_discription
              }}</span>
            </template>
          </van-cell>
          <van-cell v-else>
            <template #title>
              目的地：
              <span style="color: #969799">{{
                dsList.report.destination
              }}</span>
            </template></van-cell
          >
        </div>
        <van-cell v-if="dsList.item.order_item_type != 4">
          <template #title>
            部件代码：
            <span style="color: #969799">{{ dsList.report.issue_code }}</span>
          </template></van-cell
        >
        <van-cell v-else>
          <template #title>
            SIMS（故障描述）：
            <span style="color: #969799">{{
              dsList.report.sims_describe
            }}</span>
          </template></van-cell
        >
      </div>
      <div
        v-if="
          dsList.item.order_item_type != 6 && dsList.item.order_item_type != 4
        "
      >
        <div class="f">详细信息</div>
        <van-cell
          title="客户抱怨："
          :value="dsList.report.customer_complain"
        ></van-cell>
        <van-cell title="现场发现：" :value="dsList.report.finding"></van-cell>
        <van-cell
          title="故障根源："
          :value="dsList.report.root_cause"
        ></van-cell>
        <van-cell
          title="如何修复："
          :value="dsList.report.repair_way"
        ></van-cell>
        <van-cell
          title="导致被损害的零件说明："
          :value="dsList.report.resultan_damage"
        ></van-cell>
        <van-cell
          title="内部特别说明："
          :value="dsList.report.internal_note"
        ></van-cell>
        <van-cell
          title="部件自身的序列号："
          :value="dsList.report.related_serial_number"
        ></van-cell>
        <van-cell
          title="卡特零件标识："
          :value="dsList.report.cat_itemindicator == 0 ? '否' : '是'"
        ></van-cell>
        <van-cell
          title="零件数量："
          :value="dsList.report.issue_parts_count"
        ></van-cell>
        <div class="f">现场发现图片</div>
        <van-uploader
          v-if="fileList7.length > 0"
          :preview-options="{ closeable: true }"
          :max-count="0"
          :deletable="false"
          v-model="fileList7"
        >
          <template class="preview-cover" #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
        <div class="f">现场工况图片</div>
        <van-uploader
          v-if="fileList1.length > 0"
          :preview-options="{ closeable: true }"
          :max-count="0"
          :deletable="false"
          v-model="fileList1"
        >
          <template #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
        <div class="f">机器铭牌图片</div>
        <van-uploader
          v-if="fileList2.length > 0"
          :preview-options="{ closeable: true }"
          :max-count="0"
          :deletable="false"
          v-model="fileList2"
        >
          <template #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
        <div class="f">工作小时数图片</div>
        <van-uploader
          v-if="fileList3.length > 0"
          :preview-options="{ closeable: true }"
          :deletable="false"
          :max-count="0"
          v-model="fileList3"
        >
          <template #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
        <div class="f">铭牌图片</div>
        <van-uploader
          v-if="fileList4.length > 0"
          :preview-options="{ closeable: true }"
          :deletable="false"
          :max-count="0"
          v-model="fileList4"
        >
          <template #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
        <div class="f">失效零件图片</div>
        <van-uploader
          v-if="fileList5.length > 0"
          :preview-options="{ closeable: true }"
          :max-count="0"
          :deletable="false"
          v-model="fileList5"
        >
          <template #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
        <div class="f">更换零件图片</div>
        <van-uploader
          v-if="fileList6.length > 0"
          :preview-options="{ closeable: true }"
          :max-count="0"
          :deletable="false"
          v-model="fileList6"
        >
          <template #preview-cover="img">
            <div class="preview-cover">{{ img.image_des }}</div>
          </template>
        </van-uploader>
        <p v-else>暂无图片</p>
      </div>
      <div v-if="dsList.item.order_item_type == 6">
        <div class="f">合同中的客户信息</div>
        <van-cell
          title="客户/公司名称"
          :value="dsList.report.customer_name"
        ></van-cell>
        <van-cell
          title="手机"
          :value="dsList.report.customer_mobile"
        ></van-cell>
        <van-cell
          title="电子邮箱"
          :value="dsList.report.customer_email"
        ></van-cell>
        <van-cell
          title="邮政地址"
          :value="dsList.report.customer_address"
        ></van-cell>
        <van-cell title="设备签收人" :value="dsList.signer_name"></van-cell>
        <van-cell
          title="设备签收人电话"
          :value="dsList.report.signer_mobile"
        ></van-cell>
        <van-cell
          title="设备签收人邮箱"
          :value="dsList.report.signer_email"
        ></van-cell>
        <van-cell
          title="设备交付地点"
          :value="dsList.report.delivery_address"
        ></van-cell>
        <van-cell
          title="设备应用场景"
          :value="dsList.report.application_scenarios"
        ></van-cell>
        <van-cell title="物料" :value="dsList.report.materiel"></van-cell>
        <van-cell
          title="设备工作小时"
          :value="dsList.report.total_hour"
        ></van-cell>
        <van-cell
          title="设备部件名称"
          v-for="(v, k) in dsList.report.part_name"
          :key="k"
          :value="v.name"
        ></van-cell>
        <div class="f">交机项目清单</div>
        <van-cell
          class="ri"
          v-for="(v, k) in dsList.report.project_list"
          :key="k"
        >
          <span
            v-if="v.data_type == 0"
            :style="{ color: statusTitle(v.id) ? '#666666' : '#E42828' }"
          >
            {{ statusTitle(v.id) ? "完成" : "未完成" }}</span
          >
          <template v-if="v.data_type == 2" #title>
            {{ v.tltie }}
            <span style="color: rgba(0, 0, 0, 0.5)">（{{ v.remarks }}）</span>
            <br />
            <br />
            <van-uploader
              :preview-options="{ closeable: true }"
              :max-count="0"
              :deletable="false"
              v-model="project_msg1"
            >
            </van-uploader>
          </template>
          <template v-else-if="v.data_type == 3" #title>
            {{ v.tltie }}
            <br />
            <van-uploader
              :preview-options="{ closeable: true }"
              :max-count="0"
              :deletable="false"
              v-model="project_msg2"
            >
            </van-uploader>
          </template>
          <template v-else #title>
            {{ v.tltie }}
            <span v-if="v.remarks" style="color: rgba(0, 0, 0, 0.5)"
              >（{{ v.remarks }}）</span
            >
          </template>
        </van-cell>
      </div>
      <div v-if="dsList.item.order_item_type == 4" class="ri">
        <div class="f">保养项目清单</div>
        <van-cell
          v-for="(v, k) in dsList.report.project_list"
          :title="v.tltie"
          :key="k"
        >
          <span :style="{ color: statusTitle(v.id) ? '#666666' : '#E42828' }">
            {{ statusTitle(v.id) ? "完成" : "未完成" }}</span
          >
        </van-cell>
        <div class="f">提供给客户的建议</div>
        <van-cell
          title="备注和建议："
          :value="dsList.report.finding"
        ></van-cell>
        <van-cell
          title="下次保养时间："
          :value="dsList.report.maintenance_time"
        ></van-cell>
      </div>
    </card>
    <card :hed="false" :top="false">
      <div class="leftTitle">
        <span class="left">开支费用</span>
      </div>
      <van-cell
        class="pa"
        v-for="(v, k) in dsList.item_resume"
        :title="'费用：' + v.type_name"
        :key="k"
        :value="'金额：' + v.cost"
      ></van-cell>
    </card>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Toast } from "vant";

export default {
  components: {
    card,
  },
  data() {
    return {
      dsList: { item: {}, item_resume: {}, report: { image: [] } },
    };
  },
  // 类型，2：发现 5：工况 6：机器铭牌 7：小时数 8：发动机铭牌 9：失效零件 10：更换零件
  computed: {
    fileList1() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 5);
    },
    fileList2() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 6);
    },
    fileList3() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 7);
    },
    fileList4() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 8);
    },
    fileList5() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 9);
    },
    fileList6() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 10);
    },
    fileList7() {
      const arr = this.dsList.report.image || [];
      return arr.filter((v) => v.type === 2);
    },
    project_msg1() {
      return this.dsList.report.project_msg.filter(
        (v) => v.item_project_list_id !== 21
      );
    },
    project_msg2() {
      return this.dsList.report.project_msg.filter(
        (v) => v.item_project_list_id === 21
      );
    },
  },
  created() {
    Toast.loading({
      message: "加载中...",
      forbidClick: true,
      duration: 0,
      overlay: true,
    });
    this.OrderApprovalItem();
  },
  methods: {
    filterType(value) {
      const obj = {
        4: "保养项目清单",
        5: "交机前检查报告",
        6: "交机报告",
        7: "大修报告",
      };

      return obj[value] || "维修报告";
    },
    statusTitle(i) {
      return this.dsList.report.maintenance_list.includes(String(i));
    },
    OrderApprovalItem() {
      this.$api.OrderApprovalItem().then((res) => {
        if (!res.item.order_item_type) {
          res.item.order_item_type = res.item.order_type;
        }
        this.dsList = res;
        Toast.clear();
      });
    },
    pClick() {
      console.log(this.dsList.item.parts_url);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep() .van-uploader {
  margin: 1rem 0 1rem 1rem;
}
.ri .van-cell {
  &__value {
    text-align: right;
    flex: 0.1;
  }
}
.preview-cover {
  position: absolute;
  bottom: 0;
  box-sizing: border-box;
  width: 100%;
  padding: 4px;
  color: #fff;
  font-size: 12px;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
}
::v-deep() .van-cell::after {
  transform: scale(1);
}
.not .van-cell::after {
  display: none;
}
.title {
  font-weight: 400;
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  line-height: 3.5rem;
}
.f {
  padding: 0.1rem 1rem;
  height: 1.32rem;
  color: #ffffff;
  background: #616161;
}
::v-deep() .van-cell {
  &__value {
    text-align: left;
  }
}
.flex {
  display: flex;
  position: relative;
  align-items: center;
  &::after {
    position: absolute;
    box-sizing: border-box;
    content: " ";
    pointer-events: none;
    right: 16px;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
  }
}
.pa {
  padding-top: 0;
}
.leftTitle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    background: rgba(67, 67, 67, 1);
    border-radius: 0 3rem 3rem 0;
    padding: 0.3rem 1rem;
    color: #ffffff;
  }
  .right {
    color: #2475a2;
    padding-right: 1rem;
  }
  margin: 1rem 0;
}
p {
  color: #969799;
  font-size: 12px;
  margin: 0.5rem 0;
  padding-left: 1rem;
}
</style>
