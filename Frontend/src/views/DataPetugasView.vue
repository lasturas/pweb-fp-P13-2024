<template>
  <div class="container mx-auto px-4 py-6">
    <!-- Judul -->
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Data Petugas</h1>

    <!-- Tombol Tambah Petugas -->
    <button
      @click="showForm('add')"
      class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
    >
      Tambah Petugas
    </button>

    <!-- Loading State -->
    <div v-if="loading" class="text-center my-4 text-blue-500">
      Loading data...
    </div>

    <!-- Form Tambah/Edit Petugas -->
    <div v-if="showFormModal" class="bg-gray-100 p-4 mt-4 rounded shadow-md">
      <h3 class="text-lg font-semibold mb-4">
        {{ isEditing ? "Edit Petugas" : "Tambah Petugas" }}
      </h3>
      <form @submit.prevent="submitForm">
        <!-- Input Username -->
        <input
          v-model="form.username"
          type="text"
          placeholder="Username"
          class="w-full p-2 mb-2 border rounded"
          required
        />
        <!-- Input Password (hanya saat tambah petugas) -->
        <input
          v-if="!isEditing"
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full p-2 mb-2 border rounded"
          required
        />
        <!-- Tombol Simpan dan Batal -->
        <div class="flex gap-2">
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Simpan
          </button>
          <button
            type="button"
            @click="resetForm"
            class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
          >
            Batal
          </button>
        </div>
      </form>
    </div>

    <!-- Tabel Data Petugas -->
    <table class="w-full mt-6 border-collapse">
      <thead>
        <tr class="bg-gray-800 text-white">
          <th class="p-3 border">No</th>
          <th class="p-3 border">Username</th>
          <th class="p-3 border">Aksi</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(petugas, index) in petugasList"
          :key="petugas._id"
          class="hover:bg-gray-100"
        >
          <td class="p-3 border text-center">{{ index + 1 }}</td>
          <td class="p-3 border">{{ petugas.username }}</td>
          <td class="p-3 border text-center">
            <button
              @click="showForm('edit', petugas)"
              class="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 mr-2"
            >
              Edit
            </button>
            <button
              @click="deletePetugas(petugas._id)"
              class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Hapus
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Pesan Jika Data Kosong -->
    <p v-if="!loading && petugasList.length === 0" class="text-center mt-4">
      Tidak ada data petugas.
    </p>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

// State untuk data petugas
const petugasList = ref([]);
const showFormModal = ref(false);
const isEditing = ref(false);
const loading = ref(false);
const form = ref({
  id: null,
  username: "",
  password: "",
});

// Fungsi menampilkan form tambah/edit
const showForm = (mode, petugas = null) => {
  showFormModal.value = true; // Tampilkan modal
  isEditing.value = mode === "edit"; // Tentukan apakah sedang mode edit atau tambah

  if (isEditing.value && petugas) {
    // Mode Edit: Isi form dengan data petugas yang dipilih
    form.value = {
      id: petugas._id,
      username: petugas.username,
      password: "", // Kosongkan password untuk keamanan
    };
  } else {
    // Mode Tambah: Reset form
    form.value = {
      id: null,
      username: "",
      password: "",
    };
  }
};

// Fungsi reset form
const resetForm = () => {
  form.value = { id: null, username: "", password: "" };
  showFormModal.value = false;
};

// Fungsi mengambil data petugas dari API
const fetchPetugas = async () => {
  try {
    loading.value = true;
    const response = await api.get("/admin/all-operator");
    petugasList.value = response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data petugas:", error);
  } finally {
    loading.value = false;
  }
};

// Fungsi tambah/edit petugas
const submitForm = async () => {
  try {
    if (isEditing.value) {
      // Edit Petugas
      await api.put(`/admin/operator/${form.value.id}`, {
        username: form.value.username,
      });
    } else {
      // Tambah Petugas
      await api.post("/admin/register", {
        username: form.value.username,
        password: form.value.password,
      });
    }
    fetchPetugas();
    resetForm();
  } catch (error) {
    console.error(
      "Gagal menyimpan data petugas:",
      error.response?.data || error.message
    );
  }
};

// Fungsi hapus petugas
const deletePetugas = async (id) => {
  try {
    await api.delete(`/admin/operator/${id}`);
    fetchPetugas();
  } catch (error) {
    console.error(
      "Gagal menghapus petugas:",
      error.response?.data || error.message
    );
  }
};

// Ambil data petugas saat komponen dimuat
onMounted(fetchPetugas);
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: auto;
  color: #333;
}
table {
  border: 1px solid #ddd;
  border-collapse: collapse;
}
th,
td {
  padding: 8px;
  border: 1px solid #ddd;
}
</style>
