<template>
  <div class="home">
    <div class="body">
      <div
        class="img"
        v-for="(item, index) in homeData"
        :key="index"
        @click="to(item)"
      >
        <img :src="item.img" />
        <p>{{ item.name }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const { isRole } = useStore().state;
    const homeData = [
      {
        img: require("@/assets/img/添加费用.png"),
        name: "添加费用",
        url: "addFees",
      },
      {
        img: require("@/assets/img/我发起的工单.png"),
        name: "我发起的工单",
        url: "myByOrdey",
      },
      {
        img: require("@/assets/img/我发起的费用.png"),
        name: "我发起的费用",
        url: "myByFees",
      },
      {
        img: require("@/assets/img/工单审批.png"),
        name: "工单审批",
        url: "orderApproval",
        role: true,
      },
      {
        img: require("@/assets/img/费用审批.png"),
        name: "费用审批",
        url: "feesApproval",
        role: true,
      },
      {
        img: require("@/assets/img/工卡审批.png"),
        name: "工卡审批",
        url: "cardApproval",
        role: true,
      },
    ].filter((v) => {
      if (v.role) {
        return isRole;
      }
      return true;
    });
    return { homeData };
  },
  methods: {
    to(item) {
      if (item.url !== "out") {
        this.$router.push({ name: item.url });
      } else {
        this.outLogin();
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  text-align: center;
}
.body {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .img {
    margin: 1rem 0 0 0;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0 0.1rem 0.1rem 0.05rem rgba(0, 0, 0, 0.08);
    border-radius: 0.2rem;
    width: 31.5%;
    height: 20%;
    p {
      font-size: 1rem;
      margin-top: 0.1rem;
    }
    img {
      width: 100%;
      transform: scale(0.85);
      height: 80%;
    }
  }
}
</style>
