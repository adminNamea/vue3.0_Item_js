<template>
  <div class="w_report">
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      title="交机日期"
      get-container="body"
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
      <div class="left">零件</div>
      <van-cell
        title="故障讯息"
        is-link
        @click="$router.push({ name: 'partsProblem' })"
        :value="form.partsIssue == 0 ? '未录入' : '已录入'"
      ></van-cell>
    </card>
    <card :hed="false" :top="false">
      <div class="left">维修信息</div>
      <van-cell
        value-class="input"
        title="交机日期"
        @click="showTime = true"
        :value="form.delivery_date"
        is-link
      ></van-cell>
      <van-field
        v-model="form.drive_distance"
        label="设备行驶里程/KM"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.drive_hour"
        label="设备工作小时/H"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.start_area"
        label="始发地"
        placeholder="请输入"
      />
      <van-field v-model="form.end_area" label="工地" placeholder="请输入" />
      <van-field v-model="form.mileage" label="里程" placeholder="请输入" />
    </card>
    <card :hed="false" :top="false">
      <div class="left">客户抱怨</div>
      <van-field
        v-model="form.customer_complain"
        label="描述"
        class="textarea"
        type="textarea"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
    </card>
    <card :hed="false" :top="false">
      <div class="left">发现现场</div>
      <van-field
        v-model="form.finding"
        label="描述"
        class="textarea"
        type="textarea"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-cell
        v-for="(f, key) in form.uploader"
        :key="key"
        :title="f.title"
        value-class="upLoad"
      >
        <van-uploader
          :preview-options="{ closeable: true }"
          :max-count="3"
          @delete="deleteImg"
          v-model="f.fileList"
          :after-read="(file) => afterRead(file, key)"
        >
          <img
            style="height: 4rem; width: 4rem"
            src="@/assets/img/uploader.png"
          />
          <template #preview-cover="img">
            <van-field
              @click.stop="1"
              class="preview-cover van-ellipsis"
              v-model="img.image_des"
              placeholder="请输入描述"
            />
          </template>
        </van-uploader>
      </van-cell>
    </card>
    <card :hed="false" :top="false">
      <div class="left">故障根源</div>
      <van-field
        v-model="form.root_cause"
        label="描述"
        class="textarea"
        type="textarea"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
    </card>
    <card :hed="false" :top="false">
      <div class="left">如何修复</div>
      <van-field
        v-model="form.repair_way"
        label="描述"
        class="textarea"
        type="textarea"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
    </card>
    <card :hed="false" :top="false">
      <div class="left">其他信息</div>
      <van-field
        v-model="form.resultan_damage"
        label="导致被损害的零件说明"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.internal_note"
        label="内部特别说明"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
      <van-field
        v-model="form.related_serial_number"
        label="内部自身的序列号"
        placeholder="请输入（必填）"
        :rules="[{ required: true }]"
      />
    </card>
    <card :hed="false" :top="false">
      <h3>
        <span>是否卡特零件标识（必填）</span>
        <div>
          <div @click="form.cat_itemindicator = 1">
            是
            <img
              :src="form.cat_itemindicator == 0 ? noCheckedIcon : checkedIcon"
            />
          </div>
          <div @click="form.cat_itemindicator = 0">
            否
            <img
              :src="form.cat_itemindicator == 0 ? checkedIcon : noCheckedIcon"
            />
          </div>
        </div>
      </h3>
    </card>
  </div>
</template>

<script>
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
      icon: require("@/assets/img/del.png"),
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      showTime: false,
      currentDate: new Date(),
    };
  },
  methods: {
    deleteImg(file) {
      this.form.delImg.push(file.image_path_aliyun);
    },
    afterRead(v, key) {
      v.type = key;
      v.image_des = "图片描述";
    },
    dialogConfirm() {
      this.form.delivery_date = this.filterTime(this.currentDate);
    },
  },
};
</script>

<style lang="scss"  scoped>
.w_report {
  font-family: AlibabaPuHuiTi;
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
::v-deep .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep .van-dialog {
  border-radius: 1rem;
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
      height: 1rem;
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
::v-deep .van-uploader__preview-delete {
  background: rgba(0, 0, 0, 0);
  top: -0.8rem;
  right: -0.5rem;
  .van-icon-cross::before {
    content: url("del.png");
  }
}
::v-deep .van-uploader__preview-image {
  height: 4rem;
  width: 4.5rem;
  .van-image__img {
    border-radius: 1rem;
  }
  overflow: visible;
}
::v-deep .upLoad {
  overflow: visible;
  margin-left: -0.5rem;
  height: 6.5rem;
  text-align: left;
}
::v-deep .van-uploader__wrapper {
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
  ::v-deep .van-field {
    &__value {
      padding: 0 0.2rem;
    }
  }
}
::v-deep .van-field {
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
  ::v-deep .van-field__control {
    height: 5rem;
  }
}
</style>
