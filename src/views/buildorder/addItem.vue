<template>
  <div class="addItem">
    <!-- 删除提示框 -->
    <del-dialog class="delDialog" :show="delShow" title="删除确认">
      <span class="info">确认删除项目（{{ delItem.item_name }}）？</span>
      <div class="vanButton" style="margin: 1rem">
        <van-button size="small" round block color="#FFCD11" @click="del(false)"
          >确认</van-button
        >
        <van-button
          size="small"
          round
          block
          color="linear-gradient(to right, #FDFBFD,#F7F9F9)"
          @click="delShow = false"
          >取消</van-button
        >
      </div>
    </del-dialog>
    <!-- 项目选择弹框 -->
    <van-popup v-model:show="show" position="bottom" :style="{ height: '77%' }">
      <div class="search">
        <van-field
          @input="search"
          left-icon="search"
          v-model="keyword"
          placeholder="请输入项目名，工作代码或部件代码"
        />
      </div>
      <van-cell
        v-for="(item, index) in itemList"
        :key="index"
        @click="confirm(item)"
        class="not"
        :title="item.item_name"
      >
        <span>工作代码：{{ item.operate_code }}</span>
        <span>部件代码：{{ item.parts_code }}</span>
      </van-cell>
    </van-popup>
    <!-- 项目编辑弹框 -->
    <van-dialog
      :close-on-click-overlay="true"
      width="90%"
      v-model:show="editShow"
      :showConfirmButton="false"
    >
      <card style="margin-top: 0" :top="false" :hed="false">
        <p style="color: #999999">
          {{ editItems.item_type === 0 ? "基本项目修改" : "自定义项目" }}
        </p>
        <van-cell class="ve" v-if="editItems.item_type === 0" title="项目">
          <div @click="show = true">
            <span>{{ editItems.item_name }}</span>
            <img
              class="itemImg"
              src="@/components/select/img/drop_down_2.png"
            />
          </div>
        </van-cell>
        <van-field
          v-else
          class="ve"
          v-model="editItems.item_name"
          label="项目:"
          placeholder="请输入项目  (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          v-if="editItems.item_type === 1"
          v-model="editItems.operate_code"
          label="工作代码："
          placeholder="请输入工作代码  (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          v-if="editItems.item_type === 1"
          v-model="editItems.parts_code"
          label="零件代码："
          placeholder="请输入零件代码 (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          v-if="editItems.item_type === 1"
          v-model="editItems.item_cost_time"
          label="项目工时："
          placeholder="请输入项目工时 (必填)"
          :rules="[{ required: true }]"
        />
        <van-cell
          v-else
          class="ve"
          title="预计工时"
          :value="editItems.item_cost_time"
        ></van-cell>
        <van-cell class="ve" title="是否场内" value-class="checkIcon">
          <div
            :class="{ active: editItems.is_factory === 1 }"
            @click="editItems.is_factory = 1"
          >
            是
          </div>
          <div
            :class="{ active: editItems.is_factory === 0 }"
            @click="editItems.is_factory = 0"
          >
            否
          </div>
        </van-cell>
        <van-cell
          title="零件需求日期"
          @click="showTimeDialog(1)"
          :value="editItems.deadline_parts_time"
          is-link
        />
        <van-cell
          title="零件领取日期"
          @click="showTimeDialog(2)"
          :value="editItems.real_parts_time"
          is-link
        />
        <div class="vanButton" style="margin: 1rem">
          <van-button size="small" round block color="#FFCD11" @click="editItem"
            >确认</van-button
          >
          <van-button
            size="small"
            round
            block
            color="linear-gradient(to right, #FDFBFD,#F7F9F9)"
            @click="editShow = false"
            >取消</van-button
          >
        </div>
      </card>
    </van-dialog>
    <!-- 选择日期弹框 -->
    <van-dialog
      v-model:show="showTime"
      :close-on-click-overlay="true"
      @confirm="dialogConfirm"
      :title="timeType === 1 ? '零件需求日期' : '零件领取日期'"
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
        :min-date="minDate"
      />
    </van-dialog>
    <van-form @submit="addItem" ref="form">
      <card title="工单类型：">
        <template #right>
          <select-a v-model="form.order_type" :options="options"></select-a>
        </template>
        <p>
          <span
            @click="items.item_type = 0"
            :style="items.item_type !== 0 ? 'font-size:0.8rem' : ''"
            >新增标准项目|</span
          >
          <span
            @click="items.item_type = 1"
            :style="items.item_type !== 1 ? 'font-size:0.8rem' : ''"
            >新增自定义项目</span
          >
          <span
            class="right"
            @click="$router.push({ name: 'index' })"
            style="color: rgba(250, 207, 6, 1); font-size: 0.8rem"
            >返回首页</span
          >
        </p>
        <van-cell
          class="ve"
          v-if="items.item_type === 0"
          @click="show = true"
          title="项目"
        >
          <div>
            <span>{{ items.item_name }}</span>
            <img
              class="itemImg"
              src="@/components/select/img/drop_down_2.png"
            />
          </div>
        </van-cell>
        <van-field
          v-else
          class="ve"
          v-model="items.item_name"
          label="项目:"
          placeholder="请输入项目  (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          v-if="items.item_type === 1"
          v-model="items.operate_code"
          label="工作代码："
          placeholder="请输入工作代码  (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          v-if="items.item_type === 1"
          v-model="items.parts_code"
          label="零件代码："
          placeholder="请输入零件代码 (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          v-if="items.item_type === 1"
          v-model="items.item_cost_time"
          label="项目工时："
          placeholder="请输入项目工时 (必填)"
          :rules="[{ required: true }]"
        />
        <van-cell
          v-else
          class="ve"
          title="预计工时"
          :value="items.item_cost_time"
        ></van-cell>
        <van-cell title="是否场内" class="checkIcon ve">
          <div @click="items.is_factory = 1">
            <span>是</span>
            <img :src="items.is_factory === 1 ? checkedIcon : noCheckedIcon" />
          </div>
          <div @click="items.is_factory = 0">
            <span>否</span>
            <img :src="items.is_factory === 0 ? checkedIcon : noCheckedIcon" />
          </div>
        </van-cell>
        <van-cell
          title="零件需求日期"
          @click="showTimeDialog(1)"
          :value="items.deadline_parts_time"
          is-link
        />
        <van-cell
          title="零件领取日期"
          @click="showTimeDialog(2)"
          :value="items.real_parts_time"
          is-link
        />
        <div style="padding: 1rem">
          <van-button round block native-type="submit" color="#FFCD11"
            >添加</van-button
          >
        </div>
      </card>
      <card :top="false" :hed="false">
        <p>基本项目列表</p>
        <van-cell
          v-for="(item, index) in jitem"
          :key="index"
          :title="item.item_name"
        >
          <div class="edit" @click="edit(item)">编辑</div>
          <div class="del" @click="del(item)">删除</div>
        </van-cell>
      </card>
      <card :top="false" :hed="false">
        <p>自定义项目列表</p>
        <van-cell
          v-for="(item, index) in zitem"
          :key="index"
          :title="item.item_name"
        >
          <div class="edit" @click="edit(item)">编辑</div>
          <div class="del" @click="del(item)">删除</div>
        </van-cell>
      </card>
      <div style="margin-top: 1rem">
        <van-button
          round
          block
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          native-type="button"
          @click="onSubmit"
          >下一步</van-button
        >
      </div>
    </van-form>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import select from "@/components/select/index.vue";
import { Dialog } from "vant";
import dialog from "@/components/dialog/index.vue";

export default {
  props: {
    form: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  computed: {
    jitem() {
      return this.form.item.filter((v) => v.item_type !== 1);
    },
    zitem() {
      return this.form.item.filter((v) => v.item_type === 1);
    },
  },
  components: {
    card,
    "del-dialog": dialog,
    "select-a": select,
  },
  mounted() {
    this.search();
  },
  data() {
    return {
      delShow: false,
      checkedIcon: require("@/assets/img/选中.png"),
      noCheckedIcon: require("@/assets/img/未选中.png"),
      // 项目列表
      itemList: [],
      // 项目
      items: {
        item_type: 0,
        item_name: "",
        is_factory: 0,
        deadline_parts_time: "",
        real_parts_time: "",
        itemId: 0,
      },
      // 项目编辑数据
      editItems: {},
      // 项目编辑弹框
      editShow: false,
      currentDate: new Date(),
      // 时间弹出框
      showTime: false,
      minDate: new Date(),
      // 选中项目数据
      checkedItemData: [],
      // 搜索关键字
      keyword: "",
      // type 1 主修
      // type 2 副修
      type: 1,
      // 控制弹框
      show: false,
      // 下拉框数据
      options: [
        { value: 1, text: "保修工单" },
        { value: 2, text: "内部" },
        { value: 3, text: "外部" },
        { value: 4, text: "保养" },
        { value: 5, text: "交机前检查" },
        { value: 6, text: "交机" },
        { value: 7, text: "大修" },
      ],
      // 弹出的不同的时间
      // 承诺派工时间 1
      // 承诺到达时间 2
      // 承诺完成时间 3
      timeType: 1,
      // 删除的项目
      delItem: {},
    };
  },
  methods: {
    // 项目数据搜索
    search() {
      this.$api
        .getItemList({ keyword: this.keyword })
        .then((res) => {
          this.itemList = res;
          this.form.itemList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    // 编辑项目确认
    editItem() {
      this.form.item.find((item, index) => {
        if (item.itemId === this.editItems.itemId) {
          this.$set(this.form.item, index, this.editItems);
          return true;
        }
      });
      // 修改已绑定项目
      this.form.station.forEach((s) => {
        s.project.find((p, i) => {
          if (p.itemId === this.editItems.itemId) {
            this.$set(s.project, i, this.editItems);
            return true;
          }
        });
      });
      this.editShow = false;
    },
    // 添加项目
    addItem() {
      if (this.items.item_name === "") {
        return Dialog({ message: "请选择项目" });
      }
      const max = this.form.item.map((v) => v.itemId);
      let itemId = 1;
      if (max.length > 0) {
        itemId = Math.max(...max);
      }
      this.form.item.push({ ...this.items, itemId: itemId + 1 });
      this.items = {
        item_type: 0,
        item_name: "",
        is_factory: 0,
        deadline_parts_time: "",
        real_parts_time: "",
      };
    },
    // 时间对话框弹出
    showTimeDialog(type) {
      this.showTime = true;
      this.timeType = type;
    },
    // 编辑项目
    edit(item) {
      console.log(item);
      this.editItems = { ...item };
      this.editShow = true;
    },
    // 删除项目
    del(item) {
      if (item) {
        this.delItem = item;
        this.delShow = true;
      } else {
        const status = this.form.station.find(
          (s) =>
            s.project.find((p) => p.itemId === this.delItem.itemId) !==
            undefined
        );
        if (status) {
          Dialog.confirm({
            title: "警告",
            message: "该项目已绑定工位确定删除吗",
          })
            .then(() => {
              this.form.item.find((obj, index) => {
                if (obj.itemId === this.delItem.itemId) {
                  this.form.item.splice(index, 1);
                  return true;
                }
              });
              // 删除已绑定项目
              this.form.station.forEach((s) => {
                s.project.find((p, i) => {
                  if (p.itemId === this.delItem.itemId) {
                    s.project.splice(i, 1);
                    return true;
                  }
                });
                s.item_key = s.project.map((p) => p.itemId);
              });
            })
            .catch(() => {});
        } else {
          this.form.item.find((obj, index) => {
            if (obj.itemId === this.delItem.itemId) {
              this.form.item.splice(index, 1);
              return true;
            }
          });
        }
        this.delShow = false;
      }
    },
    // 选中项目确定
    confirm(value) {
      if (this.editShow) {
        this.editItems.item_name = value.item_name;
        if (value.model.length > 0) {
          const model = value.model.find(
            (m) => m.model_name === this.form.model
          );
          if (model && model.item_model_cost_time) {
            this.editItems.type_model_id = model.type_model_id;
            this.editItems.item_cost_time = model.item_model_cost_time;
          } else {
            this.editItem.item_cost_time = value.item_cost_time;
          }
        } else {
          this.editItems.item_cost_time = value.item_cost_time;
        }
        this.editItems.item_type_id = value.type_id;
      } else {
        this.items.item_name = value.item_name;
        if (value.model.length > 0) {
          const model = value.model.find(
            (m) => m.model_name === this.form.model
          );
          if (model && model.item_model_cost_time) {
            this.items.type_model_id = model.type_model_id;
            this.items.item_cost_time = model.item_model_cost_time;
          } else {
            this.items.item_cost_time = value.item_cost_time;
          }
        } else {
          this.items.item_cost_time = value.item_cost_time;
        }
        this.items.item_type_id = value.type_id;
      }
      this.show = false;
    },
    // 弹框确认
    dialogConfirm() {
      const type = ["deadline_parts_time", "real_parts_time"];
      if (this.editShow) {
        this.editItems[type[this.timeType - 1]] = this.filterTime(
          this.currentDate
        );
      } else {
        this.items[type[this.timeType - 1]] = this.filterTime(this.currentDate);
      }
    },
    // 提交
    onSubmit() {
      this.$emit("next");
    },
  },
};
</script>
<style lang='scss' scoped>
.ve {
  /deep/ .van-cell__value {
    margin-right: 1.3rem;
  }
}
.vanButton {
  display: flex;
  justify-content: space-around;
  /deep/ .van-button {
    width: 35%;
  }
  /deep/ .van-button__content {
    color: #000;
  }
}
/deep/.dialog.delDialog {
  .info {
    display: inline-block;
    margin: 1rem;
    padding: 0.1rem 8%;
  }
  .van-dialog {
    height: 10rem;
  }
}
.itemImg {
  position: relative;
  top: 0.25rem;
  height: 1rem;
  right: 0;
}
/deep/ .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
/deep/ .van-dialog {
  border-radius: 1rem;
}
/deep/ .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .not {
    /deep/ .van-cell__title {
      font-weight: 700;
    }
    /deep/ .van-cell__value {
      display: flex;
      flex: 2;
      justify-content: space-between;
    }
    span {
      font-size: 0.7rem;
    }
  }
}

.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.search {
  text-align: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.7rem 0;
  height: 2rem;
  /deep/ .van-field {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
    .van-field__control {
      background: #ffffff;
      box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
      border-radius: 0.08rem;
    }
  }
}
/deep/ .van-cell::after {
  transform: scale(1);
}
/deep/.van-cell:not(.not) .van-cell__title,
/deep/ .van-field__label {
  color: #000;
  padding-left: 1.5rem;
  font-size: 0.8rem;
  width: 30%;
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
/deep/ .van-field__control {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  background: rgba(249, 249, 250, 1);
  box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
  border-radius: 0.08rem;
}
.van-form,
.van-dialog {
  /deep/ .van-cell__value:not(.van-field__value) {
    text-align: left;
    font-size: 0.8rem;
    flex: none;
    width: 30%;
  }
}
/deep/ .van-cell__value {
  font-size: 0.8rem;
}

.del {
  width: 1.6rem;
  height: 1rem;
  border-radius: 2rem;
  float: right;
  justify-content: center;
  padding: 0.24rem 0.6rem;
  color: #fff;
  display: flex;
  align-items: center;
  background-color: #c8c8c8;
  margin: 0.2rem;
}
.edit {
  margin: 0.2rem;
  width: 1.6rem;
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

p {
  padding: 1rem 1rem;
  margin: 0;
  font-size: 1rem;
  .right {
    float: right;
  }
}

/deep/ .van-dialog {
  /deep/ .van-cell__value {
    display: flex;
  }
  .van-field__body {
    width: 100%;
  }
  .checkIcon {
    display: flex;
    border-radius: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: 0 -0.01rem 0.05rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.08rem;
    justify-content: center;
    height: 2rem;
    align-items: center;
    border-radius: 0.4rem;
    div {
      width: 50%;
      color: #ffcd11;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
    }
    .active {
      width: 70%;
      color: #ffffff;
      background: #ffcd11;
      border-radius: 0.4rem;
    }
  }
}
/deep/ .van-form {
  .checkIcon {
    /deep/ .van-cell__value {
      display: flex;
      flex: none;
      justify-content: space-between;
      width: 30%;
      div {
        display: flex;
        align-items: center;
      }
      span {
        margin: 0.1rem 1rem 0 0;
      }
      img {
        height: 1rem;
        width: 1rem;
      }
    }
  }
}
</style>
