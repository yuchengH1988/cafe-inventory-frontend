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
        <router-link class="nav-link navbar-record" to="/">
          <i class="fas fa-folder-plus"></i>
        </router-link>
        <router-link class="nav-link navbar-data" to="/">
          <i class="fas fa-database"></i>
        </router-link>
      </div>
      <div class="sidebar-end mt-auto">
        <router-link class="nav-link navbar-user" to="/">
          <i class="far fa-user"></i>
        </router-link>
        <router-link class="nav-link navbar-logout" to="/">
          <button class="btn btn-light logout text-info">LOG OUT</button>
        </router-link>
      </div>
    </template>
  </nav>
</template>
<script>
// ./src/components/Navbar.vue
// seed data
const dummyUser = {
  currentUser: {
    id: 1,
    name: "管理者",
    email: "root@example.com",
    image: "https://i.pravatar.cc/300",
    isAdmin: true,
  },
  isAuthenticated: true,
};

export default {
  // Vue 會在沒有資料時使用此預設值
  data() {
    return {
      currentUser: {
        _id: -1,
        name: "",
        email: "",
        image: "",
        avatar: "",
        isAdmin: false,
      },
      isAuthenticated: false,
    };
  },
  created() {
    this.fetchUser();
  },
  methods: {
    fetchUser() {
      this.currentUser = {
        ...this.currentUser,
        ...dummyUser.currentUser,
      };
      this.isAuthenticated = dummyUser.isAuthenticated;
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
  font-size: 5px;
  font-weight: 700;
  padding: 4px;
}
</style>