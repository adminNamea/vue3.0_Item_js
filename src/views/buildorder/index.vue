<template>
  <div class="createSingle">
    <div class="top">
      <div class="step">
        <div class="progress" :style="{ width: width + '%' }"></div>
        <div
          v-for="(item, index) in stepDate"
          :key="index"
          :class="{ img: true, active: active === index }"
        >
          <div @click="stepClick(index, item.name)">
            <img :src="item.img" />
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </div>
    <component
      v-model:comName="comName"
      v-model:form="form"
      @next="next"
      :is="comName"
    ></component>
  </div>
</template>
<script>
import img from "@/assets/img/其他.png";
import img1 from "@/assets/img/基本信息.png";
import img2 from "@/assets/img/人员时间.png";
import img3 from "@/assets/img/新增项目.png";
import img4 from "@/assets/img/完成.png";
import { computed, reactive, ref, provide } from "vue";
import info from "./info.vue";
import crewTime from "./crewTime.vue";
import addItem from "./addItem.vue";
import other from "./other.vue";
import complete from "./complete.vue";
import station from "./station.vue";

export default {
  name: "buildorder",
  components: {
    info,
    crewTime,
    addItem,
    other,
    complete,
    station,
  },
  setup() {
    provide("options", [
      { value: 1, text: "保修工单" },
      { value: 2, text: "内部" },
      { value: 3, text: "外部" },
      { value: 4, text: "保养" },
      { value: 5, text: "交机前检查" },
      { value: 6, text: "交机" },
      { value: 7, text: "大修" },
    ]);
    const form = reactive({
      // 选中的主修数据
      checkedMajor: {},
      // 选中的副修数据
      minorData: [],
      // 机身编号
      serial_number: "",
      // 机型
      model: "",
      // 机器地址
      m_location: "",
      // 运行小时数
      total_hour: "",
      // 交机日期
      delivery_time: "",
      // PL机器地址
      pl_location: "",
      // 客户名
      custom_name: "",
      // 客户编号
      custom_number: "",
      // 客户电话
      custom_phone: "",
      // 联系人
      contact_name: "",
      // 联系电话
      phone: "",
      // 主修
      major_user_id: 0,
      // 副修
      minor_user_id: [],
      // 承诺派工时间
      promise_work_time: "",
      // 承诺到达时间
      promise_time: "",
      // 承诺完成时间
      promise_finish_time: "",
      // 是否停机
      is_halt: 0,
      // 服务车牌号
      service_car: "",
      // 客户反馈
      order_reason: "",
      // 备注
      order_note: "",
      // 项目
      item: [],
      // 工位
      station: [],
      // 工单类型
      order_type: 1,
    });
    const width = ref(0);
    const active = ref(0);
    const status = ref(0);
    const comName = ref("info");
    const stepDate = computed(() => {
      const obj =
        form.order_type === 7
          ? { img, text: "工位选择", name: "station" }
          : { img, text: "其他", name: "other" };
      return [
        {
          img: img1,
          text: "基本信息",
          name: "info",
        },
        {
          img: img2,
          text: "人员时间",
          name: "crewTime",
        },
        {
          img: img3,
          text: "新增项目",
          name: "addItem",
        },
        obj,
        {
          img: img4,
          text: "完成",
          name: "complete",
        },
      ];
    });
    function next() {
      active.value += 1;
      status.value += 1;
      width.value = active.value * 22;
      comName.value = stepDate.value[active.value].name;
    }
    function stepClick(index, name) {
      if (status.value > index) {
        width.value = index * 22;
        active.value = index;
        comName.value = name;
        status.value = index;
      }
    }
    return {
      form,
      width,
      active,
      status,
      comName,
      stepDate,
      next,
      stepClick,
    };
  },
};
</script>
<style lang='scss' scoped>
.createSingle {
  height: 100%;
}
.step {
  width: 100%;
  position: relative;
  .progress {
    background: linear-gradient(to right, #ffcd11 0%, #ffe775 100%);
    position: absolute;
    top: 0.5rem;
    z-index: 0;
    transform-origin: left;
    left: 2rem;
    height: 1.3rem;
    transition: all 0.3s;
  }
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img {
    text-align: center;
    display: contents;
    font-size: 0.8rem;
    height: 5rem;
    width: 5rem;
    img {
      position: relative;
      z-index: 1;
      height: 2.2rem;
      width: 2.2rem;
      transition: all 0.3s;
    }
  }
  .active {
    font-weight: bold;
    img {
      transform: scale(1.31);
    }
  }
}
</style>
