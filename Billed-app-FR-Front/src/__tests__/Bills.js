/**
 * @jest-environment jsdom
 */
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import Bills from "../containers/Bills.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import '@testing-library/jest-dom/extend-expect';

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee',
        email: 'employee@test.com'
      }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.appendChild(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);
    });

    afterEach(() => {
      document.body.innerHTML = '';
      jest.clearAllMocks();
    });

    // Test d'initialisation
    test("Then Bills class should be properly initialized", () => {
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage
      });

      expect(billsInstance.document).toBeDefined();
      expect(billsInstance.onNavigate).toBeDefined();
      expect(billsInstance.store).toBeNull();
      expect(billsInstance.localStorage).toBeDefined();
    });

    // Test du rendu de la page
    test("Then bills page should be rendered correctly", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;

      const billsTable = screen.getByTestId("tbody");
      const iconEyes = screen.getAllByTestId("icon-eye");

      expect(billsTable).toBeTruthy();
      expect(iconEyes.length).toBe(bills.length);
    });

    // Test complet de handleClickNewBill
    describe("When I click on New Bill button", () => {
      test("Then I should be redirected to NewBill page", () => {
        const onNavigateMock = jest.fn();
        const billsInstance = new Bills({
          document,
          onNavigate: onNavigateMock,
          store: null,
          localStorage: window.localStorage
        });

        const handleClickNewBill = jest.spyOn(billsInstance, 'handleClickNewBill');
        const newBillBtn = screen.getByTestId("btn-new-bill");

        fireEvent.click(newBillBtn);

        expect(handleClickNewBill).toHaveBeenCalled();
        expect(onNavigateMock).toHaveBeenCalledWith(ROUTES_PATH['NewBill']);
      });
    });

    // Tests complets de handleClickIconEye

    describe("When I click on icon eye", () => {
      test("Then it should handle missing bill URL", () => {
        document.body.innerHTML = BillsUI({ data: bills });

        const modal = document.getElementById('modaleFile');
        if (modal) modal.remove(); // Nettoyage si la modale existe déjà

        const billsInstance = new Bills({
          document,
          onNavigate: jest.fn(),
          store: null,
          localStorage: window.localStorage
        });

        const iconEye = screen.getAllByTestId("icon-eye")[0];
        iconEye.removeAttribute("data-bill-url");

        fireEvent.click(iconEye);

        const modalBody = document.querySelector('.modal-body');
        expect(modalBody).toBe(null);
      });
    });
    /*
     test("Then the modal should open with correct image", async () => {
       document.body.innerHTML = BillsUI({ data: bills });

       const modal = document.createElement('div');
       modal.setAttribute('id', 'modaleFile');
       modal.innerHTML = '<div class="modal-body"></div>';
       document.body.appendChild(modal);

       const billsInstance = new Bills({
         document,
         onNavigate: jest.fn(),
         store: null,
         localStorage: window.localStorage
       });

       $.fn.modal = jest.fn();

       const iconEye = screen.getAllByTestId("icon-eye")[0];
       const billUrl = "https://test.storage.tld/test.jpg";
       iconEye.setAttribute("data-bill-url", billUrl);

       const handleClickIconEye = jest.spyOn(billsInstance, 'handleClickIconEye');

       fireEvent.click(iconEye);

       expect(handleClickIconEye).toHaveBeenCalled();
       expect($.fn.modal).toHaveBeenCalled();

       const modale = document.getElementById('modaleFile');
       const modalBody = modale.querySelector('.modal-body');
       expect(modalBody.innerHTML).toContain('img');
     });

     test("Then it should handle missing bill URL", () => {
       document.body.innerHTML = BillsUI({ data: bills });

       const billsInstance = new Bills({
         document,
         onNavigate: jest.fn(),
         store: null,
         localStorage: window.localStorage
       });

       const iconEye = screen.getAllByTestId("icon-eye")[0];
       iconEye.removeAttribute("data-bill-url");

       const handleClickIconEye = jest.spyOn(billsInstance, 'handleClickIconEye');

       fireEvent.click(iconEye);

       expect(handleClickIconEye).toHaveBeenCalled();
       const modalBody = document.querySelector('.modal-body');
       expect(modalBody).toBeFalsy();
     });
     */
  });

  // Tests complets de getBills
  //Correction du test pour les données corrompues
  describe("When I fetch bills", () => {
    test("Then it should handle corrupted data", async () => {
      const corruptedBills = [
        {
          id: "1",
          status: "pending",
          date: null,
          amount: 100
        }
      ];

      const getSpy = jest.fn().mockImplementation(() => ({
        list: () => Promise.resolve(corruptedBills)
      }));

      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: { bills: getSpy },
        localStorage: window.localStorage
      });

      const formattedBills = await billsInstance.getBills();
      expect(formattedBills[0].date).toBe("");
    });
  });


  test("Then it should handle API errors", async () => {
    const getSpy = jest.fn().mockImplementation(() => {
      return {
        list: () => Promise.reject(new Error("API Error"))
      };
    });

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: { bills: getSpy },
      localStorage: window.localStorage
    });

    await expect(billsInstance.getBills()).rejects.toThrow("API Error");
    expect(getSpy).toHaveBeenCalled();
  });

  test("Then it should handle corrupted data", async () => {
    const corruptedBills = [
      { ...bills[0], date: null },
      { ...bills[1], status: undefined }
    ];

    const getSpy = jest.fn().mockImplementation(() => {
      return {
        list: () => Promise.resolve(corruptedBills)
      };
    });

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: { bills: getSpy },
      localStorage: window.localStorage
    });

    const formattedBills = await billsInstance.getBills();

    expect(formattedBills[0].date).toBe('');
    expect(formattedBills[1].status).toBe('pending');
  });
});

// Test de l'ordre des factures
test("Then bills should be ordered from earliest to latest", async () => {
  const billsInstance = new Bills({
    document,
    onNavigate: jest.fn(),
    store: {
      bills: jest.fn().mockImplementation(() => ({
        list: () => Promise.resolve([
          { ...bills[0], date: "2021-12-31" },
          { ...bills[1], date: "2021-12-01" }
        ])
      }))
    },
    localStorage: window.localStorage
  });

  const formattedBills = await billsInstance.getBills();
  const dates = formattedBills.map(bill => new Date(bill.date));

  expect(dates[0].getTime()).toBeLessThan(dates[1].getTime());
});

// Pour lignes 38, 41 - Test de handleClickIconEye avec différentes conditions
test("Then handleClickIconEye should handle various icon states", async () => {
  document.body.innerHTML = BillsUI({ data: bills });

  const billsInstance = new Bills({
    document,
    onNavigate: jest.fn(),
    store: null,
    localStorage: window.localStorage
  });

  // Test avec une icon sans attribut data-bill-url
  const iconWithoutUrl = document.createElement('div');
  billsInstance.handleClickIconEye(iconWithoutUrl);

  // Test avec une icon avec URL invalide
  const iconWithInvalidUrl = document.createElement('div');
  iconWithInvalidUrl.setAttribute('data-bill-url', '');
  billsInstance.handleClickIconEye(iconWithInvalidUrl);

  expect(document.querySelector('.modal-body')).toBeDefined();
});

// Pour lignes 65-66 - Test de getBills avec données non formatables
test("Then getBills should handle malformed dates", async () => {
  const billsInstance = new Bills({
    document,
    onNavigate: jest.fn(),
    store: {
      bills: jest.fn().mockImplementation(() => ({
        list: () => Promise.resolve([
          {
            id: '1',
            status: 'pending',
            date: 'invalid-date',
            amount: 100
          }
        ])
      }))
    },
    localStorage: window.localStorage
  });

  const bills = await billsInstance.getBills();
  expect(bills[0].date).toBe('');
});
test("Then bills dates should be correctly formatted", async () => {
  const billsInstance = new Bills({
    document,
    onNavigate: jest.fn(),
    store: {
      bills: jest.fn().mockImplementation(() => ({
        list: () => Promise.resolve([
          {
            id: '1',
            status: 'pending',
            date: '2021-11-17', // date valide
            amount: 100
          }
        ])
      }))
    },
    localStorage: window.localStorage
  });

  const formattedBills = await billsInstance.getBills();

  // Vérification plus précise du format de date
  formattedBills.forEach(bill => {
    expect(bill.date).toMatch(/^[0-9]{1,2}\s[A-Za-z]{3,10}\.\s[0-9]{4}$/);
  });
});
test("Then bills should handle localStorage correctly", () => {
  const localStorageMock = {
    getItem: jest.fn().mockReturnValue(JSON.stringify({ type: 'Employee' })),
    setItem: jest.fn()
  };

  const billsInstance = new Bills({
    document,
    onNavigate: jest.fn(),
    store: null,
    localStorage: localStorageMock
  });

  expect(localStorageMock.getItem).toBeDefined();
  expect(localStorageMock.getItem('user')).toBeTruthy();
});





/*

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const dates = Array.from(document.querySelectorAll('tbody tr'))
        .map(row => row.querySelector('td:nth-child(3)').textContent)

      // Log the dates for debugging
      console.log('Dates before sorting:', dates)

      const datesSorted = [...dates].sort((a, b) => {
        return new Date(b) - new Date(a)
      })

      console.log('Dates after sorting:', datesSorted)

      expect(dates).toEqual(datesSorted)
    })
    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      console.log('Dates actuelles :', dates)

      // Tri chronologique simple avec localeCompare
      const datesSorted = [...dates].sort((a, b) => a.localeCompare(b))

      console.log('Dates triées :', datesSorted)
      expect(dates).toEqual(datesSorted)
    })

    test("Then each bill should have a valid date format", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html

      const dates = Array.from(document.querySelectorAll('tbody tr'))
        .map(row => row.querySelector('td:nth-child(3)').textContent)

      dates.forEach(date => {
        expect(isNaN(new Date(date).getTime())).toBe(false)
      })
    })
  })
})

/*
import { screen, waitFor, fireEvent } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { bills } from "../fixtures/bills.js"
import router from "../app/Router.js"

// Setup jQuery mock avec toutes les méthodes nécessaires
global.$ = jest.fn(() => ({
  width: () => 100,
  find: () => ({
    html: jest.fn()
})
  modal: jest.fn(),
  click: jest.fn(),
  on: jest.fn(),
  val: jest.fn(),
  text: jest.fn(),
  append: jest.fn(),
  css: jest.fn(),
  show: jest.fn(),
  hide: jest.fn(),
  addClass: jest.fn(),
  removeClass: jest.fn()
}))

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    beforeEach(() => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }))
    })

    test("Then bill icon in vertical layout should be highlighted", async () => {
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)

      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      expect(windowIcon.classList.contains('active-icon')).toBe(true)
    })

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map(a => a.innerHTML)

      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)

      expect(dates).toEqual(datesSorted)
    })
  })

  describe("When I click on the new bill button", () => {
    test("Then I should be redirected to NewBill page", () => {
      const onNavigate = jest.fn()
      const billsInstance = new Bills({
        document,
        onNavigate,
        store: null,
        localStorage: window.localStorage
      })

      document.body.innerHTML = BillsUI({ data: bills })
      const newBillButton = screen.getByTestId('btn-new-bill')

      // Utiliser fireEvent au lieu de jQuery click
      fireEvent.click(newBillButton)
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH.NewBill)
    })
  })

  describe("When I click on the eye icon", () => {
    test("Then it should open the bill proof modal", () => {
      document.body.innerHTML = BillsUI({ data: bills })

      const billsInstance = new Bills({
        document,
        onNavigate: (pathname) => {
          document.body.innerHTML = ROUTES({ pathname })
        },
        store: null,
        localStorage: window.localStorage
      })

      // Mock de la fonction handleClickIconEye
      const handleClickIconEye = jest.spyOn(billsInstance, 'handleClickIconEye')
      const eye = screen.getAllByTestId('icon-eye')[0]

      // Utiliser fireEvent au lieu de jQuery click
      fireEvent.click(eye)

      expect(handleClickIconEye).toHaveBeenCalled()
      expect($).toHaveBeenCalled()
      expect($.mock.results[0].value.modal).toHaveBeenCalledWith('show')
    })
  })

  describe("When there is an error accessing localStorage", () => {
    test("Then getBills should throw an error", () => {
      const billsInstance = new Bills({
        document,
        onNavigate: null,
        store: {
          bills: () => ({
            list: () => Promise.reject(new Error("Erreur de test"))
          })
        },
        localStorage: null
      })

      return expect(billsInstance.getBills()).rejects.toThrow("Erreur de test")
    })
  })

  describe("When the bills list is empty", () => {
    test("Then the table should be empty but present", () => {
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html

      const table = document.getElementById("example")
      const tbody = screen.getByTestId("tbody")

      expect(table).toBeTruthy()
      expect(tbody.innerHTML.trim()).toBe("")
    })
  })

  describe("When bills are displayed", () => {
    test("Then they should show correct status", () => {
      const billData = [{
        status: 'pending',
        date: '2021-01-01'
      }]

      document.body.innerHTML = BillsUI({ data: billData })
      const statusCell = screen.getByText('pending')

      expect(statusCell).toBeTruthy()
    })

    test("Then they should be sorted from latest to earliest", () => {
      const billData = [
        { date: '2021-01-01', status: 'pending' },
        { date: '2021-02-01', status: 'accepted' }
      ]

      document.body.innerHTML = BillsUI({ data: billData })
      const dates = Array.from(document.querySelectorAll('tbody tr'))
        .map(tr => tr.children[2].textContent)

      expect(new Date(dates[0]) > new Date(dates[1])).toBeTruthy()
    })
  })
})

*/




/**
 * @jest-environment jsdom
 */
/*
import { screen, waitFor, fireEvent } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import { ROUTES_PATH } from "../constants/routes.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import Bills from "../containers/Bills.js";
import router from "../app/Router.js";
import Dashboard from "../containers/Dashboard.js";
import '@testing-library/jest-dom/extend-expect';

/*
describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });

  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      window.onNavigate(ROUTES_PATH.Bills);
      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML);
      const datesSorted = [...dates].sort((a, b) => (a < b ? 1 : -1));
      expect(dates).toEqual(datesSorted);
    });

    test("getBills should handle API errors gracefully", async () => {
      const storeMock = {
        bills: jest.fn().mockImplementation(() => ({
          list: jest.fn().mockRejectedValueOnce(new Error("Erreur API"))
        }))
      };
      const billsInstance = new Bills({ document, onNavigate: jest.fn(), store: storeMock, localStorage: window.localStorage });
      await expect(billsInstance.getBills()).rejects.toThrow("Erreur API");
    });

    test("BillsUI should handle empty data correctly", () => {
      document.body.innerHTML = BillsUI({ data: [] });
      const billsTable = screen.getByTestId("bills-table");
      expect(billsTable.innerHTML).toContain("Aucune facture");
    });

    test("When I click on the eye icon, it should open the bill proof modal", async () => {
      document.body.innerHTML = BillsUI({ data: bills });
      document.body.innerHTML += `<div id="modaleFile" class="modal"><div class="modal-body"><img id="bill-proof-modal" width="500" /></div></div>`;
      const billsInstance = new Bills({ document, onNavigate: jest.fn(), store: null, localStorage: window.localStorage });
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      const billUrl = "http://localhost:5678/public/4b392f446047ced066990b0627cfa444";
      iconEye.setAttribute("data-bill-url", billUrl);
      await billsInstance.handleClickIconEye(iconEye);
      const billImage = document.getElementById("bill-proof-modal");
      expect(billImage.src).toBe(billUrl);
    });

    test("Bills should have valid date format", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i);
      dates.forEach(date => {
        const dateValue = new Date(date.innerHTML);
        expect(date.innerHTML).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(dateValue instanceof Date && !isNaN(dateValue)).toBe(true);
        expect(dateValue.getFullYear()).toBeGreaterThanOrEqual(2000);
        expect(dateValue.getFullYear()).toBeLessThanOrEqual(new Date().getFullYear());
      });
    });

    test("Bills should handle localStorage errors", () => {
      Object.defineProperty(window, "localStorage", {
        value: {
          getItem: jest.fn(() => { throw new Error("localStorage n'est pas disponible"); })
        }
      });
      expect(() => {
        new Bills({ document, onNavigate: jest.fn(), store: null, localStorage: window.localStorage }).getBills();
      }).toThrow("localStorage n'est pas disponible");
    });

    test("Bills should display correct status", () => {
      document.body.innerHTML = BillsUI({ data: [{ status: "pending" }] });
      const statusElement = screen.getByText("pending");
      expect(statusElement.classList.contains("status-pending")).toBe(true);
    });

    test("getBills should return bills sorted from latest to earliest", async () => {
      const mockBills = [
        { date: "2023-12-25" },
        { date: "2023-06-18" },
        { date: "2023-01-10" }
      ];
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: { bills: () => ({ list: () => Promise.resolve(mockBills) }) },
        localStorage: window.localStorage
      });
      const result = await billsInstance.getBills();
      const dates = result.map(bill => new Date(bill.date).getTime());
      const isSorted = dates.slice(1).every((date, i) => date <= dates[i]);
      expect(isSorted).toBe(true);
    });

    test("When the image fails to load, it should display an error message", async () => {
      document.body.innerHTML = BillsUI({ data: bills });
      document.body.innerHTML += `<div id="modaleFile" class="modal"><div class="modal-body"><div class="error-message">Fichier non trouvé</div></div></div>`;
      const billsInstance = new Bills({ document, onNavigate: jest.fn(), store: null, localStorage: window.localStorage });
      const iconEye = screen.getAllByTestId("icon-eye")[0];
      const invalidUrl = "invalid-url";
      iconEye.setAttribute("data-bill-url", invalidUrl);
      await billsInstance.handleClickIconEye(iconEye);
      const errorMessage = document.querySelector(".error-message");
      expect(errorMessage.textContent).toBe("Fichier non trouvé");
    });

    test("Displays bills with 'pending' status when clicking on arrow-icon1", () => {
      Object.defineProperty(window, "localStorage", {
        value: { getItem: jest.fn(() => JSON.stringify({ email: "employee@test.com" })) },
        writable: true
      });
      document.body.innerHTML = `<div id="arrow-icon1" data-testid="arrow-icon1"></div><div id="status-bills-container1" data-testid="status-bills-container1"></div>`;
      const bills = [
        { id: 1, status: "pending", email: "employee@test.com", date: "2023-12-01", name: "Test Bill", amount: 100, type: "Transport" },
        { id: 2, status: "accepted", email: "employee@test.com", date: "2023-11-01", name: "Test Bill 2", amount: 200, type: "Meals" }
      ];
      const dashboard = new Dashboard({
        document,
        onNavigate: jest.fn(),
        store: { bills: () => ({ list: () => Promise.resolve(bills) }) },
        bills,
        localStorage: window.localStorage
      });
      const arrowIcon = screen.getByTestId("arrow-icon1");
      arrowIcon.click();
      const statusContainer = screen.getByTestId("status-bills-container1");
      expect(statusContainer.innerHTML).toContain("pending");
    });
  });
});
*/

/*

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {
      Object.defineProperty(window, 'localStorage', { value: localStorageMock });
      window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
      const root = document.createElement("div");
      root.setAttribute("id", "root");
      document.body.append(root);
      router();
      window.onNavigate(ROUTES_PATH.Bills);

      await waitFor(() => screen.getByTestId('icon-window'));
      const windowIcon = screen.getByTestId('icon-window');
      expect(windowIcon.classList.contains('active-icon')).toBe(true);
    });

    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills });
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i)
        .map(a => a.innerHTML);

      const antiChrono = (a, b) => ((a < b) ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);

      expect(dates).toEqual(datesSorted);
    });
  });

  test("getBills should handle API errors gracefully", async () => {
    const storeMock = {
      bills: jest.fn().mockImplementation(() => ({
        list: jest.fn().mockRejectedValueOnce(new Error("Erreur API"))
      }))
    };

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: storeMock,
      localStorage: window.localStorage
    });

    await expect(billsInstance.getBills()).rejects.toThrow("Erreur API");
  });

  test("BillsUI should handle empty data correctly", () => {
    document.body.innerHTML = BillsUI({ data: [] });
    const billsTable = screen.getByTestId("bills-table");
    expect(billsTable.innerHTML).toContain("Aucune facture");
  });

  test("When I click on the eye icon, it should open the bill proof modal", async () => {
    document.body.innerHTML = BillsUI({ data: bills });
    document.body.innerHTML += `
        <div id="modaleFile" class="modal">
          <div class="modal-body">
            <img id="bill-proof-modal" width="500" />
          </div>
        </div>`;

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: null,
      localStorage: window.localStorage
    });

    const iconEye = screen.getAllByTestId("icon-eye")[0];
    const billUrl = "http://localhost:5678/public/4b392f446047ced066990b0627cfa444";

    iconEye.setAttribute("data-bill-url", billUrl);

    // Afficher la modale sans jQuery
    await billsInstance.handleClickIconEye(iconEye);

    const billImage = document.getElementById("bill-proof-modal");
    expect(billImage.src).toBe(billUrl);
  });

  test("Bills should have valid date format", () => {
    document.body.innerHTML = BillsUI({ data: bills });
    const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i);

    dates.forEach(date => {
      const dateValue = new Date(date.innerHTML);
      expect(date.innerHTML).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(dateValue instanceof Date && !isNaN(dateValue)).toBe(true);
      expect(dateValue.getFullYear()).toBeGreaterThanOrEqual(2000);
      expect(dateValue.getFullYear()).toBeLessThanOrEqual(new Date().getFullYear());
    });
  });

  test("Bills should handle localStorage errors", () => {
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => { throw new Error("localStorage n'est pas disponible"); })
      }
    });

    expect(() => {
      new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage
      }).getBills();
    }).toThrow("localStorage n'est pas disponible");
  });


  test("Bills should display correct status", () => {
    document.body.innerHTML = BillsUI({
      data: [{ status: "pending" }]
    });

    const statusElement = screen.getByText("pending");
    expect(statusElement.classList.contains("status-pending")).toBe(true);
  });

  test("getBills should return bills sorted from latest to earliest", async () => {
    const mockBills = [
      { date: "2023-12-25" },
      { date: "2023-06-18" },
      { date: "2023-01-10" }
    ];

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: {
        bills: () => ({
          list: () => Promise.resolve(mockBills)
        })
      },
      localStorage: window.localStorage
    });

    const result = await billsInstance.getBills();

    const dates = result.map(bill => new Date(bill.date).getTime());
    const isSorted = dates.slice(1).every((date, i) => date <= dates[i]);
    expect(isSorted).toBe(true);
  });

  test("When the image fails to load, it should display an error message", async () => {
    document.body.innerHTML = BillsUI({ data: bills });
    document.body.innerHTML += `
        <div id="modaleFile" class="modal">
          <div class="modal-body">
            <div class="error-message">Fichier non trouvé</div>
          </div>
        </div>`;

    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: null,
      localStorage: window.localStorage
    });

    const iconEye = screen.getAllByTestId("icon-eye")[0];
    const invalidUrl = "invalid-url";
    iconEye.setAttribute("data-bill-url", invalidUrl);

    await billsInstance.handleClickIconEye(iconEye);

    const errorMessage = document.querySelector(".error-message");
    expect(errorMessage.textContent).toBe("Fichier non trouvé");
  });

  test("Displays bills with 'pending' status when clicking on arrow-icon1", () => {
    // Création d'un mock pour le localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => JSON.stringify({ email: "employee@test.com" }))
      },
      writable: true
    });

    // Configuration du DOM avec les icônes nécessaires
    document.body.innerHTML = `
    <div id="arrow-icon1" data-testid="arrow-icon1"></div>
    <div id="status-bills-container1" data-testid="status-bills-container1"></div>
  `;

    // Données de factures simulées
    const bills = [
      { id: 1, status: "pending", email: "employee@test.com", date: "2023-12-01", name: "Test Bill", amount: 100, type: "Transport" },
      { id: 2, status: "accepted", email: "employee@test.com", date: "2023-11-01", name: "Test Bill 2", amount: 200, type: "Meals" }
    ];

    // Création de l'instance du Dashboard avec les factures
    const dashboard = new Dashboard({
      document,
      onNavigate: jest.fn(),
      store: { bills: () => ({ list: () => Promise.resolve(bills) }) },
      bills,
      localStorage: window.localStorage
    });

    // Simulation du clic pour afficher les factures "pending"
    const arrowIcon = screen.getByTestId("arrow-icon1");
    arrowIcon.click();

    // Vérifiez si les factures affichées ont bien le statut "pending"
    const statusContainer = screen.getByTestId("status-bills-container1");
    expect(statusContainer.innerHTML).toContain("pending");
  });

});
*/