<template>
  <div class="container my-auto">
    <div class="row text-info">
      <div class="col-4 text-center" style="font-size: 100px">
        <i class="fas fa-walking"></i>
      </div>
      <div class="col-8">
        <form class="w-100" @submit.prevent.stop="handleSubmit">
          <h4 class="mb-3">Account Login</h4>
          <div class="form w-75">
            <input
              id="email"
              v-model="email"
              type="text"
              class="form-control mb-1"
              placeholder="Email ..."
              name="email"
            />
            <input
              id="password"
              v-model="password"
              type="password"
              class="form-control mb-3"
              placeholder="Password ..."
              name="password"
            />
            <button type="submit" class="btn btn-info">LOGIN</button>
          </div>
          <p class="mt-5 mb-3 text-muted text-right">&copy; YuCheng Huang</p>
        </form>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      email: "",
      password: "",
    };
  },
  methods: {
    handleSubmit() {
      const data = JSON.stringify({
        email: this.email,
        password: this.password,
      });

      // TODO: 向後端驗證使用者登入資訊是否合法
      console.log("data", data);
    },
  },
};
</script>

<style scoped>
input:hover {
  border-color: darkgray;
}
</style>