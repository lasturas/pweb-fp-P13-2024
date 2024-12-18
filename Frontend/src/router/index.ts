import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

import DataBarangView from "../views/DataBarangView.vue";
import DataPetugasView from "../views/DataPetugasView.vue";
import Summary from "../views/summary.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/admin",
    name: "DataBarang",
    component: DataBarangView,
  },
  {
    path: "/admin/all-operator",
    name: "DataPetugas",
    component: DataPetugasView,
  },
  {
    path: "/admin/summary",
    name: "Summary",
    component: Summary,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
