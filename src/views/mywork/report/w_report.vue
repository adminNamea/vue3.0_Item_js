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
        :value="form.partsIssue == 1 ? '已录入' : '未录入'"
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
          :max-count="9"
          @delete="deleteImg"
          multiple
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
              :rules="[{ required: true }]"
              v-model="img.image_des"
              placeholder="图片描述"
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
        placeholder="请输入"
      />
      <van-field
        v-model="form.internal_note"
        label="内部特别说明"
        placeholder="请输入"
      />
      <van-field
        v-model="form.related_serial_number"
        label="内部自身的序列号"
        placeholder="请输入"
      />
    </card>
    <card :hed="false" :top="false">
      <h3>
        <span>是否卡特零件标识</span>
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
import { Toast } from "vant";

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
    keep: {
      default() {
        return () => {};
      },
      type: Function,
    },
  },
  data() {
    return {
      uarry: [],
      icon: require("@/assets/img/del.png"),
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      showTime: false,
      currentDate: new Date(),
    };
  },
  watch: {
    uarry(v) {
      if (v.length === 0) {
        this.keep(false);
      }
    },
  },
  methods: {
    deleteImg(file) {
      Toast.loading({
        duration: 0,
        overlay: true,
        message: "请稍后...",
        forbidClick: true,
      });
      this.form.image.forEach((v, i) => {
        if (v.image_path_aliyun === file.image_path_aliyun) {
          this.form.image.splice(i, 1);
        }
      });
      this.delOSS(file.image_path_aliyun).finally(() => {
        Toast.clear();
        this.keep(false);
      });
    },
    async afterRead(f, key) {
      let arr = [f];
      if (f.length) {
        arr = [...f];
      }
      for (const v of arr) {
        v.message = "等待上传...";
        v.status = "uploading";
        this.uarry.push(1);
      }
      for (const v of arr) {
        v.type = key;
        v.message = "上传中...";
        this.$set(v, "image_des", "");
        await this.putOSS(v, "reportImg", this.form.drive_hour)
          .then((image_path_aliyun) => {
            this.uarry.shift();
            v.status = "done";
            v.image_path_aliyun = image_path_aliyun;
          })
          .catch(() => {
            v.status = "failed";
            v.message = "上传失败";
          });
      }
    },
    dialogConfirm() {
      this.form.delivery_date = this.filterTime(this.currentDate);
    },
  },
};
</script>

<style lang="scss" scoped>
.w_report {
  font-family: AlibabaPuHuiTi;
}
::v-deep() .van-uploader .van-icon-cross {
  transform: scale(1);
  font-size: 1.5rem;
  background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAERUlEQVRYR81YUSi0aRR+3o+NiZjWJP0JpXCjtHOFaJrPaH5uNuzKjQsUcSNj2ZWIZJc1ckMULtzILtobVsZMIlzNptwspfDbTRrb0NgZLfNt5915Nf8w/8y/tdt3apppvnPe87znPOec9/0YPkL0ev0nWq1WBmAEoAeQqyjKp4wxjaIoXsbYHwCOATgBONxut93pdP4VrQsWjaLJZHrj9/stAOoB6KKxCei4ACxIkmS12Wy/R7L7IJjCwkKNRqPpY4y1A4gPXiwjIwNZWVnQ6XSIi4vDw8MDXC4Xzs7OcHFxEerXpyjKhNfrHTw4OPCGAxUWTFlZWb7f7/+BMZYnjHNzc1FZWYni4mIkJyeH3ejt7S329vawtraG42PK2j+iKMqvkiR9ubW1dfSa8atgZFk2K4ryI2MskYwyMzPR2toKvZ5oAtzf3+Pw8BCnp6e4vr6Gz+dDfHw8UlNTkZ2djYKCAiQkJHBdp9OJqakpnJ+fC0AextgXdrt9IxTQCzAEBMBPAOJIuaamBk1NTYiNjeW7XFpawv7+Ph4fH8NGhnSLiopQW1sLiibpzs7OYnl5Wdg8APg8FNB7YAKp2aeISJKEzs5OlJeXw+PxYHJyEjabLRIHXzw3mUxoa2tDYmIiNjc3MTY2Br/fTynzSJJUFJyyZzABsv4iONLV1cWBEBl7enpwdXX10UCEQVpaGoaHh0GkJ0Cjo6PPHPJ6vZ8JUj+DMRqN3zLGvhapaWlp4UDa29txd3f3r4EIw6SkJExMTHBA09PTzylTFOU7h8PxDelxMIE+ckrlS2SdmZnhpCRAFBFKGVXQ0dER3G531MC0Wi3y8/N5ZVFqKEIEhMje3NwsSO2TJCmb+hAHI8uyFUAH/R4ZGeFVQ9+CIyUlJejv78fl5SUsFgtubm4iAkpJSYHVakV6ejoGBgawu7vLbYhD3d3dvMroOyDjdrvdwgItnrqjjphPRKWqIdIJoR1SiGnhaAAFAyF9SnVwRMkH+SIfgT7kcrvdb5jBYDDHxMT8TI47OjpQUVGBwcFB7OzsvLf7UAfhIhSNXmlpKfr6+rC+vo7x8XHh5y2TZZmo/RX9s7KywvtJdXX1q30kkqNIz4VX8kG+qP+Qr4B8T2DsNIWJ5fPz85xsxI9wEs5htEDEusQjKoqGhgYxyxzMaDS+Y4yli9AtLCyAPh+SUMfUQ6gXRcspWru+vp5/gijxG4H5k84jVVVVfP5Qh9zYeDE2XmALBiQeRkNuoWs2m3mHp7m1urpKHdlLaVJIoa6uDo2NjRgaGsL29nbE0iWFnJwcvpgQ2szJyUlUtgaDAb29vZibm8Pi4iK3UVdkVMUZVVWTqvqMWjrw09PTW3XNJiop1UztwFine5E6zjMESDUnPQKjqjMwAVLN7UAMFNXcm4IBqeJGKQC9dtfOy8vjx9L/9a4tAKnmLUTwoUQV72dCT0n/9ZurvwFcCNLyEBAVRAAAAABJRU5ErkJggg==");
  background-size: 100%;
}
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
::v-deep() .van-uploader__preview-delete {
  background-color: rgba(0, 0, 0, 0);
  top: -0.4rem;
  right: -0.2rem;
}
::v-deep() .van-uploader__preview {
  margin: 0 0.5rem 3rem 0;
}
::v-deep() .van-uploader__preview-image {
  height: 4rem;
  width: 4.5rem;
  .van-image__img {
    border-radius: 1rem;
  }
  overflow: visible;
}
.upLoad {
  overflow: visible;
  margin-left: -0.5rem;
  text-align: left;
}
::v-deep() .preview-cover {
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

::v-deep() .textarea {
  .van-field__control {
    height: 5rem;
  }
}
</style>
