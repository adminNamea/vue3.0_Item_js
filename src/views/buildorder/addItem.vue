<template>
  <div>
    <del-dialog v-model:show="showDialog" title="工作代码，零件代码选择">
      <div class="dialogSearch">
        <span>搜索</span>
        <van-field
          left-icon="search"
          v-model="keywordCode"
          placeholder="请输入关键字"
        />
        <img @click="getOrderItemCode" src="@/assets/img/search-blue.png" />
      </div>
      <div class="dialogBody" style="height: 17rem; overflow: auto">
        <div style="flex: 1">
          <p style="color: #266ccb" class="f">工作代码</p>
          <p v-for="(v, i) in job_code_list" :key="i" @click="job_codeClick(v)">
            {{ v.job_code }}
            <img
              :src="checked_job_code.job_code === v.job_code ? iconC : iconN"
            />
          </p>
        </div>
        <div class="d"></div>
        <div style="flex: 1">
          <p style="color: #266ccb" class="f">零件代码</p>
          <p
            v-for="(v, i) in comp_code_list"
            :key="i"
            @click="comp_codeClick(v)"
          >
            {{ v.comp_code }}
            <img
              :src="checked_comp_code.comp_code === v.comp_code ? iconC : iconN"
            />
          </p>
        </div>
      </div>
      <van-cell-group>
        <van-field v-model="str_job_code" placeholder="请输入编辑" />
        <van-field v-model="str_comp_code" placeholder="请输入编辑" />
      </van-cell-group>
      <div class="dialogButton">
        <van-button size="small" @click="codeConfirm" block color="#FFCD11"
          >确定</van-button
        >
      </div>
    </del-dialog>
    <!-- 删除提示框 -->
    <del-dialog class="delDialog" v-model:show="delShow" title="删除确认">
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
      <div class="popupBody">
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
      </div>
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
          <div @click="show = true" class="flex">
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
        <van-cell class="ve" title="项目类型">
          <select-a
            v-model="editItems.order_item_type"
            :options="item_options"
          ></select-a>
        </van-cell>
        <van-field
          class="ve"
          v-if="editItems.item_type === 1"
          v-model="editItems.operate_code"
          readonly
          label="工作代码："
          @click="showDialog = true"
          placeholder="请输入工作代码  (必填)"
          :rules="[{ required: true }]"
        />
        <van-field
          class="ve"
          readonly
          @click="showDialog = true"
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
      />
    </van-dialog>
    <van-form @submit="addItem" :show-error="true">
      <p>
        <span
          @click="initialItem(0)"
          :style="items.item_type !== 0 ? 'font-size:0.8rem' : ''"
          >新增标准项目|</span
        >
        <span
          @click="initialItem(1)"
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
        <div class="flex">
          <span>{{ items.item_name }}</span>
          <img class="itemImg" src="@/components/select/img/drop_down_2.png" />
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
      <van-cell class="ve" title="项目类型">
        <select-a
          v-model="items.order_item_type"
          :options="item_options"
        ></select-a>
      </van-cell>
      <van-field
        class="ve"
        v-if="items.item_type === 1"
        v-model="items.operate_code"
        @click="showDialog = true"
        readonly
        label="工作代码："
        placeholder="请输入工作代码  (必填)"
        :rules="[{ required: true }]"
      />
      <van-field
        class="ve"
        @click="showDialog = true"
        v-if="items.item_type === 1"
        v-model="items.parts_code"
        readonly
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
    </van-form>
    <teleport to=".vanForm">
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
    </teleport>
    <teleport to=".vanForm">
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
    </teleport>
  </div>
</template>
<script>
import { Dialog } from "vant";
import dialog from "@/components/dialog/index.vue";
import select from "@/components/select/index.vue";
import card from "@/components/card/index.vue";
import { reactive } from "vue";

const iconN = require("@/assets/img/choice-gray.png");
const iconC = require("@/assets/img/choice-blue.png");
const checkedIcon = require("@/assets/img/选中.png");
const noCheckedIcon = require("@/assets/img/未选中.png");

export default {
  setup(q) {
    const items = reactive({
      item_type: 0,
      order_item_type:
        q.form.order_type === 2
          ? 1
          : q.form.order_type === 3
          ? 1
          : q.form.order_type || 1,
      item_name: "",
      is_factory: 0,
      deadline_parts_time: "",
      real_parts_time: "",
      itemId: 0,
    });
    const item_options = [
      { value: 1, text: "保修工单" },
      { value: 4, text: "保养" },
      { value: 5, text: "交机前检查" },
      { value: 6, text: "交机" },
      { value: 7, text: "大修" },
    ];
    function initialItem(item_type) {
      items.item_type = item_type;
      items.item_name = "";
      items.is_factory = 0;
      items.deadline_parts_time = "";
      items.real_parts_time = "";
      items.operate_code = "";
      items.parts_code = "";
      items.item_cost_time = "";
    }
    function addItem() {
      if (items.item_name === "") {
        return Dialog({ message: "请选择项目" });
      }
      const max = q.form.item.map((v) => v.itemId);
      let itemId = 1;
      if (max.length > 0) {
        itemId = Math.max(...max);
      }
      q.form.item.push({ ...items, itemId: itemId + 1 });
      initialItem(items.item_type);
    }
    return {
      addItem,
      initialItem,
      item_options,
      items,
      iconN,
      iconC,
      checkedIcon,
      noCheckedIcon,
    };
  },
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
    // 零件代码数据
    comp_code_list() {
      return this.codeList.comp_code_list.filter((v) => {
        if (this.checked_job_code.comp_code.length === 0) {
          return true;
        }
        return this.checked_job_code.comp_code.includes(String(v.comp_code));
      });
    },
    // 工作代码数据
    job_code_list() {
      return this.codeList.job_code_list.filter((v) => {
        if (this.checked_comp_code.job_code.length === 0) {
          return true;
        }
        return this.checked_comp_code.job_code.includes(String(v.job_code));
      });
    },
  },
  components: {
    "del-dialog": dialog,
    "select-a": select,
    card,
  },
  mounted() {
    this.getOrderItemCode();
    this.search();
  },
  data() {
    return {
      str_job_code: "",
      str_comp_code: "",
      // 零件代码工作代码数据
      codeList: { comp_code_list: [], job_code_list: [] },
      // 选中零件代码
      checked_comp_code: { comp_code: "", job_code: [] },
      // 选中部件代码
      checked_job_code: { comp_code: [], job_code: "" },

      keywordCode: "",
      showDialog: false,
      delShow: false,

      // 项目列表
      itemList: [],
      // 项目编辑数据
      editItems: {},
      // 项目编辑弹框
      editShow: false,
      currentDate: new Date(),
      // 时间弹出框
      showTime: false,
      // 选中项目数据
      checkedItemData: [],
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
      // 删除的项目
      delItem: {},
    };
  },
  methods: {
    // 自定义代码确认
    codeConfirm() {
      if (this.editShow) {
        this.editItems.operate_code = this.str_job_code;
        this.editItems.parts_code = this.str_comp_code;
      } else {
        this.items.operate_code = this.str_job_code;
        this.items.parts_code = this.str_comp_code;
      }
      this.showDialog = false;
    },
    // 工作代码点击事件
    job_codeClick(v) {
      if (v.job_code === this.checked_job_code.job_code) {
        this.checked_job_code = { comp_code: [], job_code: "" };
      } else {
        this.checked_job_code = v;
        this.str_job_code = v.job_code;
      }
    },
    // 零件代码点击事件
    comp_codeClick(v) {
      if (v.comp_code === this.checked_comp_code.comp_code) {
        this.checked_comp_code = { comp_code: "", job_code: [] };
      } else {
        this.str_comp_code = v.comp_code;
        this.checked_comp_code = v;
      }
    },
    // 获取工作，零件代码
    getOrderItemCode() {
      this.$api
        .getOrderItemCode(this.keywordCode)
        .then((res) => {
          this.codeList = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
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
          this.form.item[index] = this.editItems;
          return true;
        }
      });
      // 修改已绑定项目
      this.form.station.forEach((s) => {
        s.project.find((p, i) => {
          if (p.itemId === this.editItems.itemId) {
            s.project[i] = this.editItems;
            return true;
          }
        });
      });
      this.editShow = false;
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
      const modelN = String(this.form.model).match(/\d+/);
      if (this.editShow) {
        this.editItems.item_name = value.item_name;
        if (value.model.length > 0) {
          const model = value.model.find(
            (m) => modelN >= m.model_start_number && modelN < m.model_end_number
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
            (m) => modelN >= m.model_start_number && modelN < m.model_end_number
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
  },
};
</script>
<style lang='scss' scoped>
.van-cell-group {
  display: flex;
  background-color: none;
  padding: 0 1rem 0 0;
  .van-field:nth-child(2) {
    padding-left: 2rem;
  }
}
.dialogBody {
  position: relative;
  display: flex;
  .f {
    position: fixed;
    width: 100%;
    background: #ffffff;
    top: 5.5rem;
  }
  .d {
    position: fixed;
    height: 51%;
    top: 6rem;
    left: 49%;
    width: 1px;
    background-color: #434343;
  }
  div {
    margin-top: 2rem;
    position: relative;
    &:nth-child(3) {
      margin-left: 2rem;
    }
  }
  p {
    padding: 0.5rem 0;
    padding-right: 1rem;
    img {
      float: right;
      width: 1rem;
    }
  }
  margin: 0 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #434343;
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
::v-deep() .dialogSearch {
  text-align: center;
  padding: 0.8rem 0;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  span {
    font-size: 1.5rem;
    font-weight: 600;
  }
  img {
    height: 2.5rem;
    width: 2.5rem;
    float: right;
  }
  .van-field {
    .van-field__control {
      box-shadow: none;
      background: none;
    }
    width: 70%;
    height: 100%;
    display: flex;
    align-items: center;
    background: #f3f3f3;
    border: 1px solid #434343;
    box-shadow: 0px 0.1rem 0.1rem 0px rgba(51, 51, 51, 0.04);
    border-radius: 0.5rem;
  }
}
::v-deep() .dialogButton {
  width: 100%;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  .van-button {
    .van-button__content {
      color: #000;
    }
    width: 30%;
    border-radius: 4rem;
    color: #000;
  }
}
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
::v-deep() .ve {
  overflow: visible;
  .van-cell__value {
    margin-right: 0.3rem;
    overflow: visible;
    .cell {
      padding-left: 0;
      width: 100%;
      .title {
        color: #969799;
        padding: 0;
        img {
          height: 1vw;
        }
      }
    }
  }
}
::v-deep() .vanButton {
  display: flex;
  justify-content: space-around;
  .van-button {
    width: 35%;
  }
  .van-button__content {
    color: #000;
  }
}
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
.itemImg {
  filter: contrast(0.5);
  height: 1vw;
}
::v-deep() .van-dialog__header {
  padding: 0.7rem;
  background-color: #ffcd11;
}
::v-deep() .van-dialog {
  border-radius: 1rem;
}
::v-deep() .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .not {
    .van-cell__title {
      font-weight: 700;
    }
    .van-cell__value {
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
::v-deep() .search {
  text-align: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.7rem 0;
  height: 2rem;
  .van-field {
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
::v-deep() .van-cell::after {
  transform: scale(1);
}
::v-deep() .van-cell:not(.not) .van-cell__title,
::v-deep() .van-field__label {
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
::v-deep() .van-field__control {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  background: rgba(249, 249, 250, 1);
  box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
  border-radius: 0.08rem;
}
::v-deep() .van-form,
::v-deep() .van-dialog {
  .van-cell__value:not(.van-field__value) {
    text-align: left;
    font-size: 0.8rem;
    flex: none;
    width: 30%;
  }
}
::v-deep() .van-cell__value {
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

::v-deep() .van-dialog {
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
::v-deep() .van-form {
  .checkIcon {
    .van-cell__value {
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
