/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global console, document, Excel, Office */
import axios from "axios";
import store from "./store.js";

Office.onReady(async (info) => {
  if (info.host === Office.HostType.Excel) {
    //await init();
  }
});

//import $ from "jquery";

async function init() {
  var organization_id = store.getOrganizationId();

  const apiURL = `https://backend-excel-add-in-zoho-books.netlify.app/.netlify/functions/profile`;
  console.log("cccc", document.location);
  console.log("store.getToken()", store.getToken());
  var access_token = store.getToken();

  console.log("resultresultresult", access_token);
  await axios
    .get(apiURL, {
      headers: {
        "Content-Type": "application/json",
      },
      params: {
        token: access_token,
        organization_id: organization_id,
      },
    })
    .then((response) => {
      console.log(response.data);
      store.setuserData(response.data);
    });
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
  const usernameElement = document.getElementById("username") as HTMLParagraphElement;
  const userroleElement = document.getElementById("userrole") as HTMLParagraphElement;
  const useremailElement = document.getElementById("useremail") as HTMLParagraphElement;
  const userstatusElement = document.getElementById("userstatus") as HTMLParagraphElement;
  const userphotoElement = document.getElementById("userphoto") as HTMLImageElement;

  console.log("userDatauserDatauserData", store.getuserData().email);
  const username = store.getuserData().name;
  const userrole = store.getuserData().user_role;
  const useremail = store.getuserData().email;
  const userstatus = store.getuserData().status;
  const userphoto = store.getuserData().photo_url;

  if (username) {
    usernameElement.textContent = username;
  } else {
    usernameElement.textContent = "No usernameElement set";
  }
  if (userrole) {
    userroleElement.textContent = userrole;
  } else {
    userroleElement.textContent = "No userroleElement set";
  }
  if (useremail) {
    useremailElement.textContent = useremail;
  } else {
    useremailElement.textContent = "No useremailElement set";
  }
  if (userstatus) {
    userstatusElement.textContent = userstatus;
  } else {
    userstatusElement.textContent = "No userstatusElement set";
  }
  if (userphoto) {
    userphotoElement.src = userphoto;
  } else {
    userphotoElement.textContent = "No userphotoElement set";
  }
});
