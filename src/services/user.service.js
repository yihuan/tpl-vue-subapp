import { getRequest } from '../request/http'
import api from '../request/api'

export default {
  getCurrentUser() {
    return getRequest({
      url: api.currentUser
    })
  }
}