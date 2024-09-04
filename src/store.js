/* eslint-disable no-undef */
let userData;
try {
  userData = JSON.parse(localStorage.getItem("userData")) || {};
} catch (e) {
  userData = {};
}
const store = {
  token: localStorage.getItem("token") || null,
  organizationId: localStorage.getItem("organizationId") || null,
  userData,
  setToken(newToken) {
    this.token = newToken;
    localStorage.setItem("token", newToken);
  },

  getToken() {
    return this.token;
  },

  clearToken() {
    this.token = null;
    localStorage.removeItem("token");
  },
  setOrganizationId(newOrganizationId) {
    this.organizationId = newOrganizationId;
    localStorage.setItem("organizationId", newOrganizationId);
  },

  getOrganizationId() {
    return this.organizationId;
  },

  clearOrganizationId() {
    this.organizationId = null;
    localStorage.removeItem("organizationId");
  },

  setuserData(newuserData) {
    this.userData = newuserData;
    localStorage.setItem("userData", newuserData);
  },

  getuserData() {
    return this.userData;
  },

  clearuserData() {
    this.userData = null;
    localStorage.removeItem("userData");
  },
};

export default store;
