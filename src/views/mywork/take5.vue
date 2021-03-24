<template>
  <div class="fillInfo">
    <van-action-sheet v-model:show="showPopup">
      <div class="search">
        <van-field
          @input="search"
          left-icon="search"
          v-model="keyword"
          placeholder="请输入名称或者角色"
        />
      </div>
      <div class="popupBody">
        <div
          class="imgCell"
          v-for="(item, index) in userList"
          :key="index"
          @click="checkedClick(item)"
        >
          <img :src="isChecked(item)" />
          <van-cell class="not" :title="'姓名：' + item.name_cn" />
        </div>
      </div>
      <van-button
        class="b_fixed"
        block
        @click="confirm"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        >确定</van-button
      >
    </van-action-sheet>
    <van-dialog v-model:show="show" width="90%" show-cancel-button>
      <div class="dialog__header">
        {{ taekTitle }}
        <div class="right">
          <span>是</span>
          <span>否</span>
          <span>不适用</span>
        </div>
      </div>
      <div class="dialog__c">
        <div v-for="(v, i) in dialogList" :key="i">
          <van-cell v-if="v.type == 3" :title="i + 1 + '.' + v.title">
            <template #right-icon>
              <div
                class="rightIcon"
                style="width: 9rem; justify-content: space-around"
              >
                <van-icon
                  @click="v.status == 1 ? (v.status = null) : (v.status = 1)"
                  :name="v.status == 1 ? checkedIcon : noCheckedIcon"
                />
                <van-icon
                  @click="v.status == 2 ? (v.status = null) : (v.status = 2)"
                  :name="
                    v.status == 2
                      ? require('@/assets/img/choice-red.png')
                      : noCheckedIcon
                  "
                />
                <van-icon
                  @click="v.status == 3 ? (v.status = null) : (v.status = 3)"
                  :name="
                    v.status == 3
                      ? require('@/assets/img/choice-red.png')
                      : noCheckedIcon
                  "
                />
              </div>
            </template>
          </van-cell>
          <van-field
            v-if="v.type == 4"
            :label="v.title"
            class="textarea"
            type="textarea"
            v-model="v.msg"
          />
        </div>
      </div>
    </van-dialog>
    <card :title="'定位:' + takeList.location" :top="false">
      <van-cell
        title="工作单号:"
        class="lo"
        :value="takeList.order_number"
      ></van-cell>
      <van-cell
        class="lo"
        title="工作内容描述:"
        :value="takeList.order_reason"
      ></van-cell>
    </card>
    <card :hed="false" :top="false" v-for="(v, i) in takeData" :key="i">
      <div class="leftBlock">
        <div class="left">
          {{ v.title }}
          <div v-if="v.is" class="is">
            <span>是</span>
            <span>否</span>
          </div>
        </div>
      </div>
      <div v-for="(item, index) in v.items" :key="index">
        <div class="f" v-if="item.type == 6">
          {{ item.title }}
        </div>
        <van-cell
          v-if="item.type != 4 && item.type != 5 && item.type != 6"
          :title="TITLE(item, index, i)"
        >
          <template #icon v-if="item.required">
            <van-icon
              class="leftIcon"
              :name="require('@/assets/img/星星.png')"
            />
          </template>
          <template #right-icon>
            <div class="rightIcon">
              <van-icon
                v-if="item.type != 7"
                @click="itemShow(item)"
                :name="item.status == 1 ? checkedIcon : noCheckedIcon"
              />
              <van-icon
                @click="
                  item.status == 2 ? (item.status = null) : (item.status = 2)
                "
                v-if="item.type == 2"
                :name="
                  item.status == 2
                    ? require('@/assets/img/choice-red.png')
                    : noCheckedIcon
                "
              />
              <span
                v-if="item.parent == 1 && item.status == 1"
                @click="itemShow(item, true)"
                style="color: #368ec1"
                >查看</span
              >
            </div>
          </template>
        </van-cell>
        <van-field
          v-if="item.type == 4"
          class="textarea"
          type="textarea"
          v-model="item.msg"
        />
        <van-cell v-if="item.type == 5" title="上传图片：" class="upload">
          <van-uploader
            @delete="deleteImg"
            :max-count="9"
            multiple
            :after-read="afterRead"
            v-model="item.msg"
          >
            <img
              style="height: 4rem; width: 4rem"
              src="@/assets/img/uploader.png"
            />
          </van-uploader>
        </van-cell>
        <van-cell v-if="item.is_notice" :class="{ disable: item.status != 1 }">
          <template #title>
            抄送人：{{ item.user.map((u) => u.name_cn).join(",") }}
          </template>
          <template #right-icon>
            <span
              @click="
                (showPopup = true),
                  (userItem = item),
                  (checkedUser = [...item.user])
              "
              :class="{ disable: item.status != 1 }"
              style="color: #368ec1"
              >添加抄送人</span
            >
          </template>
        </van-cell>
      </div>
    </card>
    <div v-sticky="false">
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
import { Dialog, Toast } from "vant";
// eslint-disable-next-line import/no-extraneous-dependencies
import { cloneDeep } from "lodash";
import { device } from "dingtalk-jsapi";

export default {
  components: {
    card,
  },
  data() {
    return {
      showPopup: false,
      keyword: "",
      userList: "",
      show: false,
      taekTitle: "",
      dialogType: 1,
      fileList: [],
      checkedIcon: require("@/assets/img/choice-blue.png"),
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      checkdeData: [],
      takeList: { location: "定位中...", list: [] },
      checkedUser: [],
      userItem: {},
    };
  },
  created() {
    this.search();
    this.getTakeList();
  },
  computed: {
    dialogList() {
      return this.takeList.list.filter((v) => v.parent_id === this.dialogType);
    },
    takeData() {
      const data = {
        1: {
          title: "第一步：停下来",
          items: [],
        },
        2: {
          title: "第二步：看一看",
          items: [],
        },
        3: {
          title: "第三步：是否识别危害",
          items: [],
        },
        4: {
          title: "第四步：做计划",
          items: [],
        },
        5: {
          title: "第五步：安全工作",
          items: [],
        },
      };
      this.takeList.list.forEach((v) => {
        if (v.parent_id === 0) {
          data[v.take].items.push(v);
          if (v.type === 2) {
            data[v.take].is = true;
          }
        }
      });
      return data;
    },
  },
  watch: {
    takeList(n) {
      if (n.list.length > 0) {
        device.geolocation
          .get({
            targetAccuracy: 200,
            coordinate: 1,
            withReGeocode: true,
            onSuccess: (result) => {
              if (result.address) {
                this.takeList.location = result.address;
              } else {
                const { province, city, district, road } = result;
                this.takeList.location = province + city + district + road;
              }
            },
            onFail: () => {
              this.takeList.location = "定位失败";
            },
          })
          .catch(() => {
            this.takeList.location = "定位失败";
          });
      }
    },
  },
  methods: {
    TITLE(item, index, i) {
      return i === 3
        ? item.type !== 7
          ? `${index - 1}.${item.title}`
          : item.title
        : `${index + 1}.${item.title}`;
    },
    async afterRead(f) {
      let arr = [f];
      if (f.length) {
        arr = [...f];
      }
      for (const v of arr) {
        v.message = "等待上传...";
        v.status = "uploading";
      }
      for (const v of arr) {
        v.message = "上传中...";
        this.putOSS(v)
          .then((path) => {
            v.status = "done";
            v.path = path;
          })
          .catch(() => {
            v.status = "failed";
            v.message = "上传失败";
          });
      }
    },
    itemShow(item, c) {
      if (c) {
        this.show = true;
        this.dialogType = item.id;
        this.taekTitle = item.title;
      } else if (item.status !== 1) {
        item.status = 1;
        if (item.parent === 1) {
          this.show = true;
          this.dialogType = item.id;
          this.taekTitle = item.title;
        }
      } else {
        item.status = null;
      }
    },
    async deleteImg(file) {
      if (file.path) {
        Toast.loading({
          duration: 0,
          overlay: true,
          message: "请稍后...",
          forbidClick: true,
        });
        await this.delOSS(file.path);
        Toast.clear();
      }
    },
    getTakeList() {
      this.$api
        .takeFive()
        .then((res) => {
          if (res.location === "定位失败" || !res.location) {
            res.location = "定位中...";
          }
          console.log(cloneDeep(res));
          this.takeList = { ...res, delImg: [] };
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    async onSubmit() {
      Toast.loading({
        duration: 0,
        overlay: true,
        message: "请稍后...",
        forbidClick: true,
      });
      const obj = cloneDeep(this.takeList);
      const { msg } = obj.list.find((v) => v.type === 5);
      msg.forEach((v) => {
        for (const key in v) {
          if (key !== "path") {
            delete v[key];
          }
        }
      });
      obj.list = JSON.stringify(obj.list);
      console.log(msg);
      this.$api
        .takeFiveEdit(obj)
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
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
    // 搜索事件
    search() {
      this.$api
        .getUserList({ keyword: this.keyword })
        .then((res) => {
          this.userList = res;
        })
        .catch((message) => {
          Dialog({ message });
          console.log(message);
        });
    },
    // 选中人员事件
    checkedClick(item) {
      const user = this.checkedUser.find((obj, index) => {
        if (obj.userid === item.userid) {
          this.checkedUser.splice(index, 1);
          return true;
        }
      });
      if (!user) {
        this.checkedUser.push(item);
      }
    },

    // 是否选中返回对应图片
    isChecked(item) {
      return this.checkedUser.includes(item)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    // 选中主副修确定
    confirm() {
      this.showPopup = false;
      this.userItem.user = [...this.checkedUser];
    },
  },
};
</script>
<style lang='scss' scoped>
.disable {
  opacity: 0.6;
  pointer-events: none;
}
.van-cell:last-child::after {
  display: inline-block;
}
.van-cell::after {
  transform: scale(1);
}
::v-deep() .search {
  position: sticky;
  z-index: 1;
  top: 0;
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

::v-deep() .van-action-sheet {
  height: 80%;
  .b_fixed {
    margin-top: 0;
  }
  .van-action-sheet__content {
    height: 100%;
  }
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
}
.popupBody {
  height: 82.27%;
  overflow: auto;
  .imgCell {
    img {
      height: 1rem;
    }
    width: 90%;
    display: flex;
    align-items: center;
    margin: 0 auto;
    border-bottom: 1px solid #dadada;
  }
}
::v-deep() .card .hed {
  background: #434343;
  display: flex;
  align-items: center;
  padding: 0.5rem 1.5rem;
  color: #ffffff;
  box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.08);
  font-size: 0.8rem;
  border-radius: 0.3rem 0.3rem 0px 0px;
  span {
    word-spacing: 3rem;
  }
}
.dialog__c {
  height: 25rem;
  overflow: auto;
}

.dialog__header {
  text-align: left;
  position: relative;
  z-index: 1;
  top: 0;
  padding: 0.5rem 1.5rem 0.5rem 1.5rem;
  background: linear-gradient(90deg, #ffcd11, #ffe775);
  .right {
    position: absolute;
    right: 0.1rem;
    top: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    span {
      margin-right: 1.5rem;
      &:nth-child(1) {
        margin-right: 2rem;
      }
      &:nth-child(2) {
        margin-right: 1rem;
      }
    }
  }
}
::v-deep() .van-dialog__footer {
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 3.5rem;
  background: #f7f7f7;
  .van-dialog__cancel {
    background: #d0d0d0;
    border-radius: 48px;
    color: #ffffff;
    flex: none;
    display: flex;
    align-items: center;
    height: 2.5rem;
    justify-content: center;
    width: 40%;
  }
  .van-dialog__confirm {
    background: linear-gradient(90deg, #ffcd11, #ffe775);
    border-radius: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40%;
    height: 2.5rem;
    color: #ffffff;
  }
  .van-hairline--left::after {
    display: none;
  }
}

.van-dialog {
  border-radius: 0.3rem;
}
.leftIcon {
  position: absolute;
  left: 0.5rem;
  top: 0.86rem;
}
.rightIcon {
  display: flex;
  position: relative;
  top: 0.2rem;
  height: 1rem;
  align-items: center;
  width: 3.3rem;
  justify-content: space-between;
}
.leftBlock {
  position: relative;
  display: block;
  margin: 1rem 0 0 0;
  .left {
    display: inline-block;
    font-size: 3vw;
    padding: 0.2rem 1.5rem;
    border-radius: 0 1rem 1rem 0;
    background: #434343;
    color: #ffffff;
  }
  .is {
    position: absolute;
    color: rgb(0, 0, 0);
    top: 0;
    right: 1.5rem;
    color: #666666;
    font-size: 2.5vw;
    span:nth-child(1) {
      margin-right: 1.7rem;
    }
  }
}
p {
  font-size: 1.1rem;
  margin: 0;
  padding: 0.7rem 1rem;
}
::v-deep() .van-cell {
  align-items: baseline;
  padding: 10px 1.5rem;
  font-size: 2.5vw;
}
.lo {
  .van-cell__title {
    flex: 1.4;
  }
  .van-cell__value {
    text-align: left;
    color: #333333;
    flex: 3;
  }
}
.f {
  padding: 0.1rem 1.5rem;
  height: 1.32rem;
  color: #ffffff;
  background: #616161;
}
.upload {
  align-items: end;
  .van-cell__value {
    flex: none;
    width: 80%;
    text-align: left;
  }
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
::v-deep() .textarea {
  align-items: flex-start;
  .van-field__control {
    position: relative;
    background: #f9f9fa;
    box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 1px 0px;
    border-radius: 0.2rem;
    padding: 0.5rem 1rem;
    height: 5rem;
  }
}
</style>
