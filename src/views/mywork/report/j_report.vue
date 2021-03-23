<template>
  <div class="j_report">
    <van-dialog
      :closeOnClickOverlay="true"
      v-model:show="show"
      @cancel="$refs.SignCanvas.canvasClear()"
      @confirm="saveAsImg"
      :show-confirm-button="false"
      style="text-align: center; padding-top: 1rem"
    >
      <sign-canvas
        class="sign-canvas"
        ref="SignCanvas"
        :options="options"
        v-model="value"
      />
      <div class="btnG">
        <div
          class="cancel"
          @click="$refs.SignCanvas.canvasClear(), (show = false)"
        >
          取 消
        </div>
        <div class="cancel" @click="$refs.SignCanvas.canvasClear()">清 空</div>
        <div class="confirm" @click="saveAsImg">确 定</div>
      </div>
    </van-dialog>
    <card :hed="false" :top="false">
      <div class="left">合同中的客户信息</div>
      <van-field
        v-model="form.customer_name"
        label="客户/公司名称"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.customer_mobile"
        label="手机"
        placeholder="请输入"
      />
      <van-field
        v-model="form.customer_email"
        label="电子邮箱"
        placeholder="请输入"
      />
      <van-field
        v-model="form.customer_address"
        label="邮政地址"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.signer_name"
        label="设备签收"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.signer_mobile"
        label="设备签收人电话"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.signer_email"
        label="设备签收人邮箱"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.delivery_address"
        label="设备交付地点"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-cell title="设备应用场景">
        <select_a
          v-model="form.application_scenarios"
          :options="a_options"
        ></select_a>
      </van-cell>
      <van-cell title="物料">
        <select_a v-model="form.materiel" :options="m_options"></select_a>
      </van-cell>
      <van-field
        v-model="form.total_hour"
        label="设备工作小时"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-for="(v, i) in form.part_name"
        :key="i"
        v-model="v.name"
        label="设备部件名称"
        class="bg"
        placeholder="请输入零件编号/铭牌序列号"
        :rules="[{ required: true }]"
      >
        <template #right-icon>
          <van-icon
            v-if="i == 0"
            :name="addIcon"
            @click="form.part_name.push({ name: '' })"
          />
          <van-icon
            v-else
            :name="delIcon"
            @click="form.part_name.splice(i, 1)"
          />
        </template>
      </van-field>
    </card>
    <card :hed="false" :top="false">
      <div class="left">交机项目清单</div>
      <van-cell
        v-for="(v, i) in listData"
        :key="i"
        :value-class="{ textarea: v.data_type == 3 }"
        :style="v.data_type != 0 ? 'align-items: flex-start' : ''"
        @click="checkde(String(v.id))"
      >
        <van-image
          @click="show = true"
          v-if="v.data_type == 3"
          width="100%"
          height="100%"
          fit="scale-down"
          :src="autograph(v.id).url"
        >
          <template #loading>
            <span></span>
          </template>
        </van-image>
        <template v-if="v.data_type == 2" #title>
          文件，礼品和工具套件签收
          <span style="color: rgba(0, 0, 0, 0.5)">（添加签收单照片）</span>
          <br />
          <br />
          <van-uploader
            :preview-options="{ closeable: true }"
            :max-count="3"
            @delete="(file) => deleteImg(file, v.id)"
            v-model="form.projectFileList"
            :after-read="(file) => afterRead(file, v.id)"
          >
            <img
              style="height: 4rem; width: 4rem"
              src="@/assets/img/uploader.png"
            />
          </van-uploader>
        </template>
        <template v-else-if="v.data_type != 2" #title>
          {{ v.tltie }}
          <span v-if="v.remarks" style="color: rgba(0, 0, 0, 0.5)"
            >（{{ v.remarks }}）</span
          >
        </template>
        <template v-if="v.data_type == 0" #right-icon>
          <van-icon :name="icon(String(v.id))" />
        </template>
      </van-cell>
    </card>
  </div>
</template>

<script>
import card from "@/components/card/index.vue";
import select from "@/components/select/index.vue";
import SignCanvas from "@/components/SignCanvas/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
    select_a: select,
    SignCanvas,
  },
  props: {
    form: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      value: null,
      show: false,
      listData: [],
      options: {
        canvasWidth: 300,
        canvasHeight: 250,
        bgColor: "#ffffff",
        isShowBorder: false,
        isSign: true,
        writeColor: "#000000",
      },
      delIcon: require("@/assets/img/delicon.png"),
      addIcon: require("@/assets/img/addicon.png"),
      a_options: [
        { text: "泥土", value: "泥土" },
        { text: "岩石", value: "岩石" },
        { text: "沙砾", value: "沙砾" },
        { text: "金属", value: "金属" },
        { text: "玻璃", value: "玻璃" },
        { text: "化学品", value: "化学品" },
      ],
      m_options: [
        { text: "土方", value: "土方" },
        { text: "石方", value: "石方" },
        { text: "矿场", value: "矿场" },
        { text: "沼泽", value: "沼泽" },
        { text: "河道", value: "河道" },
      ],
      upDel: require("@/assets/img/del.png"),
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      item_project_list_id: "",
    };
  },
  created() {
    this.getItemProjectList();
  },
  methods: {
    autograph(id) {
      this.item_project_list_id = id;
      const data =
        this.form.project_msg.find((v) => v.item_project_list_id === id) || {};
      return data;
    },
    getItemProjectList() {
      this.$api
        .getItemProjectList({ project_type: 2 })
        .then((res) => {
          this.listData = res || [];
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    deleteImg(file, id) {
      this.form.project_msg.forEach((img, index) => {
        if (img.item_project_list_id === id) {
          if (img.msg && img.msg === file.msg) {
            this.form.project_msg.splice(index, 1);
            this.form.delImg.push(img.msg);
          } else if (file.file && file.file.name === img.name) {
            this.form.project_msg.splice(index, 1);
          }
          return false;
        }
      });
    },
    checkde(i) {
      const status = this.form.maintenance_list.find((v, index) => {
        if (v === i) {
          this.form.maintenance_list.splice(index, 1);
          return true;
        }
      });
      if (!status) {
        this.form.maintenance_list.push(i);
      }
    },
    icon(i) {
      const status = this.form.maintenance_list.includes(i);
      return status ? this.checkedIcon : this.noCheckedIcon;
    },
    /**
     * 保存手写图片
     */
    async saveAsImg() {
      this.show = false;
      if (this.value) {
        const a = this.form.project_msg.find(
          (v) => v.item_project_list_id === this.item_project_list_id
        );
        if (a) {
          a.url = this.value;
          if (a.msg) {
            this.form.delImg.push(a.msg);
            a.msg = "";
          }
        } else {
          this.form.project_msg.push({
            item_project_list_id: this.item_project_list_id,
            url: this.value,
          });
        }
      } else {
        this.deleteImg(this.item_project_list_id);
      }
    },
    afterRead(v, id) {
      this.form.project_msg.push({
        item_project_list_id: id,
        url: v.file,
        name: v.file.name,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.bg {
  .van-icon {
    transform: scale(1.4);
  }
}
::v-deep() .select {
  .cell {
    border-radius: 0.2rem;
    width: 5rem;
    background: rgba(55, 55, 55, 1);
    color: #fff;
    img {
      filter: none;
    }
  }
}
::v-deep() .van-cell {
  align-items: center;
  overflow: visible;
  &__value {
    overflow: visible;
  }
}
.w_report {
  font-family: AlibabaPuHuiTi;
}
h3 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 1.6rem 1rem 1rem 1rem;
  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:nth-child(1) {
      margin-right: 3rem;
    }
    img {
      margin-left: 0.5rem;
    }
  }
}
.left {
  margin: 4% 0 2% 0;
  display: inline-block;
  font-size: 1rem;
  font-size: 1.1rem;
  padding: 0.2rem 1rem;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
  color: #ffffff;
}
::v-deep() .van-uploader__preview-delete {
  background: rgba(0, 0, 0, 0);
  top: -0.8rem;
  right: -0.5rem;
  .van-icon-cross::before {
    content: url("del.png");
  }
}
::v-deep() .van-uploader__preview-image {
  width: 4rem;
  height: 4rem;
  .van-image__img {
    border-radius: 1rem;
  }
  overflow: visible;
}
::v-deep() .upLoad {
  overflow: visible;
  margin-left: -0.5rem;
  height: 6.5rem;
  text-align: left;
}
::v-deep() .van-uploader__wrapper {
  flex-wrap: nowrap;
}
.preview-cover {
  position: absolute;
  bottom: -2.3rem;
  border-radius: 0.3rem;
  width: 100%;
  padding: 0;
  background: rgba(249, 249, 250, 1);
  box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
  .van-field {
    &__value {
      padding: 0 0.2rem;
    }
  }
}
::v-deep() .van-field {
  padding-right: 1rem;
  &__label {
    color: #333333;
    align-items: center;
    margin: 0;
    font-size: 0.8rem;
    width: 50%;
  }
  &__right-icon {
    position: absolute;
    right: -2rem;
  }
  &__value {
    flex: none;
    width: 42%;
    color: #666666;
    margin-right: 1rem;
    font-size: 0.8rem;
    padding-left: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
    border-radius: 0.08rem;
  }
}
.input {
  text-align: left;
  padding-left: 1rem;
}

::v-deep() .textarea {
  height: 5rem;
  color: #666666;
  flex: 1;
  font-size: 0.8rem;
  background: rgba(249, 249, 250, 1);
  box-shadow: rgba(0, 0, 0, 0.25) 0 -1px 0 0;
  border-radius: 0.08rem;
  .van-image__img {
    filter: contrast(0.96);
  }
}
</style>
