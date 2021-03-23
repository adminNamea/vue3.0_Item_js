<template>
  <div class="parts">
    <h3 @click="partsList.push({ serial_number: '' })">
      额外零件添加
      <img class="img1" src="@/assets/img/huanglingjin.png" />
      <img class="img2" src="@/assets/img/addicon.png" />
    </h3>
    <card class="body" style="overflow: hidden" :hed="false">
      <p>额外零件添加列表</p>
      <van-field
        v-for="(v, index) in partsList"
        :key="index"
        v-model="v.serial_number"
        :label="index + 1 + '.零件名称：'"
        :rules="[{ required: true }]"
      >
        <template #right-icon>
          <van-icon @click="del(index)" :name="icon"></van-icon>
        </template>
        {{ v }}
      </van-field>
    </card>
    <div style="margin-top: 1rem">
      <van-button
        round
        block
        @click="onSubmit"
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        >提交</van-button
      >
    </div>
  </div>
</template>
<script>
import card from "@/components/card/index.vue";
import { Dialog } from "vant";

export default {
  components: {
    card,
  },
  created() {
    this.stationList = this.$route.params.stationList;
    const extra_parts = this.stationList && this.stationList.extra_parts;
    if (extra_parts !== undefined) {
      String(extra_parts)
        .split(",")
        .forEach((v) => {
          console.log(v);
          if (extra_parts != null) {
            this.partsList.push({ serial_number: v });
          }
        });
    } else {
      this.$router.go(-1);
    }
  },
  data() {
    return {
      form: {},
      icon: require("@/assets/img/del.png"),
      partsList: [],
      stationList: {},
    };
  },
  methods: {
    del(index) {
      this.partsList.find((v, i) => {
        if (index === i) {
          this.partsList.splice(i, 1);
          return true;
        }
      });
    },
    onSubmit() {
      this.stationList.extra_parts = this.partsList
        .map((v) => v.serial_number)
        .join(",");
      this.$api
        .upItemParts(this.stationList)
        .then((res) => {
          Dialog({ message: res.msg });
        })
        .catch((message) => {
          Dialog({ message });
        });
      this.$emit("submit");
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep() .van-field__label {
  width: 23%;
  padding-left: 1.5rem;
  color: #000;
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
::v-deep() .van-field__control {
  font-size: 0.8rem;
  padding-left: 0.5rem;
  &:not([readonly="readonly"]) {
    background: rgba(249, 249, 250, 1);
    box-shadow: 0 -0.05rem 0.1rem 0 rgba(0, 0, 0, 0.25);
    border-radius: 0.08rem;
  }
}
::v-deep() .van-field__right-icon {
  transform: scale(1.5);
  margin-left: 1rem;
}
p {
  margin: 0;
  padding: 0 1rem;
  font-size: 1rem;
}
h3 {
  position: relative;
  background: rgba(255, 255, 255, 1);
  border-radius: 0.5rem;
  margin-top: 0.5rem;
  padding: 0 1rem;
  box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
  .img2 {
    width: 4rem;
    height: 4rem;
  }
  .img1 {
    position: absolute;
    top: 0;
    left: 1rem;
  }
}
</style>
