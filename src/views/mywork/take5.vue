<template>
  <div class="fillInfo">
    <van-form @submit="onSubmit">
      <card :hed="false" :top="false">
        <p>当前定位</p>
        <span class="lo"
          >广东省佛山市顺德区伟业路10号之1靠近森达美信昌机器工程（广东）有限公司</span
        >
      </card>
      <card :hed="false" :top="false">
        <div class="left">第一步：停下来</div>
        <van-cell
          title="1.到达工作地点旁边，先停下来，我已了解工作内容,并观察周围环境"
          @click="checkde(1)"
        >
          <template #right-icon>
            <van-icon :name="icon(1)" />
          </template>
        </van-cell>
      </card>
      <card :hed="false" :top="false">
        <div class="left">第二步：看一看</div>
        <van-cell
          title="1.我有足够的技术及只是来进行今日任务"
          @click="checkde(2)"
        >
          <template #right-icon>
            <van-icon :name="icon(2)" />
          </template>
        </van-cell>
        <van-cell title="2.我已有定制的程序" @click="checkde(3)">
          <template #right-icon>
            <van-icon :name="icon(3)" />
          </template>
        </van-cell>
        <van-cell title="3.我明白工作中的每一个步骤" @click="checkde(4)">
          <template #right-icon>
            <van-icon :name="icon(4)" />
          </template>
        </van-cell>
        <van-cell title="4.我的设备及工具状况良好" @click="checkde(5)">
          <template #right-icon>
            <van-icon :name="icon(5)" />
          </template>
        </van-cell>
        <van-cell title="5.我配有正确的PPE" @click="checkde(6)">
          <template #right-icon>
            <van-icon :name="icon(6)" />
          </template>
        </van-cell>
        <van-cell title="6.我已取得所需的许可去授权和工作" @click="checkde(7)">
          <template #right-icon>
            <van-icon :name="icon(7)" />
          </template>
        </van-cell>
        <van-cell title="7.我脑子有清晰的计划" @click="checkde(8)">
          <template #right-icon>
            <van-icon :name="icon(8)" />
          </template>
        </van-cell>
      </card>
      <card :hed="false" :top="false">
        <div class="left">第三步：是否识别危害</div>
        <van-cell
          title="看近些，看这些，看高些，看低些,我是否已考虑/身处这些危害"
          @click="checkde(9)"
        >
          <template #right-icon>
            <van-icon :name="icon(9)" />
          </template>
        </van-cell>
        <div class="f">人为危害</div>
        <van-cell title="1.别扭的姿势" @click="checkde(10)">
          <template #right-icon>
            <van-icon :name="icon(10)" />
          </template>
        </van-cell>
        <van-cell title="2.重复的动作" @click="checkde(11)">
          <template #right-icon>
            <van-icon :name="icon(11)" />
          </template>
        </van-cell>
        <van-cell title="3.人力提举（提，放，推，拉）" @click="checkde(12)">
          <template #right-icon>
            <van-icon :name="icon(12)" />
          </template>
        </van-cell>
        <van-cell title="4.其他人在工作（在上或在下）" @click="checkde(13)">
          <template #right-icon>
            <van-icon :name="icon(13)" />
          </template>
        </van-cell>
        <van-cell title="5.疲劳" @click="checkde(14)">
          <template #right-icon>
            <van-icon :name="icon(14)" />
          </template>
        </van-cell>
        <div class="f">环境危害</div>
        <van-cell title="1.场地脏乱" @click="checkde(15)">
          <template #right-icon>
            <van-icon :name="icon(15)" />
          </template>
        </van-cell>
        <van-cell title="2.视野不良" @click="checkde(16)">
          <template #right-icon>
            <van-icon :name="icon(16)" />
          </template>
        </van-cell>
        <van-cell title="3.湿，滑，不稳定的地面" @click="checkde(17)">
          <template #right-icon>
            <van-icon :name="icon(17)" />
          </template>
        </van-cell>
        <van-cell title="4.噪音，震动" @click="checkde(18)">
          <template #right-icon>
            <van-icon :name="icon(18)" />
          </template>
        </van-cell>
        <van-cell title="5.高温，高热" @click="checkde(19)">
          <template #right-icon>
            <van-icon :name="icon(19)" />
          </template>
        </van-cell>
        <van-cell title="6.废弃" @click="checkde(20)">
          <template #right-icon>
            <van-icon :name="icon(20)" />
          </template>
        </van-cell>
        <van-cell title="7.密闭空间" @click="checkde(21)">
          <template #right-icon>
            <van-icon :name="icon(21)" />
          </template>
        </van-cell>
        <van-cell title="8.不良天气" @click="checkde(22)">
          <template #right-icon>
            <van-icon :name="icon(22)" />
          </template>
        </van-cell>
        <van-cell title="9.其他危害" @click="checkde(23)">
          <template #right-icon>
            <van-icon :name="icon(23)" />
          </template>
        </van-cell>
        <van-cell title="10.能量积聚" @click="checkde(24)">
          <template #right-icon>
            <van-icon :name="icon(24)" />
          </template>
        </van-cell>
        <van-cell title="11.化学" @click="checkde(25)">
          <template #right-icon>
            <van-icon :name="icon(25)" />
          </template>
        </van-cell>
        <van-cell title="12.电力生物" @click="checkde(26)">
          <template #right-icon>
            <van-icon :name="icon(26)" />
          </template>
        </van-cell>
        <van-cell title="13.火力" @click="checkde(27)">
          <template #right-icon>
            <van-icon :name="icon(27)" />
          </template>
        </van-cell>
        <van-cell title="14.辐射" @click="checkde(28)">
          <template #right-icon>
            <van-icon :name="icon(28)" />
          </template>
        </van-cell>
        <div class="f">机械危害</div>
        <van-cell title="1.意外启动" @click="checkde(29)">
          <template #right-icon>
            <van-icon :name="icon(29)" />
          </template>
        </van-cell>
        <van-cell title="2.移动设备" @click="checkde(30)">
          <template #right-icon>
            <van-icon :name="icon(30)" />
          </template>
        </van-cell>
        <van-cell title="3.滚动机械" @click="checkde(31)">
          <template #right-icon>
            <van-icon :name="icon(31)" />
          </template>
        </van-cell>
        <van-cell title="4.转动部分" @click="checkde(32)">
          <template #right-icon>
            <van-icon :name="icon(32)" />
          </template>
        </van-cell>
        <van-cell title="5.夹手位" @click="checkde(33)">
          <template #right-icon>
            <van-icon :name="icon(33)" />
          </template>
        </van-cell>
        <div class="f">重力危害</div>
        <van-cell title="1.高空工作" @click="checkde(34)">
          <template #right-icon>
            <van-icon :name="icon(34)" />
          </template>
        </van-cell>
        <van-cell title="2.高空坠物" @click="checkde(35)">
          <template #right-icon>
            <van-icon :name="icon(35)" />
          </template>
        </van-cell>
        <van-cell title="3.重压设备/工具" @click="checkde(36)">
          <template #right-icon>
            <van-icon :name="icon(36)" />
          </template>
        </van-cell>
        <van-cell title="4.落山/山泥倾斜" @click="checkde(37)">
          <template #right-icon>
            <van-icon :name="icon(37)" />
          </template>
        </van-cell>
        <div class="f">填写建议</div>
        <van-field type="textarea" class="textarea" v-model="value" />
        <div class="f"></div>
        <van-cell title="1.我已完成上列的危害清单" @click="checkde(38)">
          <template #right-icon>
            <van-icon :name="icon(38)" />
          </template>
        </van-cell>
        <van-cell title="2.我知道如何处理以上危害" @click="checkde(39)">
          <template #right-icon>
            <van-icon :name="icon(39)" />
          </template>
        </van-cell>
        <van-cell title="3.我将会操作设备之护罩已妥善安装" @click="checkde(40)">
          <template #right-icon>
            <van-icon :name="icon(40)" />
          </template>
        </van-cell>
        <van-cell
          title="4.当我操作移动设备/机械时，会对自身/他人造成危险"
          @click="checkde(41)"
        >
          <template #right-icon>
            <van-icon :name="icon(41)" />
          </template>
        </van-cell>
      </card>
      <card :hed="false" :top="false">
        <div class="left">第四步：做计划</div>
        <van-cell title="1.我已计划了措施来控制以上危害" @click="checkde(42)">
          <template #right-icon>
            <van-icon :name="icon(42)" />
          </template>
        </van-cell>
        <van-cell
          title="2.我有能力执行相关措施来控制以上危害"
          @click="checkde(43)"
        >
          <template #right-icon>
            <van-icon :name="icon(43)" />
          </template>
        </van-cell>
        <van-cell title="3.灭有告绝不妥的地方" @click="checkde(44)">
          <template #right-icon>
            <van-icon :name="icon(44)" />
          </template>
        </van-cell>
      </card>
      <card :hed="false" :top="false">
        <div class="left">第五步：安全工作</div>
        <van-cell title="1.我将开展工作及留意现场情况" @click="checkde(45)">
          <template #right-icon>
            <van-icon :name="icon(45)" />
          </template>
        </van-cell>
        <van-field
          label="备注："
          class="textarea"
          type="textarea"
          v-model="value"
        />
        <van-cell title="上传图片：" value-class="upload">
          <van-uploader
            :max-count="4"
            v-model="fileList"
            :after-read="afterRead"
          >
            <img
              style="height: 4rem; width: 4rem"
              src="@/assets/img/uploader.png"
            />
            <template #preview-cover="{ file }">
              <div class="preview-cover van-ellipsis">{{ file.name }}</div>
            </template>
          </van-uploader>
        </van-cell>
      </card>
      <van-button
        class="b_fixed"
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        native-type="submit"
        >提交</van-button
      >
    </van-form>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
  },
  data() {
    return {
      value: "",
      fileList: [],
      checkedIcon: require("@/assets/img/choice-blue.png"),
      noCheckedIcon: require("@/assets/img/choice-gray.png"),
      checkdeData: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.checkdeData.length === 45) {
        this.$api
          .upOrderContacts({})
          .then(() => {
            Dialog.alert({
              message: "提交成功",
            }).then(() => {
              this.$router.go(-1);
            });
          })
          .catch((message) => {
            Dialog({ message });
          });
      } else {
        Dialog({ message: "请仔细阅读,并确认" });
      }
    },
    afterRead() {},
    icon(i) {
      const status = this.checkdeData.includes(i);
      return status ? this.checkedIcon : this.noCheckedIcon;
    },
    checkde(i) {
      const status = this.checkdeData.find((v, index) => {
        if (v === i) {
          this.checkdeData.splice(index, 1);
          return true;
        }
      });
      if (!status) {
        this.checkdeData.push(i);
      }
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep() .van-form {
  overflow: scroll;
  height: 44rem;
  position: relative;
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
p {
  font-size: 1.1rem;
  margin: 0;
  padding: 0.7rem 1rem;
}
::v-deep() .van-cell {
  align-items: center;
}
.lo {
  font-size: 0.8rem;
  padding: 0 1rem;
}
.f {
  padding: 0.1rem 1rem;
  height: 1.32rem;
  color: #ffffff;
  background: #616161;
}
.upload {
  flex: none;
  width: 80%;
  text-align: left;
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
.textarea {
  align-items: flex-start;
  ::v-deep() .van-field__control {
    position: relative;
    background: #f9f9fa;
    box-shadow: rgba(0, 0, 0, 0.25) 0px -1px 1px 0px;
    border-radius: 0.2rem;
    padding: 0.5rem 1rem;
    height: 5rem;
  }
}
</style>
