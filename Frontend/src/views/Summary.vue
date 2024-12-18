<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <div class="w-full max-w-4xl bg-white shadow-md rounded-lg p-6">
      <!-- Header -->
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Download Laporan Peminjaman
      </h1>

      <!-- Error Message -->
      <p v-if="errorMessage" class="text-red-500 text-center mb-4">
        {{ errorMessage }}
      </p>

      <!-- Filter Form -->
      <form @submit.prevent="downloadSummary" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-gray-700 mb-1"
              >Tanggal Awal Registrasi:</label
            >
            <input
              type="date"
              v-model="filters.startDate"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label class="block text-gray-700 mb-1"
              >Tanggal Akhir Registrasi:</label
            >
            <input
              type="date"
              v-model="filters.endDate"
              class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Nama Alat:</label>
          <input
            type="text"
            v-model="filters.name"
            placeholder="Masukkan nama alat"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-blue-500 text-white font-bold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Download PDF
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import api from "../services/api";

// State
const filters = ref({
  startDate: "",
  endDate: "",
  name: "",
});

const errorMessage = ref("");

// Fungsi untuk mengunduh PDF
const downloadSummary = async () => {
  try {
    // Reset error message
    errorMessage.value = "";

    // Membuat URL dengan query params berdasarkan filter
    const params = new URLSearchParams();
    if (filters.value.startDate)
      params.append("startDate", filters.value.startDate);
    if (filters.value.endDate) params.append("endDate", filters.value.endDate);
    if (filters.value.name) params.append("name", filters.value.name);

    // Request ke backend
    const response = await api.get(`/admin/summary?${params.toString()}`, {
      responseType: "blob", // Untuk file PDF
    });

    // Membuat file PDF untuk didownload
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "summary.pdf");
    document.body.appendChild(link);
    link.click();

    // Bersihkan URL Blob setelah digunakan
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Gagal mengunduh PDF:", error);

    // Menangani kesalahan respons dari backend
    if (error.response) {
      if (error.response.status === 404) {
        errorMessage.value = "Barang Tidak Ditemukan.";
      } else {
        errorMessage.value = "Gagal mengunduh PDF. Coba lagi nanti.";
      }
    }
  }
};
</script>

<style scoped>
/* Styling tambahan jika diperlukan */
</style>
