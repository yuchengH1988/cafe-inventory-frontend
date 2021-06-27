<template>
  <nav class="sidebar bg-info">
    <div class="sidebar__home">
      <router-link
        class="nav-link navbar-home border rounded-circle text-info"
        to="/"
      >
        <i class="fas fa-coffee"></i>
      </router-link>
    </div>
    <template v-if="isAuthenticated">
      <div class="sidebar-menu mt-3">
        <router-link class="nav-link navbar-record" to="/records">
          <i class="fas fa-folder-plus"></i>
        </router-link>
        <router-link class="nav-link navbar-data" to="/charts">
          <i class="fas fa-database"></i>
        </router-link>
      </div>
      <div class="sidebar-end mt-auto">
        <router-link class="nav-link navbar-user" to="/user">
          <i class="far fa-user"></i>
        </router-link>
        <button
          type="button"
          class="btn btn-light logout text-info mt-2"
          @click="logout"
        >
          LOG <br />
          OUT
        </button>
      </div>
    </template>
  </nav>
</template>
<script>
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState(["currentUser", "isAuthenticated"]),
  },
  methods: {
    logout() {
      this.$store.commit("revokeAuthentication");
      this.$router.push("/signin");
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 80px;
  padding: 30px 0;
}
.sidebar,
.sidebar-menu,
.sidebar-end {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
}
.nav-link {
  color: white;
  font-size: 30px;
}
.navbar-home {
  padding: 8px 11px;
  background: white;
}
.nav-link:hover {
  font-size: 32px;
}
.logout {
  font-size: 14px;
  font-weight: 700;
  padding: 4px 10px;
}
</style>