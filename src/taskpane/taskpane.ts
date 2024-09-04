/*
 * Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
 * See LICENSE in the project root for license information.
 */

import axios from "axios";
import store from "../store.js";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/* global console, document, Excel, Office */

Office.onReady((info) => {
  if (info.host === Office.HostType.Excel) {
    init();
  }
});
var donneesExemple;
import $ from "jquery";

function init() {
  $("#importFromZoho").submit(async function (event) {
    console.log("eddddd");
    event.preventDefault();
    var datePickerFrom = $("#datePickerFrom").val();
    var datePickerTo = $("#datePickerTo").val();
    console.log("datePickerFrom", datePickerFrom);
    console.log("datePickerTo", $("#datePickerTo").val());

    await handleZohoRedirect(datePickerFrom, datePickerTo);

    await insererDonneesDansNouvelleFeuille(donneesExemple);
  });
}

async function handleZohoRedirect(datePickerFrom, datePickerTo) {
  var organization_id = store.getOrganizationId();

  const apiURL = `https://backend-excel-add-in-zoho-books.netlify.app/.netlify/functions/trialbalance?from_date=${encodeURIComponent(
    datePickerFrom
  )}&to_date=${encodeURIComponent(datePickerTo)}&organization_id=${organization_id}`;
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
      },
    })
    .then((response) => {
      console.log(response.data);
      donneesExemple = response.data;
    });
}

function insererDonneesDansNouvelleFeuille(donnees) {
  Excel.run(async (context) => {
    const sheetName = "zohoData";
    let feuille = context.workbook.worksheets.getItemOrNullObject(sheetName);

    await context.sync();

    if (feuille.isNullObject) {
      feuille = context.workbook.worksheets.add();
      feuille.name = sheetName;
    }

    const accounts = donnees.trialbalance.accounts;

    const headers = ["ACCOUNT", "ACCOUNT CODE", "NET DEBIT", "NET CREDIT"];
    const zohoData = [];

    for (let i = 0; i < accounts.length; i++) {
      const account = accounts[i];
      const accountsSubs1 = account.accounts;

      zohoData.push([
        account.name,
        account.account_code,
        account.net_debit_formatted,
        account.net_credit_sub_account_formatted,
      ]);
      if (accountsSubs1 && accountsSubs1.length > 0)
        for (let j = 0; j < accountsSubs1.length; j++) {
          const accountsSub1 = accountsSubs1[j];
          const accountsSubs2 = accountsSub1.accounts;

          zohoData.push([
            "    " + accountsSub1.name,
            accountsSub1.account_code,
            accountsSub1.values[0].net_debit_formatted,
            accountsSub1.values[0].net_credit_sub_account_formatted,
          ]);
          if (accountsSubs2 && accountsSubs2.length > 0)
            for (let k = 0; k < accountsSubs2.length; k++) {
              const accountsSub2 = accountsSubs2[k];

              zohoData.push([
                "         " + accountsSub2.name,
                accountsSub2.account_code,
                accountsSub2.values[0].net_debit_formatted,
                accountsSub2.values[0].net_credit_sub_account_formatted,
              ]);
            }
          if (accountsSub1.total_label)
            zohoData.push([
              accountsSub1.total_label,
              accountsSub1.account_code,
              accountsSub1.values[0].net_debit_sub_account_formatted,
              accountsSub1.values[0].net_credit_sub_account_formatted,
            ]);
        }
    }
    zohoData.push([
      donnees.trialbalance.total_label,
      donnees.trialbalance.account_code,
      donnees.trialbalance.values[0].net_debit_sub_account_formatted,
      donnees.trialbalance.values[0].net_credit_sub_account_formatted,
    ]);

    zohoData.unshift(headers);

    const startCell = "A1";
    const endCell = `${String.fromCharCode(65 + headers.length - 1)}${zohoData.length}`;
    const range = feuille.getRange(`${startCell}:${endCell}`);

    range.values = zohoData;

    range.format.autofitColumns();

    const lastRow = zohoData.length;
    const lastRowRange = feuille.getRange(`A${lastRow}:${String.fromCharCode(65 + headers.length - 1)}${lastRow}`);

    lastRowRange.format.font.bold = true;
    lastRowRange.format.font.size = 12;

    $("#datePickerFrom").val("");
    $("#datePickerTo").val("");
    await context.sync();
  }).catch(function (erreur) {
    console.log(erreur);
  });
}
