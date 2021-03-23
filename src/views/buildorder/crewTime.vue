<template>
  <div class="crewTime">
    <van-dialog
      :close-on-click-overlay="true"
      v-model:show="showTime"
      @confirm="dialogConfirm"
      :title="
        timeType === 1
          ? '承诺派工时间'
          : timeType === 2
          ? '承诺到达时间'
          : '承诺完成时间'
      "
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
    <van-popup v-model:show="show" position="bottom" :style="{ height: '77%' }">
      <div class="search">
        <van-field
          @input="search"
          left-icon="search"
          v-model="keyword"
          placeholder="请输入名称或者角色"
        />
      </div>
      <div class="popupBody">
        <div v-if="type === 1">
          <van-cell
            v-for="(item, index) in userList"
            :key="index"
            @click="confirm(item)"
            class="not"
            :title="'姓名：' + item.name_cn"
            :value="'角色：' + item.role_name"
          />
        </div>
        <div
          class="imgCell"
          v-else
          v-for="(item, index) in userList"
          :key="index"
          @click="checkedClick(item)"
        >
          <img :src="isChecked(item)" />
          <van-cell
            class="not"
            :title="'姓名：' + item.name_cn"
            :value="'角色：' + item.role_name"
          />
        </div>
      </div>
      <div v-if="type === 2">
        <van-button
          size="small"
          block
          @click="confirm"
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          >确定</van-button
        >
      </div>
    </van-popup>
    <p>
      主修
      <span
        @click="$router.push({ name: 'index' })"
        style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
        >返回首页</span
      >
    </p>
    <van-cell
      :title="form.checkedMajor.name_cn || '添加'"
      is-link
      @click="onShow(1)"
    />
    <p>副修</p>
    <van-cell
      v-for="(item, index) in form.minorData"
      :key="index"
      :title="item.name_cn"
    >
      <div class="del" @click="del(item.userid)">删除</div>
    </van-cell>
    <van-cell title="添加" is-link @click="onShow(2)" />
    <p>时间规划</p>
    <van-cell
      title="承诺派工时间"
      @click="showTimeDialog(1)"
      :value="form.promise_work_time"
      is-link
    />
    <van-cell
      title="承诺到达时间"
      @click="showTimeDialog(2)"
      :value="form.promise_time"
      is-link
    />
    <van-cell
      title="承诺完成时间"
      @click="showTimeDialog(3)"
      :value="form.promise_finish_time"
      is-link
    />
  </div>
</template>
<script>
import { Dialog } from "vant";

export default {
  props: {
    form: {
      default() {
        return { checkedMajor: {} };
      },
      type: Object,
    },
  },
  mounted() {
    this.search();
  },
  data() {
    return {
      // 用户数据
      userList: [],
      currentDate: new Date(),
      // 时间弹出框
      showTime: false,
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),

      checkedData: [],

      // 搜索关键字
      keyword: "",
      // type 1 主修
      // type 2 副修
      type: 1,
      // 控制弹框
      show: false,
      // 弹出的不同的时间
      // 承诺派工时间 1
      // 承诺到达时间 2
      // 承诺完成时间 3
      timeType: 1,
    };
  },
  methods: {
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
    // 同步删除工位绑定人员
    delSationCrew(id, message) {
      return new Promise((r) => {
        const state = this.form.station.find((s) => s.user_id.includes(id));
        if (state) {
          Dialog.confirm({
            title: "警告",
            message,
          })
            .then(() => {
              // 同步删除绑定工位的人员
              this.form.station.forEach((s) => {
                s.crew.find((c, i) => {
                  if (c.userid === id) {
                    s.crew.splice(i, 1);
                    return true;
                  }
                });
                s.user_id.find((v, i) => {
                  if (v === id) {
                    s.user_id.splice(i, 1);
                    return true;
                  }
                });
                r(true);
              });
            })
            .catch(() => r(false));
        } else {
          r(true);
        }
      }).catch(() => 1);
    },
    // 时间对话框弹出
    showTimeDialog(type) {
      this.showTime = true;
      this.timeType = type;
    },
    // 选中副修事件
    checkedClick(item) {
      let status = true;
      this.checkedData.find((obj, index) => {
        if (obj.userid === item.userid) {
          // 同步工位人员数据
          this.delSationCrew(item.userid, "该人员已绑定工位确定取消吗").then(
            () => {
              this.checkedData.splice(index, 1);
            }
          );
          status = false;
          return true;
        }
      });
      if (status) {
        this.checkedData.push(item);
      }
    },

    // 是否选中返回对应图片
    isChecked(id) {
      return this.checkedData.includes(id)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },

    // 删除副修
    del(id) {
      this.delSationCrew(id, "该人员已绑定工位确定删除吗").then((status) => {
        if (status) {
          this.form.minorData.find((obj, index) => {
            if (obj.userid === id) {
              this.form.minorData.splice(index, 1);
              return true;
            }
          });
        }
      });
    },

    // 选中主副修确定
    confirm(item) {
      if (this.type === 1) {
        this.delSationCrew(
          this.form.checkedMajor.userid,
          "该主修已绑定工位确定更换吗？"
        ).then((status) => {
          if (status) {
            this.form.checkedMajor = item;
          }
        });
      } else {
        this.form.minorData = [...this.checkedData];
      }
      this.show = false;
    },
    // 弹框弹出
    onShow(type) {
      this.type = type;
      this.show = true;
      this.checkedData = [...this.form.minorData];
    },
    // 弹框确认
    dialogConfirm() {
      const time = ["promise_work_time", "promise_time", "promise_finish_time"];
      this.form[time[this.timeType - 1]] = this.filterTime(this.currentDate);
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep() .van-cell::after {
  transform: scale(1);
}
.not {
  font-size: 0.8rem;
}
::v-deep() .van-cell:not(.not) .van-cell__title {
  padding-left: 1.5rem;
  font-size: 0.8rem;
  &::before {
    content: "";
    position: absolute;
    left: 1.1rem;
    top: 1rem;
    border-radius: 50%;
    width: 0.7rem;
    height: 0.7rem;
    background-color: #fad23f;
  }
}
::v-deep() .van-cell__value {
  font-size: 0.8rem;
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .van-button {
    position: absolute;
    bottom: 0;
    height: 2.6rem;
  }
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
.popupBody {
  height: 83.5%;
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
.del {
  width: 2rem;
  height: 1rem;
  border-radius: 2rem;
  float: right;
  justify-content: center;
  padding: 0.24rem 0.6rem;
  color: #fff;
  display: flex;
  align-items: center;
  background-color: #ffcd11;
}
.search {
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
p {
  margin: 0;
  margin-top: 1rem;
  margin-left: 1rem;
  font-size: 1rem;
  span {
    float: right;
    margin-right: 1.5rem;
  }
}
</style>
