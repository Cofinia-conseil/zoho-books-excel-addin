/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global console, document, Excel, Office */
import store from "../store.js";

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    init();
    inita();
  }
});

import $ from "jquery";

document.addEventListener("DOMContentLoaded", () => {
  const organizationIdElement = document.getElementById("organization-id") as HTMLParagraphElement;
  const organizationId = store.getOrganizationId();
  if (organizationId) {
    organizationIdElement.textContent = organizationId;
  } else {
    organizationIdElement.textContent = "No Organization ID set";
  }
});
function inita() {
  const organizationId = store.getOrganizationId();
  const navbarContainer = document.getElementById("navbarContainer");
  if (organizationId) {
    navbarContainer.style.display = "block";
  } else {
    navbarContainer.style.display = "none";
  }
}

function init() {
  $("#importFromZoho").submit(async function (event) {
    console.log("eddddd");
    event.preventDefault();
    var organizationId = $("#organizationId").val();
    console.log("organizationId", organizationId);
    store.setOrganizationId(organizationId);
    await handleZohoRedirect(organizationId);
  });
}
function getTokenFromURL() {
  var params = new URLSearchParams(document.location.search);
  return params.get("token");
}

async function handleZohoRedirect(organizationId) {
  var token = getTokenFromURL();
  document.location.href = `taskpane.html?token=${encodeURIComponent(token)}&organizationId=${encodeURIComponent(
    organizationId
  )}`;
  Office.context.ui.displayDialogAsync("about:blank", { displayInIframe: true });
  console.log("resultresultresult", token);
}
