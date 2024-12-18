<template>
  <div id="app">
    <!-- Navbar -->
    <NavbarComponent />

    <!-- Router View untuk menampilkan halaman -->
    <router-view></router-view>
  </div>
</template>

<script setup>
import NavbarComponent from "./components/NavbarComponent.vue";
</script>
