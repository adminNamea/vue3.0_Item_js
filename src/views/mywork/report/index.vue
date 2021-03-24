<template>
  <div class="report">
    <card :top="false" :hed="false">
      <div class="right">
        <img src="@/assets/img/右信息.png" />
      </div>
      <p>项目名：{{ itemDetails.item_name }}</p>
      <div class="flex">
        <span>工单号：{{ itemDetails.order_number }}</span>
        <span>机器运行小时数：{{ itemDetails.total_hour || 0 }}</span>
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
        <span>机器地址：{{ itemDetails.m_location }}</span>
      </div>
      <div class="flex">
        <span>PL机器位置：{{ itemDetails.pl_location || "无" }}</span>
      </div>
      <span
        class="end"
        @click="$router.push({ name: 'index' })"
        style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
        >返回首页</span
      >
    </card>
    <van-form ref="form">
      <component
        :form="form"
        :keep="keep"
        v-if="comName != ''"
        :is="comName"
      ></component>
      <iframe
        v-else
        frameborder="0"
        scrolling="yes"
        style="width: 100%; min-height: 30rem; margin-top: 1rem"
        :src="jdyUrl"
      ></iframe>
      <div v-sticky="false" class="b_fixed" v-if="comName != ''">
        <van-button
          round
          block
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          native-type="button"
          @click="keep"
          >保存</van-button
        >
        <van-button
          round
          @click="onSubmit"
          block
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          native-type="submit"
          >提交</van-button
        >
      </div>
    </van-form>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import { Dialog, Toast } from "vant";
import list from "./list.vue";
import reportW from "./w_report.vue";
import reportJ from "./j_report.vue";

const defaultUpload = {
  2: {
    title: "现场发现图片",
    fileList: [],
  },
  5: {
    fileList: [],
    title: "现场工况",
  },
  6: {
    fileList: [],
    title: "机器铭牌",
  },
  7: {
    fileList: [],
    title: "工作小时数",
  },
  8: {
    fileList: [],
    title: "铭牌",
  },
  9: {
    fileList: [],
    title: "失效零件",
  },
  10: {
    fileList: [],
    title: "更换零件",
  },
};
export default {
  components: {
    card,
    list,
    reportW,
    reportJ,
  },
  data() {
    return {
      form: {
        cat_itemindicator: 1,
        // 类型，2：发现 5：工况 6：机器铭牌 7：小时数 8：发动机铭牌 9：失效零件 10：更换零件
        image: [],
        maintenance_list: [],
        project_msg: [],
        projectFileList: [],
        uploader: JSON.parse(JSON.stringify(defaultUpload)),
      },
      comName: "",
      itemDetails: {},
      jdyUrl: "",
    };
  },
  mounted() {
    if (this.comName === "") {
      this.$api.loginJdy().then((url) => {
        this.jdyUrl = url;
      });
    }
  },
  created() {
    const report = JSON.parse(sessionStorage.getItem("reportData"));
    this.comName = report.value;
    document.title = report.title;
    this.init();
  },
  methods: {
    async uploadOSS(add_type) {
      Toast.loading({
        duration: 0,
        overlay: true,
        message: "请稍后...",
        forbidClick: true,
      });
      const obj = { ...this.form, add_type };
      obj.image = [];
      for (const type in obj.uploader) {
        for await (const data of obj.uploader[type].fileList) {
          if (data.image_path_aliyun) {
            obj.image.push({
              image_path_aliyun: data.image_path_aliyun,
              image_des: data.image_des,
              type: data.type,
            });
          }
        }
      }
      delete obj.uploader;
      delete obj.projectFileList;
      return obj;
    },
    async keep(isk = true) {
      const api =
        this.comName === "reportW"
          ? "backItemReport"
          : this.comName === "reportJ"
          ? "addItemReportDeliver"
          : this.comName === "list"
          ? "addItemMaintenance"
          : "";
      if (!api) return;
      const res = await this.uploadOSS(0);
      console.log(res);
      this.$api[api](res)
        .then((r) => {
          if (isk) {
            Dialog({ message: r.msg });
          }
          this.getItemReport();
        })
        .catch((message) => {
          Dialog({ message });
        })
        .finally(() => {
          Toast.clear();
        });
    },
    async onSubmit() {
      const status = await this.$refs.form
        .validate()
        .then(() => true)
        .catch(() => false);
      if (!status) return false;
      const api =
        this.comName === "reportW"
          ? "addItemReport"
          : this.comName === "reportJ"
          ? "addItemReportDeliver"
          : this.comName === "list"
          ? "addItemMaintenance"
          : "";
      if (!api) return;
      const res = await this.uploadOSS(1);
      console.log(res);
      this.$api[api](res)
        .then((r) => {
          Dialog.alert({ message: r.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        })
        .finally(() => {
          Toast.clear();
        });
    },
    getItemReport() {
      this.$api
        .getItemReport()
        .then((res) => {
          this.form.uploader = JSON.parse(JSON.stringify(defaultUpload));
          res.maintenance_list = res.maintenance_list || [];
          res.part_name =
            res.part_name && res.part_name.length > 0
              ? res.part_name
              : [{ name: "" }];
          res.image &&
            res.image.forEach((img) => {
              this.form.uploader[img.type].fileList.push(img);
            });
          const arr = [];
          res.project_msg &&
            res.project_msg.forEach((img) => {
              if (img.item_project_list_id !== 21) {
                arr.push(img);
              }
            });
          this.form.projectFileList = arr;
          this.form = { ...this.form, ...res };
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    init() {
      const order_item_id = sessionStorage.getItem("order_item_id");
      this.getItemReport();
      this.$api
        .getItemDetails(order_item_id)
        .then((res) => {
          this.itemDetails = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.report {
  font-family: AlibabaPuHuiTi;
}
.b_fixed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 49%;
  }
}
.end {
  position: absolute;
  right: 1rem;
  bottom: 1rem;
}
.flex {
  display: flex;
  align-items: center;
  font-size: 0.85rem;
  span {
    flex: 1;
    margin-bottom: 0.1rem;
  }
}
.card {
  overflow: visible !important;
  padding: 0 1rem 1rem 1rem;
}
.right {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  img {
    height: 5rem;
    transform: scale(1.07);
  }
}
p {
  margin: 0;
  padding: 0.5rem 0;
  font-size: 1.1rem;
}
</style>
