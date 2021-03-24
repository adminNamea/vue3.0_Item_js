<template>
  <div class="replaceRecord">
    <div class="flxe" v-for="(item, index) in logList" :key="index">
      <van-icon :name="icon" />
      <div class="line"></div>
      <h3>{{ item.user_name }}</h3>
      <span class="right">{{ item.create_time }}</span>
    </div>
    <van-empty
      v-if="logList.length == 0"
      image="error"
      description="暂无记录"
    />
  </div>
</template>
<script>
import { Dialog } from "vant";

export default {
  created() {
    document.title = this.$route.params.name;
    const { order_id, role } = this.$route.params;
    this.$api
      .upOrderUserLog({ order_id, role })
      .then((res) => {
        this.logList = res;
      })
      .catch((message) => {
        Dialog({ message });
      });
  },
  data() {
    return {
      icon: require("@/assets/img/dot.png"),
      logList: [],
    };
  },
};
</script>
<style lang="scss" scoped>
.flxe {
  position: relative;
  margin: 3% auto;
  width: 80%;
  padding-left: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  box-shadow: 0 0.3rem 1rem 0 rgba(0, 0, 0, 0.06);
  border-radius: 0.6rem;
  h3 {
    color: #019fbc;
  }
  .van-icon {
    position: absolute;
    left: -2rem;
    z-index: 2;
  }
  .line {
    width: 0.15rem;
    background: rgba(34, 34, 34, 0.1);
    height: 4.66rem;
    position: absolute;
    top: 0;
    z-index: 1;
    left: -1.55rem;
  }
  .right {
    padding: 0.1rem 1rem;
    background: linear-gradient(267deg, #fbd01f, #fee568);
    border-radius: 3rem 0 0 3rem;
  }
}
</style>
