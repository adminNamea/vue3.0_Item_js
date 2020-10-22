<template>
  <div class="login">
    <p>授权登陆中...</p>
  </div>
</template>

<script>
import { Dialog } from "vant";

export default {
  created() {
    this.$store
      .dispatch("login")
      .then(() => {
        this.$router.push("index");
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
