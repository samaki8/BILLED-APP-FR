import { ROUTES_PATH } from "../constants/routes.js";
import { formatDate, formatStatus } from "../app/format.js";
import Logout from "./Logout.js";

export default class {
  constructor({ document, onNavigate, store, localStorage }) {
    this.document = document;
    this.onNavigate = onNavigate;
    this.store = store;
    const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`);
    if (buttonNewBill) buttonNewBill.addEventListener("click", this.handleClickNewBill);
    const iconEye = document.querySelectorAll(`div[data-testid="icon-eye"]`);
    if (iconEye)
      iconEye.forEach((icon) => {
        icon.addEventListener("click", () => this.handleClickIconEye(icon));
      });
    new Logout({ document, localStorage, onNavigate });
  }

  handleClickNewBill = () => {
    this.onNavigate(ROUTES_PATH["NewBill"]);
  };


  handleClickIconEye = (icon) => {
    const billUrl = icon.getAttribute("data-bill-url");
    const modaleFile = document.getElementById('modaleFile');
    const imgWidth = Math.floor(modaleFile.offsetWidth * 0.5);

    const img = new Image();
    img.src = billUrl;

    img.onload = () => {
      const modalBody = modaleFile.querySelector(".modal-body");
      modalBody.innerHTML = `<div style='text-align: center;' class="bill-proof-container"><img width=${imgWidth} src=${billUrl} alt="Bill" /></div>`;
      modaleFile.classList.add('show');
    }

    img.onerror = () => {
      const modalBody = modaleFile.querySelector(".modal-body");
      modalBody.innerHTML = `<div style='text-align: center;' class="bill-proof-container">Le fichier est corrompu</div>`;
      modaleFile.classList.add('show');
    }
  }

  getBills = () => {
    if (this.store) {
      return this.store
        .bills()
        .list()
        .then((snapshot) => {
          const bills = snapshot.map((doc) => {
            try {
              return {
                ...doc,
                date: doc.date,
                formatedDate: formatDate(doc.date),
                status: formatStatus(doc.status),
              };
            } catch (e) {
              // if for some reason, corrupted data was introduced, we manage here failing formatDate function
              // log the error and return unformatted date in that case
              console.log(e, "for", doc);
            }
          });
          console.log("length", bills.length);
          return bills;
        });
    }
  };
}

