<template>
  <div class="orderInfo">
    <!-- 零件代码工作代码选择框 -->
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
    <del-dialog class="delDialog" :del="false" :show="delShow" title="删除确认">
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
    <van-popup v-model="showItem" position="bottom" :style="{ height: '77%' }">
      <div class="search">
        <van-field
          @input="itemSearch"
          left-icon="search"
          v-model="itemKeyword"
          placeholder="请输入项目名，工作代码或部件代码"
        />
      </div>
      <van-cell
        v-for="(item, index) in itemList"
        :key="index"
        @click="confirmItem(item)"
        class="not"
        :title="item.item_name"
      >
        <span>工作代码：{{ item.operate_code }}</span>
        <span>部件代码：{{ item.parts_code }}</span>
      </van-cell>
    </van-popup>
    <van-dialog
      :close-on-click-overlay="true"
      class="dialogNot"
      width="90%"
      v-model="editShow"
      :showConfirmButton="false"
    >
      <p style="color: #999999">
        {{ editItems.item_type === 0 ? "基本项目修改" : "自定义项目" }}
      </p>
      <van-cell
        v-if="editItems.item_type === 0"
        @click="showItem = true"
        is-link
        title="项目"
      >
        <div>
          <span>{{ editItems.item_name }}</span>
          <img class="itemImg" src="@/components/select/img/drop_down_2.png" />
        </div>
      </van-cell>
      <van-field
        v-else
        v-model="editItems.item_name"
        label="项目:"
        placeholder="请输入项目  (必填)"
        :rules="[{ required: true }]"
      />
      <van-cell class="va" title="项目类型" is-link>
        <select-a
          v-model="editItems.order_item_type"
          :options="item_options"
        ></select-a>
      </van-cell>
      <van-field
        class="ve"
        v-if="editItems.item_type === 1"
        v-model="editItems.operate_code"
        @click="showDialog = true"
        readonly
        label="工作代码："
        placeholder="请输入工作代码  (必填)"
        :rules="[{ required: true }]"
      />
      <van-field
        class="ve"
        v-if="editItems.item_type === 1"
        @click="showDialog = true"
        readonly
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
        class="ve"
        v-else
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
        @click="showTimeDialog(4)"
        :value="editItems.deadline_parts_time"
        is-link
      />
      <van-cell
        title="零件领取日期"
        @click="showTimeDialog(5)"
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
    </van-dialog>
    <van-dialog
      class="dialogTime"
      :close-on-click-overlay="true"
      v-model="showTime"
      @confirm="dialogConfirm"
      :title="
        timeType === 1
          ? '承诺派工时间'
          : timeType === 2
          ? '承诺到达时间'
          : timeType === 3
          ? '承诺完成时间'
          : timeType === 4
          ? '零件需求日期'
          : '零件领取日期'
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
    <van-popup v-model="showPopup" position="bottom" :style="{ height: '77%' }">
      <div class="search">
        <van-field
          @input="userSearch"
          left-icon="search"
          v-model="userKeyword"
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
    <van-dialog
      class="Dp"
      :close-on-click-overlay="true"
      v-model="show"
      :showConfirmButton="false"
    >
      <div @click="upStatus(1)">派工</div>
      <div style="height: 0.05rem; background: #999999"></div>
      <div @click="upStatus(0)">无需派工</div>
    </van-dialog>
    <card
      class="stations"
      :top="false"
      title="工单类型："
      :rightTitle="orderDetails.order_type_name"
    >
      <div class="left">工单详情</div>
      <span @click="$router.push({ name: 'index' })" class="backHome"
        >返回首页</span
      >
      <div class="body">
        <div class="flex minP">
          <van-cell
            title="工单号:"
            :value="orderDetails.order_number"
          ></van-cell>
          <van-cell
            title="AX工单号:"
            :value="orderDetails.ax_number"
          ></van-cell>
        </div>
        <div class="flex minP" v-if="orderDetails.is_dispatch !== 0">
          <van-cell
            title="主修:"
            :value="orderDetails.major_user && orderDetails.major_user.name_cn"
          ></van-cell>
          <van-cell title="副修:">
            <span
              style="margin-right: 0.5rem"
              v-for="(v, i) in orderDetails.minor_user"
              :key="i"
              >{{ v.name_cn }}</span
            >
          </van-cell>
        </div>
        <div class="flex minP">
          <van-cell
            title="承诺到达时间:"
            :value="orderDetails.promise_time"
          ></van-cell>
          <van-cell
            title="承诺完成时间:"
            :value="orderDetails.promise_finish_time"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="服务车牌号:"
            :value="orderDetails.service_car || ''"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell title="客户:" :value="orderDetails.custom_name"></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="客户编号:"
            :value="orderDetails.custom_number"
          ></van-cell>
          <van-cell
            title="客户电话:"
            :value="orderDetails.custom_phone"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="客户反馈："
            :value="orderDetails.order_reason"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="联系人："
            :value="orderDetails.contact_name"
          ></van-cell>
          <van-cell title="联系电话：" :value="orderDetails.phone"></van-cell>
        </div>
        <div class="flex">
          <van-cell title="机器型号：" :value="orderDetails.model"></van-cell>
          <van-cell
            title="机身编号："
            :value="orderDetails.serial_number"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="机器运行小时数:"
            :value="orderDetails.total_hour"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="机器地点:"
            :value="orderDetails.m_location"
          ></van-cell>
        </div>
        <div class="flex">
          <van-cell
            title="PL机器位置:"
            :value="orderDetails.pl_location"
          ></van-cell>
        </div>
        <div class="flex" v-if="orderDetails.srt_order_id">
          <van-cell
            title="SRT工单名称:"
            :value="orderDetails.srt_order_name"
          ></van-cell>
          <van-cell
            title="人工报价:"
            :value="orderDetails.people_amount"
          ></van-cell>
        </div>
        <div class="flex" v-if="orderDetails.srt_order_id">
          <van-cell title="付款方式:" :value="orderDetails.pay_type"></van-cell>
          <van-cell
            title="零件报价:"
            :value="orderDetails.parts_amount"
          ></van-cell>
        </div>
      </div>
      <div
        v-if="orderDetails.order_type == 7 && orderDetails.is_dispatch != 0"
        @click="toStationList"
      >
        <div class="left">工位信息</div>
        <div style="max-height: 14.5rem; overflow: auto">
          <div v-for="(station, index) in orderDetails.station" :key="index">
            <div class="flex">
              <van-cell title="工位：" is-link>
                <div>
                  {{ station.station_name }}
                  <span style="color: #940a0a"
                    >（{{ station.statu_name }}）</span
                  >
                </div>
              </van-cell>
            </div>
            <div class="flex">
              <van-cell
                title="预计使用时间："
                :value="
                  (station.sdate && station.sdate + '至' + station.edate) ||
                  '无'
                "
              ></van-cell>
            </div>
            <div class="flex">
              <van-cell title="维修人员：">
                <div
                  style="margin-right: 1rem"
                  v-for="(v, i) in station.user"
                  :key="i"
                >
                  {{ v.name_cn }}
                </div>
              </van-cell>
            </div>
            <div class="flex">
              <van-cell title="绑定项目：">
                <div
                  style="margin-right: 1rem"
                  v-for="(v, i) in station.item"
                  :key="i"
                >
                  {{ v.item_name }}
                </div>
              </van-cell>
            </div>
            <van-divider
              v-if="index + 1 < orderDetails.station.length"
              :style="{ padding: '0 1rem' }"
            />
          </div>
        </div>
      </div>
      <div class="left">派工状态选择</div>
      <van-cell
        @click="show = true"
        :title="orderDetails.is_dispatch == 0 ? '无需派工' : '派工'"
        value
        is-link
      ></van-cell>
      <div v-show="orderDetails.status_name === '无需派工'">
        <van-cell title="无需派工理由："> </van-cell>
        <van-field
          class="textarea"
          type="textarea"
          v-model="orderDetails.cause"
        />
      </div>
      <div v-show="orderDetails.status_name !== '无需派工'">
        <div class="left">主修人员</div>
        <van-cell
          :title="
            (orderDetails.major_user && orderDetails.major_user.name_cn) ||
            '添加'
          "
          value
          is-link
          @click="onShow(1)"
        ></van-cell>
        <div class="left">副修人员</div>
        <van-cell
          v-for="(item, index) in orderDetails.minor_user"
          :key="index"
          class="not"
          :title="item.name_cn"
          value
          is-link
        ></van-cell>
        <van-cell
          title="暂无"
          value="去添加"
          @click="onShow(2)"
          is-link
        ></van-cell>
        <div class="left">标准项目</div>
        <van-cell
          v-for="(obj, index) in orderDetails.item.filter(
            (v) => v.item_type === 0
          )"
          :key="index"
          title-class="not"
          :title="obj.item_name"
        >
          <div class="edit" @click="edit(obj)">编辑</div>
          <div class="del" @click="del(obj)">删除</div>
        </van-cell>
        <van-cell
          @click="
            (editShow = true), (editItems = { item_type: 0, is_factory: 1 })
          "
          title="暂无"
          value="去添加"
          is-link
        ></van-cell>
        <div class="left">自定义项目</div>
        <van-cell
          v-for="(obj, index) in orderDetails.item.filter(
            (v) => v.item_type === 1
          )"
          :key="index"
          title-class="not"
          :title="obj.item_name"
        >
          <div class="edit" @click="edit(obj)">编辑</div>
          <div class="del" @click="del(obj)">删除</div>
        </van-cell>
        <van-cell
          @click="edit({ item_type: 1, is_factory: 1 })"
          title="暂无"
          value="去添加"
          is-link
        ></van-cell>
        <div class="left">时间规划</div>
        <van-cell
          title="承诺派工时间"
          class="not"
          @click="showTimeDialog(1)"
          :value="orderDetails.promise_work_time || '去添加'"
          is-link
        />
        <van-cell
          title="承诺到达时间"
          class="not"
          @click="showTimeDialog(2)"
          :value="orderDetails.promise_time || '去添加'"
          is-link
        />
        <van-cell
          title="承诺完成时间"
          class="not"
          @click="showTimeDialog(3)"
          :value="orderDetails.promise_finish_time || '去添加'"
          is-link
        />
      </div>
      <div v-if="orderDetails.is_dispatch != 0">
        <div class="left">维修工更换记录</div>
        <van-cell
          title="主修记录"
          class="not"
          @click="
            $router.push({
              name: 'replaceRecord',
              params: {
                name: '主修更换记录',
                role: 2,
                order_id: orderDetails.order_id,
              },
            })
          "
          value
          is-link
        />
        <van-cell
          title="副修记录"
          class="not"
          @click="
            $router.push({
              name: 'replaceRecord',
              params: {
                name: '副修更换记录',
                role: 3,
                order_id: orderDetails.order_id,
              },
            })
          "
          value
          is-link
        />
      </div>
      <div v-sticky="false">
        <van-button
          round
          block
          color="linear-gradient(to right, #FFCD11, #FFE775)"
          @click="submit"
          >提交</van-button
        >
      </div>
    </card>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import { Dialog, Toast } from "vant";
import select from "@/components/select/index.vue";
import dialog from "@/components/dialog/index.vue";

export default {
  components: {
    card,
    "del-dialog": dialog,
    "select-a": select,
  },
  computed: {
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
  created() {
    if (!this.order_id) {
      this.order_id = this.getRequest().order_id;
      sessionStorage.setItem("order_id", this.order_id);
    }
    this.getOrderItemCode();
    this.getOrderDetails();
    this.itemSearch();
    this.userSearch();
  },
  data() {
    return {
      keywordCode: "",
      showDialog: false,
      str_job_code: "",
      str_comp_code: "",
      // 零件代码工作代码数据
      codeList: { comp_code_list: [], job_code_list: [] },
      // 选中零件代码
      checked_comp_code: { comp_code: "", job_code: [] },
      // 选中部件代码
      checked_job_code: { comp_code: [], job_code: "" },
      iconN: require("@/assets/img/choice-gray.png"),
      iconC: require("@/assets/img/choice-blue.png"),
      order_id: Number(sessionStorage.getItem("order_id")),
      orderDetails: { item: [] },
      // 项目数据
      itemList: [],
      editItems: {
        is_factory: 1,
      },
      checkUser: [],
      editShow: false,
      userList: [],
      showItem: false,
      showPopup: false,
      item_options: [
        { value: 1, text: "保修工单" },
        { value: 4, text: "保养" },
        { value: 5, text: "交机前检查" },
        { value: 6, text: "交机" },
        { value: 7, text: "大修" },
      ],
      // 无需派工理由
      cause: "",
      currentDate: new Date(),
      // 弹出的不同的时间
      // 承诺派工时间 1
      // 承诺到达时间 2
      // 承诺完成时间 3
      timeType: 1,
      // 时间弹出框
      showTime: false,
      // 选中图标
      checkedIcon: require("@/assets/img/choice-blue.png"),
      // 未选中图标
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      // 选中副修数据
      checkedData: [],
      // 选中主修数据
      checkedMajor: {},
      // 人员搜索关键字
      userKeyword: "",
      // 项目搜索关键字
      itemKeyword: "",
      // type 1 主修
      // type 2 副修
      type: 1,
      delItem: {},
      delShow: false,
      // 控制弹框
      show: false,
      editOrderObj: {},
    };
  },
  methods: {
    // 自定义代码确认
    codeConfirm() {
      this.editItems.operate_code = this.str_job_code;
      this.editItems.parts_code = this.str_comp_code;
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
    submit() {
      Toast.loading({
        message: "请稍后...",
        forbidClick: true,
        duration: 0,
        overlay: true,
      });
      const { is_dispatch } = this.orderDetails;
      const { cause } = this.orderDetails;
      if (is_dispatch) {
        const { major_user } = this.orderDetails;
        this.editOrderObj.major_user_id = major_user && major_user.userid;
        this.editOrderObj.minor_user = this.checkedData.map((v) => v.userid);
      }
      this.$api
        .editOrder({
          order_id: this.order_id,
          order_item_list: this.orderDetails.item,
          cause,
          is_dispatch,
          ...this.editOrderObj,
        })
        .then((res) => {
          Toast.clear();
          Dialog({ message: res.msg });
          this.getOrderDetails();
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    toStationList() {
      this.$router.push({
        name: "stationList",
      });
      sessionStorage.setItem("isWork", false);
    },
    // 查询工单数据
    getOrderDetails() {
      this.$api.orderDetails(this.order_id).then((res) => {
        sessionStorage.setItem("order_number", res.order_number);
        console.log(res);
        this.orderDetails = res;
      });
    },
    // 修改派工状态
    upStatus(status) {
      this.orderDetails.status_name = status ? "派工" : "无需派工";
      this.orderDetails.is_dispatch = status;
      this.show = false;
    },
    // 项目搜索
    itemSearch() {
      this.$api
        .getItemList({ keyword: this.itemKeyword })
        .then((res) => {
          this.itemList = res;
        })
        .catch((message) => {
          Dialog({ message });
          console.log(message);
        });
    },
    // 人员搜索
    userSearch() {
      this.$api
        .getUserList({ keyword: this.userKeyword })
        .then((res) => {
          this.userList = res;
        })
        .catch((message) => {
          Dialog({ message });
          console.log(message);
        });
    },

    // 标准项目选择确定
    confirmItem(item) {
      const modelN = this.orderDetails.model;
      const model = item.model.find(
        (m) => modelN >= m.model_start_number && modelN < m.model_end_number
      );
      if (model && model.item_model_cost_time) {
        this.editItems.type_model_id = model.type_model_id;
        this.editItems.item_cost_time = model.item_model_cost_time;
      } else {
        this.editItems.item_cost_time = item.item_cost_time;
      }
      this.editItems.item_name = item.item_name;
      this.editItems.item_type_id = item.type_id;
      this.showItem = false;
    },
    // 编辑项目
    edit(item) {
      const order_item_type =
        this.orderDetails.order_type === 2
          ? 1
          : this.orderDetails.order_type === 3
          ? 1
          : this.orderDetails.order_type;
      this.editItems = {
        order_item_type,
        ...item,
      };
      this.editShow = true;
    },
    // 删除项目
    del(item) {
      if (item) {
        this.delItem = item;
        this.delShow = true;
      } else {
        if (this.delItem.order_item_id) {
          this.$api
            .deOrderItem({ order_item_id: this.delItem.order_item_id })
            .then((res) => {
              Dialog({ message: res.msg });
              this.getOrderDetails();
            })
            .catch((message) => {
              Dialog({ message });
            });
        } else {
          this.orderDetails.item.forEach((v, index) => {
            if (v.indexId === this.delItem.indexId) {
              this.orderDetails.item.splice(index, 1);
            }
          });
        }
        this.delShow = false;
      }
    },
    // 编辑项目确认
    editItem() {
      if (this.editItems.order_item_id || this.editItems.indexId) {
        const item = this.orderDetails.item.find((v) => {
          let stu = false;
          if (v.order_item_id) {
            stu = v.order_item_id === this.editItems.order_item_id;
          } else if (v.indexId) {
            stu = v.indexId === this.editItems.indexId;
          }
          return stu;
        });
        for (const v in this.editItems) {
          item[v] = this.editItems[v];
        }
      } else {
        const indexId = Math.max(
          ...this.orderDetails.item.map((v) => v.indexId || 0)
        );
        this.orderDetails.item.push({
          indexId: indexId + 1,
          ...this.editItems,
        });
      }
      this.editShow = false;
    },
    // 弹框确认
    dialogConfirm() {
      if (this.timeType > 3) {
        const time = ["deadline_parts_time", "real_parts_time"];
        this.editItems[time[this.timeType - 4]] = this.filterTime(
          this.currentDate
        );
      } else {
        const time = [
          "promise_work_time",
          "promise_time",
          "promise_finish_time",
        ];
        const key = time[this.timeType - 1];
        const value = this.filterTime(this.currentDate);
        this.orderDetails[key] = value;
        this.editOrderObj[key] = value;
      }
    },
    // 时间对话框弹出
    showTimeDialog(type) {
      this.showTime = true;
      this.timeType = type;
    },
    // 选中主副修确定
    confirm(item) {
      if (this.type === 1) {
        this.orderDetails.major_user = item;
      } else {
        this.orderDetails.minor_user = this.checkedData;
      }
      this.showPopup = false;
    },
    // 弹框弹出
    onShow(type) {
      this.type = type;
      this.showPopup = true;
      this.checkedData = [...this.orderDetails.minor_user];
    },
    // 是否选中返回对应图片
    isChecked(item) {
      return this.checkedData.find((v) => v.userid === item.userid)
        ? this.checkedIcon
        : this.noCheckedIcon;
    },
    // 选中副修事件
    checkedClick(item) {
      let status = true;
      this.checkedData.find((obj, index) => {
        if (obj.userid === item.userid) {
          this.checkedData.splice(index, 1);
          status = false;
          return true;
        }
      });
      if (status) {
        this.checkedData.push(item);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .van-cell-group {
  display: flex;
  background-color: rgba(0, 0, 0, 0);
  padding: 0 1rem 0 0;
  .van-field:nth-child(2) {
    padding-left: 2rem;
  }
  .van-field__control {
    padding-left: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.08rem;
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
    margin: 0;
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
.dialogSearch {
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
  /deep/ .van-field {
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
.dialogButton {
  width: 100%;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/ .van-button {
    .van-button__content {
      color: #000;
    }
    width: 30%;
    border-radius: 4rem;
    color: #000;
  }
}
.dialogNot .va {
  overflow: visible;
  /deep/ .van-cell__value:not(.van-field__value) {
    overflow: visible;
    .cell {
      width: 100%;
    }
    .title {
      padding: 0;
      color: #969799;
      img {
        display: none;
      }
    }
  }
}
.ve {
  /deep/ .van-cell__value {
    margin-right: 1.3rem;
  }
}
/deep/ .Dp.van-dialog {
  text-align: center;
  padding: 0.5rem;
  border-radius: 0.2rem;
  &__content {
    text-align: center;
    div {
      margin: 0.5rem 0;
    }
  }
}
.delDialog {
  .info {
    display: inline-block;
    margin: 1rem;
    padding: 0.1rem 8%;
  }
  .van-dialog {
    height: 10rem;
  }
}
.dialogTime {
  /deep/ .van-dialog__header {
    padding: 0.7rem;
    background-color: #ffcd11;
  }
  /deep/ .van-dialog {
    border-radius: 1rem;
  }
}
.vanButton {
  display: flex;
  justify-content: space-around;
  /deep/ .van-button {
    width: 35%;
    text-align: center;
  }
  /deep/ .van-button__content {
    color: #000;
  }
}
.dialogNot {
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
  p {
    margin: 0;
    margin-top: 1rem;
    margin-left: 1rem;
    font-size: 1rem;
    .right {
      float: right;
      margin-right: 1.5rem;
    }
  }
  .itemImg {
    position: relative;
    top: 0.25rem;
    height: 1rem;
    right: 0;
  }
  border-radius: 0.5rem;
  /deep/ .van-cell__title,
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
  /deep/ .van-cell__value:not(.van-field__value) {
    text-align: left;
    font-size: 0.8rem;
    flex: none;
    width: 30%;
  }
  /deep/ .van-field__control {
    font-size: 0.8rem;
    padding-left: 0.5rem;
    background: rgba(249, 249, 250, 1);
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.08rem;
  }
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
    border-bottom: 0.1rem solid #dadada;
  }
}
.search {
  text-align: center;
  background: linear-gradient(to right, #fee568 0%, #fbd01f 100%);
  padding: 0.8rem 0;
  height: 2.2rem;
  /deep/ .van-field {
    margin: 0 auto;
    width: 90%;
    height: 100%;
    display: flex;
    align-items: center;
  }
}
/deep/ .van-popup--bottom {
  width: 90%;
  left: 5%;
  border-radius: 0.3rem;
  .van-button {
    position: absolute;
    bottom: 0;
    height: 2.6rem;
  }
}
.stations {
  overflow: hidden !important;
  font-size: 1rem;
  font-weight: 600;
  position: relative;
  .textarea {
    background: #f9f9fa;
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.2rem;
    width: 90%;
    margin: 1rem auto;
    min-height: 6rem;
  }

  .flex {
    &:nth-child(1) .van-cell {
      padding-top: 0;
    }
    &:last-child .van-cell {
      padding-bottom: 0;
    }
    display: flex;
    @media all and (min-width: 550px) {
      .van-cell:nth-child(2) {
        .van-cell__title {
          width: 5rem;
        }
      }
    }
    justify-content: space-between;
    /deep/ .van-cell {
      &__value {
        text-align: left;
        color: #656565;
      }
    }
  }
  .minP {
    @media all and (max-width: 550px) {
      display: block;
    }
  }
  /deep/ .van-cell {
    padding: 0.1rem 1rem;
    &__title {
      font-size: 0.75rem;
      &:not(.not) {
        flex: none;
      }
      width: 6.5rem;
      font-weight: normal;
    }
    &__value {
      font-size: 0.75rem;
      font-weight: normal;
      .van-button {
        margin-top: 0.1rem;
        font-size: 0.75rem;
        font-weight: 800;
        background: linear-gradient(90deg, #ffcd11, #ffe775);
        height: 1.5rem;
        width: 4.5rem;
        &__content {
          color: #000;
        }
      }
    }
    &:not(.not)::after {
      display: none;
    }
    &.not {
      padding-bottom: 0.5rem;
    }
  }
  .left {
    margin: 1rem 0 1rem 0;
    display: inline-block;
    font-size: 1rem;
    padding: 0.2rem 1rem;
    left: 0;
    border-radius: 0 1rem 1rem 0;
    background: linear-gradient(267deg, #fbd01f, #fee568);
  }
}
.timeTile {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 0.8rem;
}
.backHome {
  color: rgba(250, 207, 6, 1);
  font-size: 0.8rem;
  position: absolute;
  right: 1rem;
  top: 4rem;
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
</style>
