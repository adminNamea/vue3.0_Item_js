<template>
  <div class="cardDetails">
    <card :hed="false" :top="false" v-for="(v, i) in itemDetails.data" :key="i">
      <div class="left">
        时间：{{ filterTime(v.start_time, "HH:MM") }}-{{
          filterTime(v.end_time, "HH:MM")
        }}
      </div>
      <div class="upDate">
        <span></span>
        <span>
          {{
            itemDetails.is_holiday == 0
              ? "工作日"
              : itemDetails.is_holiday == 1
              ? "休息日"
              : itemDetails.is_holiday == 2
              ? "节假日"
              : ""
          }}</span
        >
      </div>
      <div class="flex">
        <van-cell v-if="v.description_name">
          <template #title>
            类型：<span style="color: #969799">{{ v.description_name }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.item_name">
          <template #title>
            项目：<span style="color: #969799">{{ v.item_name }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.group_description">
          <template #title>
            项目类型：<span style="color: #969799">{{
              v.group_description
            }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.ot_name">
          <template #title>
            加班类型：<span style="color: #969799">{{ v.ot_name }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.path_store">
          <template #title>
            出发点：<span style="color: #969799">{{ v.path_store }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.path_end">
          <template #title>
            目的地：<span style="color: #969799">{{ v.path_end }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.path_length">
          <template #title>
            公里数：<span style="color: #969799">{{ v.path_length }}</span>
          </template>
        </van-cell>
        <van-cell v-if="v.description">
          <template #title>
            备注：<span style="color: #969799">{{ v.description }}</span>
          </template>
        </van-cell>
      </div>
    </card>
    <van-empty
      v-if="itemDetails.data == 0"
      image="error"
      description="暂无数据"
    />
    <div v-sticky="false" class="b_fixed" v-if="itemDetails.status_id == 0">
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(0)"
        >审批不通过</van-button
      >
      <van-button
        round
        block
        color="linear-gradient(to right, #FFCD11, #FFE775)"
        @click="onSubmit(1)"
        >通过审批</van-button
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
  data() {
    return {
      itemDetails: { data: [] },
      item: JSON.parse(sessionStorage.getItem("cardItem")),
    };
  },
  created() {
    this.init();
  },
  methods: {
    onSubmit(type) {
      this.$api
        .approvalWorkRecord({
          ...this.item,
          faile_note: this.note,
          type,
        })
        .then((res) => {
          Dialog.alert({ message: res.msg }).then(() => {
            this.$router.go(-1);
          });
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
    init() {
      this.$api
        .workRecordDetails()
        .then((res) => {
          res.data = res.data || [];
          this.itemDetails = res;
        })
        .catch((message) => {
          Dialog({ message });
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.upDate {
  font-family: PingFang SC;
  color: #019fbb;
  display: flex;
  width: 100%;
  position: absolute;
  top: 1rem;
  span {
    display: inline-block;
    flex: 1;
    &:nth-child(1) {
      flex: 1.2;
      padding-left: 2.5rem;
    }
  }
}
.b_fixed {
  display: flex;
  align-items: center;
  justify-content: space-between;
  button {
    width: 49%;
  }
}
.left {
  margin: 1rem 0 0 -1rem;
  display: inline-block;
  font-size: 1rem;
  padding: 0.3rem 1rem 0.5rem 2rem;
  border-radius: 0 1rem 1rem 0;
  background: #434343;
  color: #ffffff;
}
::v-deep() .flex {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .van-cell {
    display: inline-flex;
    width: 45%;
    &__title {
      flex: none;
      width: 100%;
    }
  }
}
</style>
