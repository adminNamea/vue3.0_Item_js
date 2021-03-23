<template>
  <div class="serviceLog">
    <!-- 删除提示框 -->
    <del-dialog class="delDialog" v-model:show="delShow" title="删除提醒">
      <span class="info">确认是否删除此条维修日志？</span>
      <div class="vanButton" style="margin: 1rem">
        <van-button size="small" block color="#373737" @click="del(false)"
          >我确定</van-button
        >
        <van-button size="small" block color="#373737" @click="delShow = false"
          >点错了</van-button
        >
      </div>
    </del-dialog>
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      title="修改日期"
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
    <div class="flxe" v-for="(item, index) in logList" :key="index">
      <van-icon v-if="index > 0" :name="icon" />
      <div class="line"></div>
      <div class="body">
        <h3 :style="index == 0 ? 'margin: 0.3rem 0;' : ''">
          <span
            :style="item.is_up ? 'color: #02A0BC' : 'color: #E6686C'"
            v-if="index > 0"
            >{{ item.name_cn }}</span
          >
          <div v-else @click="add">
            添加维修日志
            <img class="img1" src="@/assets/img/huanglingjin.png" />
            <img class="img2" src="@/assets/img/addicon.png" />
          </div>
        </h3>
        <span
          v-if="index > 0"
          @click="item.is_up ? timeShow(item) : ''"
          class="right"
          >{{ item.date }}</span
        >
        <van-field
          :style="item.is_up ? 'width: 80%' : 'width: 100%'"
          v-if="index > 0"
          type="textarea"
          v-model="item.log_value"
          :readonly="!item.editStatus"
          :class="{ textarea: true, editText: item.editStatus }"
          @blur="edit(item)"
        />
        <div class="btn" v-if="index > 0 && item.is_up">
          <div class="edit" @click="item.editStatus = !item.editStatus">
            编辑
          </div>
          <div class="delete" @click="del(item.order_log_id)">删除</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import dialog from "@/components/dialog/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    "del-dialog": dialog,
  },
  methods: {
    add() {
      this.$api
        .addOrderLog(this.order_id)
        .then(() => {
          Dialog({ message: "添加成功" });
          this.init();
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    dialogConfirm() {
      this.thisItem.date = this.filterTime(
        this.currentDate,
        "YYYY-mm-dd HH:MM"
      );
      this.$api
        .upOrderLog(this.thisItem)
        .then(() => {
          Dialog({ message: "时间修改成功" });
          this.init();
        })
        .catch((message) => {
          Dialog({ message });
        });
      this.showTime = false;
    },
    del(id) {
      if (id) {
        this.delItem = id;
        this.delShow = true;
      } else {
        this.$api
          .deleteOrderLog(this.delItem)
          .then(() => {
            Dialog({ message: "删除成功" });
            this.delShow = false;
            this.init();
          })
          .catch((message) => {
            Dialog({ message });
          });
      }
    },
    edit(item) {
      this.$api
        .upOrderLog(item)
        .then(() => {
          Dialog({ message: "修改成功" });
          this.init();
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    timeShow(item) {
      this.thisItem = item;
      this.showTime = true;
    },
    init() {
      this.$api
        .OrderLogList(this.order_id)
        .then((res) => {
          res.forEach((v) => {
            v.editStatus = false;
          });
          this.logList = [{}, ...res];
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
  created() {
    this.init();
  },
  data() {
    return {
      delShow: false,
      delItem: {},
      thisItem: {},
      currentDate: new Date(),
      showTime: false,
      order_id: sessionStorage.getItem("order_id"),
      icon: require("@/assets/img/dot.png"),
      logList: [],
    };
  },
};
</script>
<style lang="scss" scoped>
::v-deep() .dialog.delDialog {
  .info {
    display: inline-block;
    margin: 1rem;
    padding: 0.1rem 8%;
  }
  .van-dialog {
    height: 10rem;
  }
}
.vanButton {
  display: flex;
  justify-content: space-around;
  ::v-deep() .van-button {
    border-radius: 0.3rem;
    width: 35%;
  }
  ::v-deep() .van-button__content {
    color: #ffffff;
  }
}
::v-deep() .van-cell {
  padding: 0;
}
.flxe {
  margin-left: 2rem;
  padding: 0.6rem 0;
  position: relative;
  .body {
    position: relative;
    padding-left: 1rem;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    justify-content: space-between;
    background: #ffffff;
    box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.06);
    border-radius: 0.6rem;
  }
  .van-icon {
    position: absolute;
    left: -2rem;
    top: 45%;
    z-index: 2;
  }
  .line {
    width: 0.15rem;
    background: rgba(34, 34, 34, 0.1);
    height: 100%;
    position: absolute;
    z-index: 1;
    left: -1.55rem;
  }
  .right {
    position: absolute;
    padding: 0.1rem 1rem;
    top: 1rem;
    right: 0;
    background: linear-gradient(267deg, #fbd01f, #fee568);
    border-radius: 3rem 0 0 3rem;
  }
}
h3 {
  width: 100%;
  min-height: 1.4rem;
  margin-bottom: 0.5rem;
  div {
    display: flex;
    color: #000000;
    align-items: center;
    justify-content: space-between;
  }
  .img2 {
    height: 3.5rem;
    margin-right: 1rem;
  }
  .img1 {
    position: absolute;
    top: 0;
    left: 1rem;
  }
}
.btn {
  position: absolute;
  right: 0.6rem;
  top: 3rem;
}
.edit,
.delete {
  background: #ffffff;
  border: 1px solid #9a9a9a;
  box-shadow: 0 1rem 2rem 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.3rem;
  font-size: 0.7rem;
  padding: 0.17rem 1rem;
}
.edit {
  margin-bottom: 0.5rem;
  color: #02a0bc;
}
.delete {
  color: #e6686c;
}
::v-deep() .van-cell::after {
  display: none;
}
.textarea {
  margin-bottom: 0.5rem;
  ::v-deep() .van-field__control {
    height: 3.35rem;
    padding: 0 0.15rem;
    min-height: 2rem;
    margin-right: 1rem;
    border: 0;
  }
}
.editText {
  background: #f9f9fa;
  box-shadow: 0 -1px 1px 0 rgba(0, 0, 0, 0.25);
  border-radius: 0.2rem;
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
</style>
