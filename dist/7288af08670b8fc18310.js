let userData;try{userData=JSON.parse(localStorage.getItem("userData"))||{}}catch(t){userData={}}const store={token:localStorage.getItem("token")||null,organizationId:localStorage.getItem("organizationId")||null,userData:userData,setToken(t){this.token=t,localStorage.setItem("token",t)},getToken(){return this.token},clearToken(){this.token=null,localStorage.removeItem("token")},setOrganizationId(t){this.organizationId=t,localStorage.setItem("organizationId",t)},getOrganizationId(){return this.organizationId},clearOrganizationId(){this.organizationId=null,localStorage.removeItem("organizationId")},setuserData(t){this.userData=t,localStorage.setItem("userData",t)},getuserData(){return this.userData},clearuserData(){this.userData=null,localStorage.removeItem("userData")}};export default store;