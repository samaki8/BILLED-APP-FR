
//Billed-app-FR-Front\src\containers\Bills.js
import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class Bills {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document
    this.onNavigate = onNavigate
    this.store = store
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
    if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
    if (iconEye) iconEye.forEach(icon => {
      icon.addEventListener('click', () => this.handleClickIconEye(icon))
    })
    new Logout({ document, localStorage, onNavigate })
  }



  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH['NewBill'])
  }
  /*
 handleClickIconEye = (icon) => {
   const billUrl = icon.getAttribute("data-bill-url")
   const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
   $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
   $('#modaleFile').modal('show')
 }
*/
  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const imgWidth = Math.floor($('#modaleFile').width() * 0.5);
    const img = new Image();
    img.src = billUrl;
    img.onload = () => {
      $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`);
    };
    img.onerror = () => {
      $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container">Le fichier est corrompu</div>`);
    };
    $('#modaleFile').modal('show');
  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then(snapshot => {
          console.log('Bills bruts depuis l\'API:', snapshot)
          const bills = snapshot
            .map(doc => {
              try {
                return {
                  ...doc,
                  date: formatDate(doc.date),
                  status: formatStatus(doc.status),
                  // Modifier l'affichage du format quand il est null
                  fileName: doc.fileName || 'Fichier introuvable'

                }
              } catch (e) {
                console.log(e, 'for', doc)
                return {
                  ...doc,
                  date: doc.date,
                  status: formatStatus(doc.status)
                }
              }
            })

          console.log('Bills avant le tri :', bills)

          // Tri des factures du plus récent au plus ancien
          const sortedBills = bills.sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
            if (dateA > dateB) return -1
            if (dateA < dateB) return 1
            return 0
          })

          console.log('Bills après le tri :', sortedBills)
          console.log('length', sortedBills.length)
          return sortedBills
        })
    }
  }
}
/*
 
import { ROUTES_PATH } from '../constants/routes.js'
import { formatDate, formatStatus } from "../app/format.js"
import Logout from "./Logout.js"

export default class {
 constructor({ document, onNavigate, store, localStorage }) {
   this.document = document
   this.onNavigate = onNavigate
   this.store = store
   const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
   if (buttonNewBill) buttonNewBill.addEventListener('click', this.handleClickNewBill)
   const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`)
   if (iconEye) iconEye.forEach(icon => {
     icon.addEventListener('click', () => this.handleClickIconEye(icon))
   })
   new Logout({ document, localStorage, onNavigate })
 }

 handleClickNewBill = () => {
   this.onNavigate(ROUTES_PATH['NewBill'])
 }

 handleClickIconEye = (icon) => {
   const billUrl = icon.getAttribute("data-bill-url")
   const imgWidth = Math.floor($('#modaleFile').width() * 0.5)
   $('#modaleFile').find(".modal-body").html(`<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`)
   $('#modaleFile').modal('show')
 }

 getBills = () => {
   if (this.store) {
     return this.store
     .bills()
     .list()
     .then(snapshot => {
       const bills = snapshot
         .map(doc => {
           try {
             return {
               ...doc,
               date: formatDate(doc.date),
               status: formatStatus(doc.status)
             }
           } catch(e) {
             // if for some reason, corrupted data was introduced, we manage here failing formatDate function
             // log the error and return unformatted date in that case
             console.log(e,'for',doc)
             return {
               ...doc,
               date: doc.date,
               status: formatStatus(doc.status)
             }
           }
         })
         console.log('length', bills.length)
       return bills
     })
   }
 }
}
*/