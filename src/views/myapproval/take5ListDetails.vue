<template>
  <div class="fillInfo">
    <van-dialog v-model:show="show" width="90%" show-cancel-button>
      <div class="dialog__header">
        {{ takeTitle }}
      </div>
      <div class="dialog__c">
        <div v-for="(v, i) in dialogList" :key="i">
          <van-cell v-if="v.type == 3" :title="v.title">
            <template #right-icon>
              <div
                class="rightIcon"
                style="width: 9rem; justify-content: space-around"
              >
                <span v-if="v.status == 1" style="color: #47769b"> 是 </span>
                <span v-else-if="v.status == 2" style="color: #f34881">
                  否
                </span>
                <span v-else style="color: #ffcd11"> 不适用 </span>
              </div>
            </template>
          </van-cell>
          <van-field
            v-if="v.type == 4"
            :label="v.title"
            readonly
            class="textarea"
            type="textarea"
            v-model="v.msg"
          />
        </div>
      </div>
    </van-dialog>
    <card :title="'定位： ' + takeList.location" :top="false">
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
        </div>
      </div>
      <div v-for="(item, index) in v.items" :key="index">
        <div class="f" v-if="item.type == 6">
          {{ item.title }}
        </div>
        <van-cell
          v-if="item.type != 4 && item.type != 5 && item.type != 6"
          :title="item.title"
        >
          <template #icon v-if="item.required">
            <van-icon
              class="leftIcon"
              :name="require('@/assets/img/星星.png')"
            />
          </template>
          <template #right-icon>
            <div class="rightIcon">
              <span
                v-if="item.status == 1"
                :style="`color: #47769b;${
                  item.parent == 1 ? 'margin-right: 0.5rem' : ''
                }`"
              >
                是
              </span>
              <span v-else-if="item.type != 7" style="color: #f34881">
                否
              </span>
              <span
                v-if="item.parent == 1 && item.status == 1"
                @click="
                  (takeTitle = item.title),
                    (dialogType = item.id),
                    (show = true)
                "
                style="color: #ffcd11"
                >查看</span
              >
            </div>
          </template>
        </van-cell>
        <van-field
          v-if="item.type == 4"
          class="textarea"
          type="textarea"
          readonly
          v-model="item.msg"
        />
        <van-cell v-if="item.type == 5" :title="item.title" class="upload">
          <van-uploader :max-count="0" :deletable="false" v-model="item.msg">
          </van-uploader>
        </van-cell>
        <van-cell v-if="item.is_notice">
          <template #title>
            抄送人：{{ item.user.map((u) => u.name_cn).join(",") }}
          </template>
        </van-cell>
      </div>
    </card>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";

export default {
  components: {
    card,
  },
  data() {
    return {
      takeList: { list: [] },
      takeTitle: "",
      show: false,
      dialogType: 0,
    };
  },
  created() {
    this.getTakeList();
  },
  computed: {
    dialogList() {
      console.log(this.dialogType);
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
  methods: {
    getTakeList() {
      const take_id =
        sessionStorage.getItem("take_id") || this.getRequest().take_id;
      this.$api.takeFiveListDetails(take_id).then((res) => {
        console.log(res.list.find((v) => v.type === 5));
        this.takeList = res;
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.van-cell:last-child::after {
  display: inline-block;
}
.van-cell::after {
  transform: scale(1);
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
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  justify-content: flex-end;
}
.leftBlock {
  position: relative;
  display: block;
  margin: 1rem 0 0 0;
  .left {
    display: inline-block;
    font-size: 1rem;
    font-size: 1.1rem;
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
    font-size: 0.9rem;
    span:nth-child(1) {
      margin-right: 1.3rem;
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
}
.lo {
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
</style>
