<template>
  <div class="login">
    <p>授权登陆中...</p>
  </div>
</template>

<script>
import { Dialog } from "vant";
import { useStore } from "vuex";
import router from "@/router";

export default {
  setup() {
    const store = useStore();
    store
      .dispatch("login")
      .then(() => {
        router.push("index");
      })
      .catch((message) => {
        Dialog({ message });
      });
  },
};
</script>
<style lang="scss" scoped>
.login {
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  display: flex;
  align-items: center;
  justify-content: center;
  P {
    color: gray;
  }
}
</style>
