<template>
  <div class="container py-5">
    <h2>物料稽核</h2>
    <Spinner v-if="isLoading" />
    <template v-else>
      <div class="search-bar input-group rounded w-50 mt-3">
        <input
          v-model="dateSearch"
          @keyup.enter="recordSearch"
          name="dateSearch"
          type="text"
          class="form-control rounded"
          placeholder="Entering date : YYYYMMDD"
          aria-label="record-date-search"
          aria-describedby="record-date-search"
        />
        <span
          class="input-group-text bg-white border-0 text-info"
          id="search-addon"
        >
          <i class="fas fa-search"></i>
        </span>
      </div>
      <div class="record-main mt-4 d-flex border border-info rounded">
        <div class="record-ingredients w-50 p-3">
          <form @submit.stop.prevent="handleForm">
            <table class="table form-group">
              <thead>
                <tr class="table-info">
                  <th scope="col">Name</th>
                  <th scope="col">Size</th>
                  <th class="text-center w-50" scope="col">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product._id">
                  <th scope="row">
                    {{ product.name }}
                  </th>
                  <td>{{ product.size }}</td>
                  <td>
                    <input
                      type="number"
                      v-model="product.value"
                      class="form-control"
                      :name="product.name"
                      :id="product.name"
                      aria-label="value"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="submit"
              :disabled="isProcessing"
              class="btn btn-info btn-sm"
            >
              {{ isProcessing ? "處理中..." : "Calculate" }}
            </button>
          </form>
        </div>
        <div class="results w-50">
          <div class="results-actualValue h-75 p-3">
            <table class="table form-group">
              <thead>
                <tr class="table-info">
                  <th scope="col" style="width: 25%">物料名稱</th>
                  <th scope="col" style="width: 25%">實際使用量</th>
                  <th scope="col" style="width: 25%">估計使用量</th>
                  <th scope="col" cstyle="width:25%;">誤差量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="ingredient in ingredients" :key="ingredient._id">
                  <th scope="row">
                    {{ ingredient.name }}({{ ingredient.unitName }})
                  </th>
                  <td class="d-flex">
                    <input
                      type="number"
                      class="form-control"
                      name="actualUsed"
                      aria-label="Actual Value"
                      v-model="ingredient.actualValue"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control"
                      name="estimateUsed"
                      aria-label="Estimate"
                      disabled
                      v-model="ingredient.estimateValue"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      class="form-control"
                      name="errorValue"
                      aria-label="errorValue"
                      disabled
                      :value="
                        ingredient.estimateValue && ingredient.actualValue
                          ? ingredient.actualValue - ingredient.estimateValue
                          : ''
                      "
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <p>
              日期設定：{{ dateId | timeFormate }}
              {{ dateChecker ? "紀錄已經存在" : "" }}
            </p>

            <button
              v-if="!dateChecker"
              @click="createRecord"
              :disabled="isProcessing"
              class="btn btn-info"
            >
              {{ isProcessing ? "處理中..." : "新增資料" }}
            </button>
            <button
              v-else
              @click="deleteRecord"
              :disabled="isProcessing"
              class="btn btn-danger ml-2"
            >
              {{ isProcessing ? "處理中..." : "刪除資料" }}
            </button>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>
<script>
import recordsAPI from "./../apis/records";
import { Toast } from "./../utils/helpers";
import { mapState } from "vuex";
import moment from "moment";
import Spinner from "./../components/Spinner";
export default {
  name: "Records",
  components: {
    Spinner,
  },
  data() {
    return {
      records: [],
      dateId: "",
      dateSearch: "",
      dateChecker: false,
      products: [],
      ingredients: [],
      isProcessing: false,
      isLoading: true,
    };
  },
  computed: {
    ...mapState(["currentUser"]),
  },
  methods: {
    async fetchData() {
      try {
        const productsRes = await recordsAPI.getProducts();
        this.products = productsRes.data.products;
        const ingredientsRes = await recordsAPI.getIngredients();
        this.ingredients = ingredientsRes.data.ingredients;
        this.dateId = moment().format("YYYYMMDD");
        this.getRecordsByDate();
        this.isLoading = false;
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得表單資料，請稍後再試",
        });
      }
    },
    async getRecordsByDate() {
      try {
        const { data } = await recordsAPI.getRecordsByDate({
          dateId: this.dateId,
        });
        if (data.records.length) {
          this.records = data.records;
          this.records.forEach((record) => {
            this.ingredients.forEach((ingredient) => {
              if (record.ingredientId === ingredient._id) {
                ingredient.actualValue = record.actualUsed;
                ingredient.estimateValue = record.estimateUsed;
              }
            });
          });
          Toast.fire({
            icon: "info",
            title: `dateId ${this.dateId} 已載入資料 `,
          });
          this.dateChecker = true;
        } else {
          this.resetForm();
          this.dateChecker = false;
        }
      } catch (error) {
        this.isLoading = false;
        Toast.fire({
          icon: "info",
          title: `dateId ${this.dateId} 尚無資料 `,
        });
      }
    },
    async handleForm(e) {
      try {
        this.isProcessing = true;
        const form = e.target;
        const formData = new FormData(form);
        const response = await recordsAPI.recordCalculator({ formData });
        this.ingredients = response.data.results;
        this.isProcessing = false;
      } catch (error) {
        this.isProcessing = false;
        // this.isLoading = false;
        Toast.fire({
          icon: "error",
          title: "無法取得運算結果，請稍後再試",
        });
      }
    },
    async createRecord() {
      try {
        this.isProcessing = true;
        const dateId = this.dateId;
        let status = 0;

        for (let ingredient of this.ingredients) {
          if (ingredient.estimateValue || ingredient.actualValue) {
            let response = await recordsAPI.createRecord({
              actualUsed: ingredient.actualValue,
              estimateUsed: ingredient.estimateValue,
              ingredientId: ingredient._id,
              dateId,
            });
            if (response.statusText === "OK") {
              status++;
            }
          }
        }
        if (status !== 0) {
          Toast.fire({
            icon: "success",
            title: `在${dateId}成功新增${status}筆物料紀錄`,
          });
        } else {
          throw new Error();
        }
        this.dateChecker = true;
        this.isProcessing = false;
      } catch (e) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法新增新紀錄，請稍後再試",
        });
      }
    },
    async deleteRecord() {
      try {
        const response = await recordsAPI.deleteRecord({ dateId: this.dateId });
        if (response.statusText === "OK") {
          this.resetForm();
          Toast.fire({
            icon: "success",
            title: "紀錄已經刪除",
          });
          this.dateChecker = false;
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        this.isProcessing = false;
        Toast.fire({
          icon: "error",
          title: "無法刪除紀錄，請稍後再試",
        });
      }
    },
    recordSearch() {
      this.dateId = this.dateSearch;
      this.getRecordsByDate();
    },
    resetForm() {
      this.ingredients.forEach((ingredient) => {
        ingredient.actualValue = "";
        ingredient.estimateValue = "";
      });
      this.products.forEach((product) => {
        product.value = "";
      });
    },
  },
  created() {
    this.fetchData();
  },
  filters: {
    timeFormate(timeId) {
      let n =
        timeId.substring(0, 4) +
        " /" +
        timeId.substring(4, 6) +
        " /" +
        timeId.substring(6, 8);
      return n;
    },
  },
};
</script>

<style scoped>
.container {
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
}
input {
  border-color: rgb(23, 162, 184);
}
input:hover {
  border-color: rgb(8, 112, 128);
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
input[type="number"] {
  -moz-appearance: textfield;
}
.record-main {
  position: relative;
  flex-grow: 1;
  overflow-y: scroll;
}
.record-main::after {
  border-left: 1px solid rgb(23, 162, 184);
  content: "";
  position: absolute;
  right: 50%;
  top: 50%;
  height: 95%;
  width: 0;
  transform: translateY(-50%);
}
th,
td {
  vertical-align: middle;
}
</style>