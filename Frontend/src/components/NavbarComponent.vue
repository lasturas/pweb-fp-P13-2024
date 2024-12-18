<template>
  <nav class="bg-gray-800 text-white py-4 shadow-md">
    <div class="container mx-auto flex justify-between items-center px-4">
      <!-- Brand -->
      <div>
        <router-link
          to="/admin"
          class="text-2xl font-bold hover:text-gray-300 transition"
        >
          Dashboard Admin
        </router-link>
      </div>

      <!-- Menu -->
      <ul class="flex space-x-4">
        <li>
          <router-link
            to="/admin"
            class="hover:text-gray-300"
            active-class="font-semibold border-b-2 border-white"
          >
            Data Barang
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/all-operator"
            class="hover:text-gray-300"
            active-class="font-semibold border-b-2 border-white"
          >
            Data Petugas
          </router-link>
        </li>
        <li>
          <router-link
            to="/admin/summary"
            class="hover:text-gray-300"
            active-class="font-semibold border-b-2 border-white"
          >
            Download Laporan
          </router-link>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
// Tidak ada script tambahan diperlukan karena router-link menangani navigasi
</script>

<style scoped>
a {
  transition: all 0.2s ease;
}
</style>
