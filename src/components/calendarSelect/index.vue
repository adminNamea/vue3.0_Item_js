<template>
  <div class="calendarSelect">
    <div @click.stop="showTime">
      <slot :sDate="sdate" :eDate="edate">
        <div v-if="sDate != '请选择' && sDate != ''">
          {{ sDate }}
          <span style="margin: 0 2vw">至</span>
          {{ eDate }}
        </div>
        <span v-else>请选择日期</span>
      </slot>
    </div>
    <van-dialog
      v-model:show="show"
      @open="open"
      teleport="#app"
      class="calendarSelect"
      confirm-button-color="#FFCD6E"
      :close-on-click-overlay="true"
      confirm-button-text="预约"
      @confirm="confirm"
    >
      <template #title>
        <div class="dateTile">
          <img
            class="leftIcon"
            @click.stop="nextAndPrev(-1)"
            src="./img/left.png"
          />
          <span>{{ year }} {{ englishM }}</span>
          <img
            class="rightIcon"
            @click.stop="nextAndPrev(1)"
            src="./img/right.png"
          />
        </div>
      </template>
      <div class="cTitle">
        <em>Sun</em>
        <em>Mon</em>
        <em>Tue</em>
        <em>Wen</em>
        <em>Thu</em>
        <em>Fri</em>
        <em>Sat</em>
      </div>
      <div class="dateIcon">
        <div class="icon" v-for="v in day" :key="v + 'd'">
          <span style="position: relative; z-index: 1"> </span>
        </div>
        <div
          class="icon"
          v-for="(item, key) in dateData"
          :class="{
            action: isA(item.value),
            sta: item.value == sValue,
            end: item.value == eValue,
            [colorObj(item.index)]: true,
          }"
          @click.stop="iconClick(item.value)"
          :key="key"
        >
          <span style="position: relative; z-index: 1">{{ item.index }}</span>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
export default {
  props: {
    formatValue: {
      default: "date",
      type: String,
    },
    disable: {
      default: false,
      type: [Boolean, Number],
    },
    sDate: {
      default: "请选择",
      type: String,
    },
    eDate: {
      default: "请选择",
      type: String,
    },
    details: {
      default() {
        return {};
      },
      type: Object,
    },
  },
  data() {
    return {
      edate: "请选择",
      sdate: "请选择",
      month: new Date().getMonth(),
      year: new Date().getFullYear(),
      show: false,
      sValue: 0,
      eValue: 0,
    };
  },
  computed: {
    day() {
      let day = new Date(`${this.year}-${this.month + 1}-1`).getDay();
      if (day === 0) {
        day = 7;
      }
      return day - 1;
    },
    dateData() {
      const d = new Date(this.year, this.month + 1, 0).getDate();
      const data = [];
      for (let index = 1; index <= d; index++) {
        const value = new Date(this.year, this.month, index).getTime();
        data.push({ value, index, d });
      }
      return data;
    },
    englishM() {
      const dateArr = [
        "一月",
        "二月",
        "三月",
        "四月",
        "五月",
        "六月",
        "七月",
        "八月",
        "九月",
        "十月",
        "十一月",
        "十二月",
      ];
      return dateArr[this.month];
    },
  },
  methods: {
    isA(value) {
      return this.sValue <= value && value <= this.eValue;
    },
    colorObj(index) {
      if (this.details[index]) {
        const color =
          this.details[index].uC > 0
            ? "re"
            : this.details[index].oC > 0
            ? "yo"
            : "";
        return color;
      }
      return "";
    },
    showTime() {
      if (this.disable) {
        return;
      }
      this.show = true;
      this.$emit("opendate", `${this.year}-${this.month + 1}`);
    },
    open() {
      if (this.sDate !== "请选择" && this.sDate !== "") {
        this.sValue = new Date(this.sDate.replace(/-/g, "/")).getTime();
        this.eValue = new Date(this.eDate.replace(/-/g, "/")).getTime();
        this.month = new Date(this.sDate).getMonth();
        this.year = new Date(this.sDate).getFullYear();
      }
    },
    confirm() {
      let obj = { sDate: this.sValue, eDate: this.eValue };
      if (this.formatValue === "date") {
        obj = { sDate: this.sDate, eDate: this.eDate };
      }
      this.$emit("confirm", obj);
      this.sdate = this.filterTime(this.sValue);
      this.edate = this.filterTime(this.eValue);
      this.$emit("update:sDate", this.sdate);
      this.$emit("update:eDate", this.edate);
    },
    nextAndPrev(value) {
      this.month += value;
      if (this.month > 11) {
        this.month = 0;
        this.year += 1;
      } else if (this.month < 0) {
        this.month = 11;
        this.year -= 1;
      }
      this.$emit("nextorprev", `${this.year}-${this.month + 1}`);
    },
    filterTime(value = 0) {
      const date = new Date(value);
      let m = date.getMonth() + 1;
      m = m < 10 ? `0${m}` : m;
      const y = date.getFullYear();
      let d = date.getDate();
      d = d < 10 ? `0${d}` : d;
      return `${y}-${m}-${d}`;
    },
    iconClick(value) {
      if (value === "") {
        return;
      }
      if (this.eValue !== this.sValue || this.sValue === 0) {
        this.sValue = value;
        this.eValue = value;
      } else {
        this.sValue = value;
        if (this.sValue > this.eValue) {
          [this.sValue, this.eValue] = [this.eValue, this.sValue];
        }
      }
    },
  },
};
</script>

<style lang="scss">
.calendarSelect {
  .cTitle {
    display: flex;
    justify-content: space-evenly;
    em {
      color: #4d4d4d;
      font-style: normal;
    }
  }
  .van-dialog {
    background: #ffffff;
    box-shadow: 0 0.1rem 0.5rem 0 rgba(255, 205, 17, 0.4);
  }
  .van-dialog__header {
    padding: 0;
    height: 3.5rem;
  }
  .van-hairline--top::after {
    border-color: #faeec9;
    border-top-width: 0.1rem;
  }
  .dateIcon {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    padding-left: 0.8rem;
    height: 100%;
    .icon {
      border: 1px solid #ffffff;
      color: #999999;
      display: flex;
      font-family: Montserrat;
      font-weight: 300;
      align-items: center;
      justify-content: center;
      height: 2rem;
      width: 2rem;
      margin: 0.7rem 0 0 0.58rem;
      border-radius: 50%;
      &:nth-child(7n + 1) {
        margin-left: 0.2rem;
        margin-right: 0.1rem;
      }
    }
    .yo {
      border: 1px solid #ffcd11;
    }
    .re {
      border: 1px solid #ff5a7b;
    }
    .disable {
      background-color: #373737;
      color: #fff;
      border: 1px solid #fff;
      opacity: 0.5;
    }
    .icon.action {
      position: relative;
      border: 1px solid rgba(0, 0, 0, 0);
      color: #fff;
      &::after {
        content: "";
        width: 150%;
        height: 100%;
        position: absolute;
        left: 0;
        background: linear-gradient(to bottom, #88d6ff 0%, #51adfb 100%);
      }
      &:nth-child(7n) {
        &::after {
          width: 100%;
          border-radius: 0 1rem 1rem 0;
        }
      }
      &:nth-child(1),
      &:nth-child(7n + 1) {
        &::after {
          border-radius: 1rem 0 0 1rem;
        }
      }
    }
    .icon.action.sta {
      &::after {
        border-radius: 1rem 0 0 1rem;
      }
    }
    .icon.action.end {
      &::after {
        border-radius: 0 1rem 1rem 0;
        width: 100%;
      }
    }
    .icon.action.sta:nth-child(7n),
    .icon.action.end:nth-child(7n + 1),
    .icon.action.end.sta {
      &::after {
        border-radius: 1rem;
      }
    }
  }
  .dateTile {
    top: 30%;
    font-size: 1.2rem;
    height: 1.5rem;
    color: #ffcd6e;
    font-weight: 400;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    .leftIcon {
      position: absolute;
      top: 0rem;
      left: 2rem;
      width: 1.5rem;
      height: 1.5rem;
    }
    .rightIcon {
      position: absolute;
      top: 0rem;
      right: 2rem;
      width: 1.5rem;
      height: 1.5rem;
    }
  }
}
</style>
