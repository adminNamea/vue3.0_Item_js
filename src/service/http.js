import fetch from './axios';

export default {
  // 获取简到云地址
  loginJdy() {
    return fetch('loginJdy');
  },
  /**
    获取用户信息
    @keyword 查询条件
  */
  getUserList({ keyword = "" }) {
    return fetch('getUserList', { keyword, page: 1, pagesize: 1000 });
  },
  /**
   * 获取项目列表
   * @keyword 查询条件
   *  */
  getItemList({ keyword = "" }) {
    return fetch('getItemList', { keyword, page: 1, pagesize: 1000 });
  },
  /** 我的工单工位列表
   * @page 1
   * @pagesize 1000
   * @param 后续参数
  */
  orderList(obj) {
    return fetch('orderList', { page: 1, pagesize: 1000, ...obj });
  },
  /** 工单信息
   * @order_id 工单id
  */
  orderDetails(order_id) {
    return fetch('orderDetails', { order_id }).then((res) => {
      sessionStorage.setItem('total_hour', res.total_hour);
      sessionStorage.setItem('serial_number', res.serial_number);
      return res;
    });
  },
  /** 修改派工状态
   * @order_id 工单id
   * @is_dispatch 是否派工
   * @cause 建议
   */
  udOrderDispatch({ order_id, is_dispatch, cause = "" }) {
    return fetch('udOrderDispatch', { order_id, is_dispatch, cause });
  },
  /** 修改主修人员
   *  @order_id 工单id
   * @major_user_id 主修id
  */
  upOrderMajorUser({ order_id, major_user_id }) {
    return fetch('upOrderMajorUser', { order_id, major_user_id });
  },
  /** 修改副修
   *  @order_id 工单id
   *  @minor_user 副修id
   * */
  upOrderMinorUser({ order_id, minor_user }) {
    return fetch('upOrderMinorUser', { order_id, minor_user });
  },
  /** 获取工位列表
   * @page 1
   * @pagesize 1000
  */
  getStationlList() {
    return fetch('getStationlList', { page: 1, pagesize: 1000 });
  },
  /** 获取预约工位列表
   * @keyword ""
  */
  woApiStationOrder(keyword = "") {
    return fetch('woApiStationOrder', { keyword, page: 1, pagesize: 1000 });
  },
  /** 获取机器信息
   * @serial_number "机器编号"
  */
  tpMachineInfo(serial_number) {
    return fetch('tpMachineInfo', { serial_number });
  },
  /** 添加订单
   *
   * @order_type 工单类型 1：保养工单 2收益性工单 3 大修工单
   * @serial_number 机身编号
   * @model 机型
   * @m_location 机器地址
   * @total_hour 运行小时数
   * @delivery_time 交机日期
   * @pl_location PL机器地址
   * @custom_name 客户名
   * @custom_number 客户编号
   * @custom_phone 客户电话
   * @contact_name 联系人
   * @phone 联系电话
   * @major_user_id 主修
   * @minor_user_id 副修[]
   * @promise_work_time 承诺派工时间
   * @promise_time 承诺到达时间
   * @promise_finish_time 承诺完成时间
   * @is_halt 是否停机
   * @order_type 工单类型
   * @service_car 服务车牌号
   * @order_reason 客户反馈
   * @order_note 备注
   * @item item_type 项目类型 0.标准 1.自定义
   * @item item_type_id 基本项目列表---项目id   (标准)
   * @item is_factory 基本项目列表---是否厂内
   * @item deadline_parts_time 基本项目列表---零件需求日期
   * @item real_parts_time基本项目列表---零件领取日期
   * @item item_cost_time 工时（自定义）
   * @item operate_code 工作代码（自定义）
   * @item parts_code 零件代码（自定义）
   * @item deadline_parts_time 基本项目列表---零件需求日期
   * @item real_parts_time 基本项目列表---零件领取日期
   * @item operate_code 工作代码（自定义）
   * @item parts_code 零件代码（自定义）
   * @item item_name 项目名称
   * @station station_order_id 预约订单id     非必填
   * @station sdate 工位使用开始时间
   * @station edate 工位使用结束时间
   * @station user_id 1,2选择人员id
   * @station item_key 1,3项目数组key
   * @station 工位[]
   * @item 项目[] */
  addOrder(data) {
    return fetch('addOrder', data);
  },
  /** 项目添加 */
  addOrderItem(data) {
    return fetch('addOrderItem', data);
  },
  /** 项目删除 */
  deOrderItem(data) {
    return fetch('deOrderItem', data);
  },
  /** 主修/副修变更记录 */
  upOrderUserLog({ order_id, role }) {
    return fetch('upOrderUserLog', { order_id, role });
  },
  /** 修改时间 */
  upPromiseTime(data) {
    return fetch('upPromiseTime', data);
  },
  /** 我的工作列表 */
  MyOrderList(obj) {
    return fetch('MyOrderList', { page: 1, pagesize: 1000, ...obj });
  },
  /** 工单工位列表 */
  getOrderStation(order_id) {
    return fetch('getOrderStation', { order_id });
  },
  /** 工位详情 */
  orderStationDetails(order_station_id) {
    return fetch('orderStationDetails', { order_station_id });
  },
  /** 工位修改 */
  upOrderStation(data) {
    return fetch('upOrderStation', data);
  },
  /** 获取指定工单人员 */
  orderUser(data) {
    return fetch('orderUser', data);
  },
  /** 获取指定工单项目 */
  orderItem(data) {
    return fetch('orderItem', data);
  },
  /** 获取全部工单项目 */
  allOrderItem(data) {
    return fetch('allOrderItem', data);
  },
  /** 获取项目详情 */
  getItemDetails(order_item_id) {
    return fetch('getItemDetails', { order_item_id });
  },
  /** 零件编辑 */
  upItemParts(data) {
    return fetch('upItemParts', data);
  },
  /** 删除大修工位 */
  delOrderStation(order_station_id) {
    return fetch('delOrderStation', { order_station_id });
  },
  /** 批量添加大修工位 */
  addAllStationOrder({ order_id, station }) {
    return fetch('addAllStationOrder', { order_id, station });
  },
  /** 获取工单用户数据 */
  getOrderUserList(order_id) {
    return fetch('getOrderUserList', { order_id });
  },
  /** 获取获取钉钉信息 */
  getConfig(data) {
    return fetch('getConfig', data);
  },
  /** 获取获取Token */
  getToken(code) {
    return fetch('getToken', { code });
  },
  /** 工单状态变更 */
  upOrderStatus({ order_id, status_id }) {
    return fetch('upOrderStatus', { order_id, status_id });
  },
  /** 补充信息（回访联系人） */
  upOrderContacts(data) {
    return fetch('upOrderContacts', data);
  },
  /** 维修日志列表 */
  OrderLogList(order_id) {
    return fetch('OrderLogList', { order_id });
  },
  /** 添加维修日志 */
  addOrderLog(order_id) {
    return fetch('addOrderLog', { log_value: '编辑你的日志', order_id });
  },
  /** 编辑维修日志 */
  upOrderLog(data) {
    return fetch('upOrderLog', data);
  },
  /** 删除维修日志 */
  deleteOrderLog(order_log_id) {
    return fetch('deleteOrderLog', { order_log_id });
  },
  /** 保存维修报告 */
  backItemReport(data) {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('backItemReport', { ...data, order_item_id });
  },
  /** 添加维修报告 */
  addItemReport(data) {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('addItemReport', { ...data, order_item_id });
  },
  /** 获取维修报告 */
  getItemReport() {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('getItemReport', { order_item_id });
  },
  /** 零件故障分类 */
  getPartsIssueCate() {
    const order_id = sessionStorage.getItem('order_id');
    return fetch('getPartsIssueCate', { order_id });
  },
  /**
   * 零件故障列表
   * @cate_id
   * @keyword
  */
  getPartsIssueList(data) {
    return fetch('getPartsIssueList', data);
  },
  /**
   * 添加故障信息
   * @issue_part_number 造成问题零件号
  */
  addItemPartsIssue(data) {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('addItemPartsIssue', { ...data, order_item_id });
  },
  /**
   * 我发起的费用
  */
  Reimbursement(data) {
    return fetch('Reimbursement', { ...data, page: 1, pagesize: 100 });
  },
  /**
   * 费用详情
  */
  resumeDetails() {
    const resume_aproval_id = sessionStorage.getItem("resume_aproval_id");
    return fetch('resumeDetails', { resume_aproval_id });
  },
  /**
   * 费用审批
   * @is_agree 是否通过（0否 1是）
   * @faile_note 备注
  */
  approval(data) {
    const resume_aproval_id = sessionStorage.getItem("resume_aproval_id");
    return fetch('approval', { resume_aproval_id, ...data });
  },
  /**
   * 审批费用列表
  */
  ReimbursementApprovalList(data) {
    return fetch('ReimbursementApprovalList', { page: 1, pagesize: 100, ...data });
  },
  /**
  * 工卡审批列表
  */
  workRecord(data) {
    sessionStorage.setItem('cardItem', JSON.stringify(data));
    return fetch('workRecord', data);
  },
  /**
  * 工卡详情
  */
  workRecordDetails(data) {
    if (!data) {
      data = JSON.parse(sessionStorage.getItem('cardItem'));
    } else if (data.date) {
      sessionStorage.setItem('cardItem', JSON.stringify(data));
    }
    return fetch('workRecordDetails', { is_copy: 0, ...data });
  },
  /**
  * 工卡删除
  */
  deWorkRecord(record_id) {
    return fetch('deWorkRecord', { record_id });
  },
  /**
  * 工卡类型获取
  */
  event_description(type) {
    return fetch('event_description', { type });
  },
  /**
  * 获取加班类型
  */
  work_record_ot() {
    return fetch('work_record_ot');
  },
  /**
  * 获取项目类型
  */
  work_record_category_group() {
    return fetch('work_record_category_group');
  },
  /**
  * 获取项目类型
  */
  addWorkRecord(data) {
    return fetch('addWorkRecord', data);
  },
  /**
  * 帮填工卡
  */
  syncWorkRecord(data) {
    return fetch('syncWorkRecord', data);
  },
  /**
  * 复制工卡（获取他人工卡信息）
  */
  copyWorkRecord(data) {
    return fetch('copyWorkRecord', data);
  },
  /**
  * 费用类型获取
  */
  orderResumeType() {
    return fetch('orderResumeType', { parentid: 0 });
  },
  /**
  * 添加费用信息保存
  */
  addResumeAprovalBack(data) {
    return fetch('addResumeAprovalBack', data);
  },
  /**
   * 费用添加
   */
  addResumeAproval(data) {
    return fetch('addResumeAproval', data);
  },
  /**
   * 提交工单审批
   */
  addOrderApproval(order_id) {
    return fetch('addOrderApproval', { order_id });
  },
  /**
   * 我发起的工单
   */
  OrderApproval(data) {
    return fetch('OrderApproval', { ...data, page: 1, pagesize: 1000 });
  },
  /**
   * 工单审批列表
   */
  OrderApprovallist(data) {
    return fetch('OrderApprovallist', data);
  },
  /**
   * 工单审批
   */
  confirmOrderApproval(data) {
    return fetch('confirmOrderApproval', data);
  },
  /**
   * 工卡审批
   */
  approvalWorkRecord(data) {
    return fetch('approvalWorkRecord', data);
  },
  /**
   * 项目清单列表获取
   */
  getItemProjectList(data) {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('getItemProjectList', { ...data, order_item_id });
  },
  /**
   * 保养项目清单添加
   */
  addItemMaintenance(data) {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('addItemMaintenance', { ...data, order_item_id });
  },
  /**
  * 交机报告添加
  */
  addItemReportDeliver(data) {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('addItemReportDeliver', { ...data, order_item_id });
  },
  /**
  * 油样基础录入列表
  */
  sos(data) {
    return fetch('sos', { part_id: 0, page: 1, pagesize: 100, ...data });
  },
  /**
  * 部件类型获取
  */
  sosPart() {
    return fetch('sosPart');
  },
  /**
  * 油样信息详情
  */
  sosDetails() {
    const sos_number_code = sessionStorage.getItem('sos_number_code');
    return fetch('sosDetails', { sos_number_code });
  },
  /**
  * 油样地址
  */
  sosAddress(data) {
    return fetch('sosAddress', { address_type: 1, ...data });
  },
  /**
  * 油样录入提交
  */
  sosEdit(data) {
    const sos_number_code = sessionStorage.getItem('sos_number_code');
    return fetch('sosEdit', { sos_number_code, ...data });
  },
  /**
  * 油品粘度
  */
  sosLevel(brand_id) {
    return fetch('sosLevel', { brand_id });
  },
  /**
  * 油品品牌列表
  */
  sosBrand() {
    return fetch('sosBrand');
  },
  /**
  * 获取项目零件故障信息
  */
  getItemPartsIssue() {
    const order_item_id = sessionStorage.getItem('order_item_id');
    return fetch('getItemPartsIssue', { order_item_id });
  },
  /**
  * 获取阿里云配置
  */
  getOssConfig(type) {
    type || (type = 'workorder');
    return fetch('getOssConfig', { type });
  },
  /**
  * 工单现场发现修改
  */
  editOrderSpotImg(spot_img_aliyun) {
    const order_id = sessionStorage.getItem('order_id');
    return fetch('editOrderSpotImg', { order_id, spot_img_aliyun });
  },
  /**
  * 获取安全五步法信息
  */
  takeFive() {
    const order_id = sessionStorage.getItem('order_id');
    return fetch('takeFive', { order_id });
  },
  // 安全五步法列表
  takeFiveList(data) {
    return fetch('takeFiveList', data);
  },
  // 安全五步法详情
  takeFiveListDetails(take_id) {
    return fetch('takeFiveListDetails', { take_id });
  },
  /**
  * 安全五步法提交
  */
  takeFiveEdit(data) {
    return fetch('takeFiveEdit', data);
  },
  getStationInfo({ station_id, month } = {}) {
    return fetch('getStationInfo', { station_id, month });
  },
  // 工单审批 项目详情
  OrderApprovalItem() {
    const item_id = sessionStorage.getItem('order_item_id');
    return fetch('OrderApprovalItem', { item_id });
  },
  // 获取用户信息
  getProfile(token) {
    return fetch('getProfile', { token });
  },
  // 修改费用
  editResumeAproval(data) {
    return fetch('editResumeAproval', data);
  },
  // 工单提交
  editOrder(data) {
    return fetch('editOrder', data);
  },
  // 获取工作，零件代码
  getOrderItemCode(code) {
    return fetch('getOrderItemCode', { code });
  },
  // 检测选择日期费用是否填写
  checkReimbursement(date, order_item_id) {
    return fetch('checkReimbursement', { date, order_item_id });
  }
};
