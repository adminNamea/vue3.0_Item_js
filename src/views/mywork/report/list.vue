<template>
  <div class="j_report">
    <card :hed="false" :top="false">
      <div class="left">合同中的客户信息</div>
      <van-field
        v-model="form.total_hour"
        label="设备工作小时数"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field v-model="form.sims_describe" label="SIMS 故障描述" />
      <van-field
        v-model="form.place_of_origin"
        label="始发地"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.destination"
        label="目的地"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.distance"
        label="单程距离(/km)"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
    </card>
    <card :hed="false" :top="false">
      <div class="left">保养项目清单</div>
      <van-cell
        v-for="(v, i) in listData"
        :key="i"
        :title="v.tltie"
        @click="checkde(String(v.id))"
        value="完成"
      >
        <template #right-icon>
          <van-icon :name="icon(String(v.id))" />
        </template>
      </van-cell>
    </card>
    <card :hed="false" :top="false">
      <div class="left">提供给客户的建议</div>
      <van-field
        v-model="form.finding"
        label="备注和建议"
        class="textarea"
        type="textarea"
      />
      <van-cell
        value-class="cen"
        title="下一次的保养时间"
        value="自动填写"
      ></van-cell>
    </card>
  </div>
</template>

<script>
import { Dialog } from "vant";
import card from "@/components/card/index.vue";

export default {
  components: {
    card,
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
      addIcon: require("@/assets/img/addicon.png"),
      listData: [],
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
    };
  },
  created() {
    this.getItemProjectList();
  },
  methods: {
    getItemProjectList() {
      this.$api
        .getItemProjectList({ project_type: 1 })
        .then((res) => {
          this.listData = res || [];
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    deleteImg(file) {
      this.form.image.forEach((img, index) => {
        if (img.image_path_aliyun === file.image_path_aliyun) {
          this.form.image.splice(index, 1);
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
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-cell {
  display: flex;
  align-items: center;
  overflow: visible;
  &__value {
    margin-right: 1rem;
    overflow: visible;
  }
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
/deep/ .van-field {
  &__label {
    color: #333333;
    align-items: center;
    margin: 0;
    font-size: 0.8rem;
    flex: 1;
  }
  &__value {
    color: #666666;
    flex: 1;
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

.textarea {
  align-items: flex-start;
  /deep/ .van-field__control {
    height: 5rem;
  }
}
.cen {
  display: flex;
  justify-content: center;
}
</style>
