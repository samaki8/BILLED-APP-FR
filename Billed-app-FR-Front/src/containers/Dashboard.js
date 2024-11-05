//Billed-app-FR-Front\src\containers\Dashboard.js
/*

import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

// Ajout des types de documents supportés

const SUPPORTED_DOCUMENTS = ['jpeg', 'jpg', 'png', 'gif']

export function filteredBills(data, status) {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */
/*
else {
  // in prod environment
  const userEmail = JSON.parse(localStorage.getItem("user")).email
  selectCondition =
    (bill.status === status) &&
    ![...USERS_TEST, userEmail].includes(bill.email)
}

return selectCondition
}) : []
}

export const card = (bill) => {
const firstAndLastNames = bill.email.split('@')[0]
const firstName = firstAndLastNames.includes('.') ?
firstAndLastNames.split('.')[0] : ''
const lastName = firstAndLastNames.includes('.') ?
firstAndLastNames.split('.')[1] : firstAndLastNames

const getFileType = (fileName) => {
if (!fileName) return 'Format inconnu'
const extension = fileName.split('.').pop().toLowerCase()
return SUPPORTED_DOCUMENTS.includes(extension) ? 'IMAGE' : 'Format inconnu'
}

const fileInfo = bill.fileName && bill.fileName !== 'null'
? `Fichier : ${bill.fileName} (${getFileType(bill.fileName)})`
: 'Format inconnu';

const typeInfo = bill.type ? `Type : ${bill.type}` : '';

return (`
<div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
<div class='bill-card-name-container'>
  <div class='bill-card-name'> ${firstName} ${lastName} </div>
  <span class='bill-card-grey'> ... </span>
</div>
<div class='name-price-container'>
  <span> ${bill.name} </span>
  <span> ${bill.amount} € </span>
</div>
<div class='date-type-container'>
  <span> ${formatDate(bill.date)} </span>
  <span> ${fileInfo} ${typeInfo ? `| ${typeInfo}` : ''} </span>
</div>
</div>
`)
}

export const cards = (bills) => {
return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

export const getStatus = (index) => {
switch (index) {
case 1:
return "pending"
case 2:
return "accepted"
case 3:
return "refused"
}
}

export default class {
constructor({ document, onNavigate, store, bills, localStorage }) {
this.document = document
this.onNavigate = onNavigate
this.store = store
this.bills = bills
$('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
$('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
$('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
new Logout({ localStorage, onNavigate })
}

handleShowTickets = (e, bills, index) => {
if (this.counter === undefined || this.index !== index) this.counter = 0
if (this.index === undefined || this.index !== index) this.index = index
if (this.counter % 2 === 0) {
$(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)' })
$(`#status-bills-container${this.index}`)
  .html(cards(filteredBills(bills, getStatus(this.index))))
this.counter++
} else {
$(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)' })
$(`#status-bills-container${this.index}`)
  .html("")
this.counter++
}

bills.forEach(bill => {
$(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
})

return bills
}

handleEditTicket = (e, bill, bills) => {
if (this.counter === undefined || this.id !== bill.id) this.counter = 0
if (this.id === undefined || this.id !== bill.id) this.id = bill.id
if (this.counter % 2 === 0) {
bills.forEach(b => {
  $(`#open-bill${b.id}`).css({ background: '#0D5AE5' })
})
$(`#open-bill${bill.id}`).css({ background: '#2A2B35' })
$('.dashboard-right-container div').html(DashboardFormUI(bill))
$('.vertical-navbar').css({ height: '150vh' })
this.counter++
} else {
$(`#open-bill${bill.id}`).css({ background: '#0D5AE5' })
$('.dashboard-right-container div').html(`
  <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
`)
$('.vertical-navbar').css({ height: '120vh' })
this.counter++
}
$('#icon-eye-d').click(this.handleClickIconEye)
$('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
$('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
}

handleClickIconEye = () => {
const billUrl = $('#icon-eye-d').attr("data-bill-url")
const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
$('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
}

handleAcceptSubmit = (e, bill) => {
const newBill = {
...bill,
status: 'accepted',
commentAdmin: $('#commentary2').val()
}
this.updateBill(newBill)
this.onNavigate(ROUTES_PATH['Dashboard'])
}

handleRefuseSubmit = (e, bill) => {
const newBill = {
...bill,
status: 'refused',
commentAdmin: $('#commentary2').val()
}
this.updateBill(newBill)
this.onNavigate(ROUTES_PATH['Dashboard'])
}
*/
/*
  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => {
              let fileDisplay;
              let fileType;
 
              if (doc.fileName) {
                fileDisplay = doc.fileName;
                fileType = doc.fileName.split('.').pop().toLowerCase();
              } else if (doc.name) {
                fileType = (doc.type && SUPPORTED_DOCUMENTS.includes(doc.type.toLowerCase()))
                  ? doc.type.toLowerCase()
                  : 'pdf';
                fileDisplay = `${doc.name}.${fileType}`;
              } else {
                fileDisplay = 'document-sans-nom.pdf';
                fileType = 'pdf';
              }
 
              if (!SUPPORTED_DOCUMENTS.includes(fileType)) {
                fileType = 'pdf';
              }
 
              return {
                id: doc.id,
                ...doc,
                date: doc.date,
                status: doc.status,
                fileName: fileDisplay,
                type: doc.type || fileType.toUpperCase(),
                fileUrl: doc.fileUrl || fileDisplay
              }
            });
          return bills;
        })
        .catch(error => {
          throw error;
        });
    }
  }
*/
/*
 getBillsAllUsers = () => {
   if (this.store) {
     return this.store
       .bills()
       .list()
       .then(snapshot => {
         const bills = snapshot
           .map(doc => {
             let fileDisplay;
             let fileType;

             if (doc.fileName) {
               fileDisplay = doc.fileName;
               fileType = doc.fileName.split('.').pop().toLowerCase();
             } else if (doc.name) {
               // Vérifier si le type est supporté
               fileType = (doc.type && SUPPORTED_DOCUMENTS.includes(doc.type.toLowerCase()))
                 ? doc.type.toLowerCase()
                 : 'jpg';
               fileDisplay = `${doc.name}.${fileType}`;
             } else {
               fileDisplay = 'fichier introuvable';
               fileType = 'jpg';
             }

             // Vérification pour les undefined
             if (!fileDisplay || fileDisplay === 'undefined') {
               fileDisplay = 'fichier introuvable';
             }
             if (!fileType || fileType === 'undefined') {
               fileType = 'jpg';
             }

             // Vérification du type supporté
             if (!SUPPORTED_DOCUMENTS.includes(fileType)) {
               fileType = 'jpg';
             }

             return {
               id: doc.id,
               ...doc,
               date: doc.date,
               status: doc.status,
               fileName: fileDisplay,
               type: 'IMAGE',
               fileUrl: doc.fileUrl || fileDisplay
             }
           });
         return bills;
       })
       .catch(error => {
         throw error;
       });
   }
 }
 updateBill = (bill) => {
   if (this.store) {
     return this.store
       .bills()
       .update({ data: JSON.stringify(bill), selector: bill.id })
       .then(bill => bill)
       .catch(console.log)
   }
 }
}
*/
//Billed-app-FR-Front\src\containers\Dashboard.js
import { formatDate } from '../app/format.js'
import DashboardFormUI from '../views/DashboardFormUI.js'
import BigBilledIcon from '../assets/svg/big_billed.js'
import { ROUTES_PATH } from '../constants/routes.js'
import USERS_TEST from '../constants/usersTest.js'
import Logout from "./Logout.js"

export const filteredBills = (data, status) => {
  return (data && data.length) ?
    data.filter(bill => {
      let selectCondition

      // in jest environment
      if (typeof jest !== 'undefined') {
        selectCondition = (bill.status === status)
      }
      /* istanbul ignore next */

      else {
        // in prod environment
        const userEmail = JSON.parse(localStorage.getItem("user")).email
        selectCondition =
          (bill.status === status) &&
          ![...USERS_TEST, userEmail].includes(bill.email)
      }

      return selectCondition
    }) : []
}

export const card = (bill) => {
  const firstAndLastNames = bill.email.split('@')[0]
  const firstName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[0] : ''
  const lastName = firstAndLastNames.includes('.') ?
    firstAndLastNames.split('.')[1] : firstAndLastNames


  return (`
<div class='bill-card' id='open-bill${bill.id}' data-testid='open-bill${bill.id}'>
<div class='bill-card-name-container'>
  <div class='bill-card-name'> ${firstName} ${lastName} </div>
  <span class='bill-card-grey'> ... </span>
</div>
<div class='name-price-container'>
  <span> ${bill.name} </span>
  <span> ${bill.amount} € </span>
</div>
<div class='date-type-container'>
  <span> ${formatDate(bill.date)} </span>
  <span> ${bill.type} </span>
</div>
</div>
`)
}

export const cards = (bills) => {
  return bills && bills.length ? bills.map(bill => card(bill)).join("") : ""
}

export const getStatus = (index) => {
  switch (index) {
    case 1:
      return "pending"
    case 2:
      return "accepted"
    case 3:
      return "refused"
  }
}

export default class {
  constructor({ document, onNavigate, store, bills, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    $('#arrow-icon1').click((e) => this.handleShowTickets(e, bills, 1))
    $('#arrow-icon2').click((e) => this.handleShowTickets(e, bills, 2))
    $('#arrow-icon3').click((e) => this.handleShowTickets(e, bills, 3))
    new Logout({ localStorage, onNavigate })
  }

  /*
  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)
    $('#modaleFileAdmin1').find(".modal-body").html(`<div style='text-align: center;'><img width=${imgWidth} src=${billUrl} alt="Bill"/></div>`)
    if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
  }
*/
  handleClickIconEye = () => {
    const billUrl = $('#icon-eye-d').attr("data-bill-url")
    const imgWidth = Math.floor($('#modaleFileAdmin1').width() * 0.8)

    // Créer une image test pour vérifier si l'URL est valide
    const testImage = new Image()
    testImage.onerror = () => {
      $('#modaleFileAdmin1').find(".modal-body").html(`
      <div style='text-align: center; color: red; padding: 20px;'>
        Le fichier est corrompu
      </div>
    `)
      if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
    }
    testImage.onload = () => {
      $('#modaleFileAdmin1').find(".modal-body").html(`
      <div style='text-align: center;'>
        <img width=${imgWidth} src=${billUrl} alt="Bill"/>
      </div>
    `)
      if (typeof $('#modaleFileAdmin1').modal === 'function') $('#modaleFileAdmin1').modal('show')
    }
    testImage.src = billUrl
  }
  handleEditTicket(e, bill, bills) {
    if (this.counter === undefined || this.id !== bill.id) this.counter = 0
    if (this.id === undefined || this.id !== bill.id) this.id = bill.id
    if (this.counter % 2 === 0) {
      bills.forEach(b => {
        $(`#open-bill${b.id}`).css({ background: '#0D5AE5' })
      })
      $(`#open-bill${bill.id}`).css({ background: '#2A2B35' })
      $('.dashboard-right-container div').html(DashboardFormUI(bill))
      $('.vertical-navbar').css({ height: '150vh' })
      this.counter++
    } else {
      $(`#open-bill${bill.id}`).css({ background: '#0D5AE5' })

      $('.dashboard-right-container div').html(`
  <div id="big-billed-icon" data-testid="big-billed-icon"> ${BigBilledIcon} </div>
`)
      $('.vertical-navbar').css({ height: '120vh' })
      this.counter++
    }
    $('#icon-eye-d').click(this.handleClickIconEye)
    $('#btn-accept-bill').click((e) => this.handleAcceptSubmit(e, bill))
    $('#btn-refuse-bill').click((e) => this.handleRefuseSubmit(e, bill))
  }

  handleAcceptSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'accepted',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }

  handleRefuseSubmit = (e, bill) => {
    const newBill = {
      ...bill,
      status: 'refused',
      commentAdmin: $('#commentary2').val()
    }
    this.updateBill(newBill)
    this.onNavigate(ROUTES_PATH['Dashboard'])
  }
  /*
    handleShowTickets(e, bills, index) {
      if (this.counter === undefined || this.index !== index) this.counter = 0
      if (this.index === undefined || this.index !== index) this.index = index
      if (this.counter % 2 === 0) {
        $(`#arrow-icon${this.index}`).css({ transform: 'rotate(0deg)' })
        $(`#status-bills-container${this.index}`)
          .html(cards(filteredBills(bills, getStatus(this.index))))
        this.counter++
      } else {
        $(`#arrow-icon${this.index}`).css({ transform: 'rotate(90deg)' })
        $(`#status-bills-container${this.index}`)
          .html("")
        this.counter++
      }
  
      bills.forEach(bill => {
        $(`#open-bill${bill.id}`).click((e) => this.handleEditTicket(e, bill, bills))
      })
  
      return bills
  
    }
      */
  handleShowTickets(e, bills, index) {
    // Utiliser un counter séparé pour chaque index
    this.counters = this.counters || {};
    this.counters[index] = this.counters[index] || 0;

    if (this.index !== index) {
      this.index = index;
    }

    if (this.counters[index] % 2 === 0) {
      $(`#arrow-icon${index}`).css({ transform: 'rotate(0deg)' });
      $(`#status-bills-container${index}`)
        .html(cards(filteredBills(bills, getStatus(index))));
    } else {
      $(`#arrow-icon${index}`).css({ transform: 'rotate(90deg)' });
      $(`#status-bills-container${index}`).html("");
    }

    // Retirer les anciens événements avant d'en ajouter de nouveaux
    bills.forEach(bill => {
      $(`#open-bill${bill.id}`).off('click')
        .click((e) => this.handleEditTicket(e, bill, bills));
    });

    this.counters[index]++;
    return bills;
  }

  getBillsAllUsers = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          const bills = snapshot
            .map(doc => ({
              id: doc.id,
              ...doc,
              date: doc.date,
              status: doc.status
            }))
          return bills
        })
        .catch(error => {
          throw error;
        })
    }
  }

  // not need to cover this function by tests
  /* istanbul ignore next */

  updateBill = (bill) => {
    if (this.store) {
      return this.store
        .bills()
        .update({ data: JSON.stringify(bill), selector: bill.id })
        .then(bill => bill)
        .catch(console.log)
    }
  }
}
