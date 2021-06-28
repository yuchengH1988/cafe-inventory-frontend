import { apiHelper } from './../utils/helpers'

export default {
  ingredients: {
    update({ id, name, unit, unitName, unit2, unit2Name }) {
      return apiHelper.put(`/admin/ingredients/${id}`, { name, unit, unitName, unit2, unit2Name })
    },
    create({ name, unit, unitName, unit2, unit2Name }) {
      return apiHelper.post(`/admin/ingredients`, { name, unit, unitName, unit2, unit2Name })
    },
    delete({ id }) {
      return apiHelper.delete(`/admin/ingredients/${id}`)
    }
  },
  products: {
    update({ id, name, size, price }) {
      return apiHelper.put(`/admin/products/${id}`, { name, size, price })
    },
    create({ name, size, price }) {
      return apiHelper.post(`/admin/products`, { name, size, price })
    },
    delete({ id }) {
      return apiHelper.delete(`/admin/products/${id}`)
    }
  }

}