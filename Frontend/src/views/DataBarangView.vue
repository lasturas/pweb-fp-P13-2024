<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <!-- Container -->
    <div class="max-w-6xl mx-auto bg-white p-6 shadow-lg rounded-lg">
      <h1 class="text-3xl font-bold text-gray-800 mb-6 text-center">
        Data Barang
      </h1>

      <!-- Button Tambah Data -->
      <div class="mb-4 text-right">
        <button
          @click="toggleForm"
          class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Tambah Data
        </button>
      </div>

      <!-- Form Tambah/Edit Data -->
      <div v-if="showForm" class="bg-gray-50 p-4 rounded-lg mb-6">
        <h2 class="text-lg font-bold mb-4">
          {{ isEditing ? "Edit Barang" : "Tambah Barang" }}
        </h2>
        <form @submit.prevent="saveBarang" class="space-y-4">
          <!-- Input Nama Barang -->
          <input
            v-model="formBarang.name"
            placeholder="Nama Barang"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <!-- Input Kondisi Barang -->
          <input
            v-model="formBarang.condition"
            placeholder="Kondisi"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <!-- Input Jumlah Barang -->
          <input
            v-model.number="formBarang.amount"
            type="number"
            placeholder="Jumlah"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <div class="text-right">
            <!-- Tombol Simpan -->
            <button
              type="submit"
              class="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
            >
              Simpan
            </button>
            <!-- Tombol Batal -->
            <button
              @click="resetForm"
              type="button"
              class="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>

      <!-- Tabel Data Barang -->
      <div class="overflow-x-auto">
        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="bg-blue-500 text-white">
              <th class="py-2 px-4">No</th>
              <th class="py-2 px-4">Nama Barang</th>
              <th class="py-2 px-4">Kondisi</th>
              <th class="py-2 px-4">Jumlah</th>
              <th class="py-2 px-4">Aksi</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(barang, index) in barangList"
              :key="barang._id"
              class="hover:bg-gray-50 transition"
            >
              <td class="border py-2 px-4 text-center">{{ index + 1 }}</td>
              <td class="border py-2 px-4">{{ barang.name }}</td>
              <td class="border py-2 px-4">{{ barang.condition }}</td>
              <td class="border py-2 px-4 text-center">{{ barang.amount }}</td>
              <td class="border py-2 px-4 text-center">
                <!-- Tombol Edit -->
                <button
                  @click="editBarang(barang)"
                  class="bg-yellow-400 text-white px-2 py-1 rounded-lg hover:bg-yellow-500"
                >
                  Edit
                </button>
                <!-- Tombol Hapus -->
                <button
                  @click="deleteBarang(barang._id)"
                  class="ml-2 bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600"
                >
                  Hapus
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import api from "../services/api";

// State untuk menampung data barang
const barangList = ref([]);
const showForm = ref(false);
const isEditing = ref(false);

// State untuk form barang
const formBarang = ref({
  id: null,
  name: "",
  condition: "",
  amount: 0,
});

// Fungsi untuk mengambil data barang dari API
const fetchBarang = async () => {
  try {
    const response = await api.get("/admin");
    barangList.value = response.data.data;
  } catch (error) {
    console.error("Gagal mengambil data barang:", error);
  }
};

// Fungsi untuk menampilkan form tambah/edit
const toggleForm = () => {
  resetForm();
  showForm.value = !showForm.value;
};

// Fungsi untuk menyimpan (Tambah/Edit) barang
const saveBarang = async () => {
  try {
    if (isEditing.value) {
      // Update Barang
      await api.put(`/admin/${formBarang.value.id}`, formBarang.value);
    } else {
      // Tambah Barang
      await api.post("/admin", formBarang.value);
    }
    fetchBarang();
    resetForm();
  } catch (error) {
    console.error("Gagal menyimpan data barang:", error);
  }
};

// Fungsi untuk menghapus barang
const deleteBarang = async (id) => {
  try {
    await api.delete(`/admin/${id}`);
    fetchBarang();
  } catch (error) {
    console.error("Gagal menghapus data barang:", error);
  }
};

// Fungsi untuk mengedit barang
const editBarang = (barang) => {
  formBarang.value = { ...barang };
  isEditing.value = true;
  showForm.value = true;
};

// Fungsi untuk mereset form
const resetForm = () => {
  formBarang.value = { id: null, name: "", condition: "", amount: 0 };
  showForm.value = false;
  isEditing.value = false;
};

// Ambil data saat komponen dimuat
onMounted(fetchBarang);
</script>

<style scoped>
th,
td {
  text-align: left;
  padding: 10px;
  border: 1px solid #ddd;
}
</style>
