/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global console, document, Excel, Office */
import axios from "axios";
import store from "../store.js";

Office.onReady(async (info) => {
  if (info.host === Office.HostType.Excel) {
    await init();
  }
});

import $ from "jquery";

function init() {
  $("#loginForm").submit(async function (event) {
    console.log("eddddd");
    event.preventDefault();
    // Code pour se connecter à Zoho Books

    var clientId = $("#clientId").val();
    await authenticate(clientId);
  });
}

function authenticate(clientId) {
  var redirectUri = "https://excel-add-in-zoho-books.netlify.app/callback.html";
  //var redirectUri = "https://localhost:3000/callback.html";
  var authorizationEndpoint = "https://accounts.zoho.com/oauth/v2/auth";
  var scope = "ZohoBooks.fullaccess.all";
  var authorizationUrl = `${authorizationEndpoint}?scope=${scope}&client_id=${clientId}&response_type=token&redirect_uri=${redirectUri}`;

  Office.context.ui.displayDialogAsync(authorizationUrl, { height: 50, width: 50 }, function (asyncResult) {
    var dialog = asyncResult.value;

    dialog.addEventHandler(Office.EventType.DialogMessageReceived, async function (arg) {
      var message = JSON.parse(arg.message);
      console.log("messsssssage", message);
      var organizationId;
      if (message.status === "success") {
        var token = message.accessToken;

        console.log("Access Token:", token);
        store.setToken(token);
        console.log("tokennnnnnnnnnnnnnnnnnnnnn", token);
        // Utilisez le jeton d'accès pour vos requêtes API
        //https://backend-excel-add-in-zoho-books.netlify.app
        //https://localhost:9000/
        await axios
          .get(
            "https://backend-excel-add-in-zoho-books.netlify.app/.netlify/functions/storetoken",

            {
              headers: {
                "Content-Type": "application/json",
              },
              params: {
                token: token,
              },
            }
          )
          .then((response) => {
            console.log("Token envoyé avec succès au backend", response.data.organization_id);
            organizationId = response.data.organization_id;
            console.log("organizationId", organizationId);
          })
          .catch((error) => {
            console.error("Erreur lors de l'envoi du token au backend:", error);
          });

        dialog.close();
        console.log("Dialog closed");
        document.location.href = `organization.html`;
        Office.context.ui.displayDialogAsync("about:blank", { displayInIframe: true });
        console.error("Authentication failed.");
      }
    });
  });
}
