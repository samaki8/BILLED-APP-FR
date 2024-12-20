//Billed-app-FR-Front\src\views\BillsUI.js
import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"
import Actions from './Actions.js'

const row = (bill) => {
  return (`
    <tr data-testid="bill-row">
      <td data-testid="bill-type">${bill.type}</td>
      <td data-testid="bill-name">${bill.name}</td>
      <td data-testid="bill-date">${bill.date}</td>
      <td data-testid="bill-amount">${bill.amount} €</td>
      <td data-testid="bill-status">${bill.status}</td>
      <td data-testid="bill-actions">
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
}

const rows = (data) => {
  return data && data.length ? data
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(bill => row(bill))
    .join("") : ""
}

export default ({ data: bills, loading, error }) => {
  const modal = () => (`
    <div class="modal fade" 
         id="modaleFile" 
         data-testid="modal-file" 
         tabindex="-1" 
         role="dialog" 
         aria-labelledby="modalTitle">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalTitle">Justificatif</h5>
            <button type="button" 
                    class="close" 
                    data-testid="modal-close" 
                    data-dismiss="modal" 
                    aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" data-testid="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <h1 class='content-title' data-testid="bills-title">Mes notes de frais</h1>
          <button type="button" 
                  data-testid='btn-new-bill' 
                  class="btn btn-primary">
            Nouvelle note de frais
          </button>
        </div>
        <div id="data-table" data-testid="bills-table-container">
          <table class="table table-striped" data-testid="bills-table">
            <thead>
              <tr>
                <th scope="col">Type</th>
                <th scope="col">Nom</th>
                <th scope="col">Date</th>
                <th scope="col">Montant</th>
                <th scope="col">Statut</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody data-testid="tbody">
              ${rows(bills)}
            </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`)
}
/*import VerticalLayout from './VerticalLayout.js'
import ErrorPage from "./ErrorPage.js"
import LoadingPage from "./LoadingPage.js"

import Actions from './Actions.js'



const row = (bill) => {
  return (`
    <tr>
      <td>${bill.type}</td>
      <td>${bill.name}</td>
      <td>${bill.date}</td>
      <td>${bill.amount} €</td>
      <td>${bill.status}</td>
      <td>
        ${Actions(bill.fileUrl)}
      </td>
    </tr>
    `)
}
// Tri des factures par date décroissante
const rows = (data) => {
  console.log('data:', data);
  //return (data && data.length) ? data.map(bill => row(bill)).join("") : ""
  return data && data.length ? data
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .map(bill => row(bill))
    .join("") : ""
}

export default ({ data: bills, loading, error }) => {

  const modal = () => (`
    <div class="modal fade" id="modaleFile" data-testid="modaleFile" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLongTitle">Justificatif</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
          </div>
        </div>
      </div>
    </div>
  `)

  if (loading) {
    return LoadingPage()
  } else if (error) {
    return ErrorPage(error)
  }

  return (`
    <div class='layout'>
      ${VerticalLayout(120)}
      <div class='content'>
        <div class='content-header'>
          <div class='content-title'> Mes notes de frais </div>
          <button type="button" data-testid='btn-new-bill' class="btn btn-primary">Nouvelle note de frais</button>
        </div>
        <div id="data-table">
        <table id="example" class="table table-striped" style="width:100%">
          <thead>
              <tr>
                <th>Type</th>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
          </thead>
          <tbody data-testid="tbody">
            ${rows(bills)}
          </tbody>
          </table>
        </div>
      </div>
      ${modal()}
    </div>`
  )
}*/