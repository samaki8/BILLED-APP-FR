// Test environment
/**
 * @jest-environment jsdom
 */

// Core imports
import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

// Component imports
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js";
import Dashboard from "../containers/Dashboard.js";

// Constants and routes
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import router from "../app/Router.js";

// Mocks and fixtures
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import { bills } from "../fixtures/bills";

// Mock configurations

beforeEach(() => {
  jest.mock("../app/store", () => mockStore);
});
//jest.mock("../app/store", () => mockStore);

describe("Given I am connected as an employee", () => {
  beforeEach(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "employee@test.tld" }));
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
  });
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", async () => {

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const root = document.createElement("div")
      root.setAttribute("id", "root")
      document.body.append(root)
      router()
      window.onNavigate(ROUTES_PATH.Bills)
      await waitFor(() => screen.getByTestId('icon-window'))
      const windowIcon = screen.getByTestId('icon-window')
      //to-do write expect expression

    })


    test("Then bills should be ordered from earliest to latest", () => {
      document.body.innerHTML = BillsUI({ data: bills })
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    // Test du constructeur
    test("Then the constructor should initialize properly", () => {
      const onNavigate = jest.fn();
      const billsInstance = new Bills({
        document,
        onNavigate,
        store: mockStore,
        localStorage: window.localStorage
      });

      expect(billsInstance.onNavigate).toBe(onNavigate);
      expect(billsInstance.store).toBe(mockStore);
      expect(billsInstance.document).toBe(document);
    });
    test("Then clicking on 'New Bill' button should navigate to 'NewBill' page", () => {
      document.body.innerHTML = BillsUI({ data: [] });
      const onNavigate = jest.fn();
      const billsInstance = new Bills({ document, onNavigate, store: mockStore, localStorage: window.localStorage });
      const buttonNewBill = screen.getByTestId("btn-new-bill");
      userEvent.click(buttonNewBill);
      expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
    });
  });
  /*
  // Test de getBills
  describe("When I call getBills method", () => {

    test("Then it should handle corrupted bill", async () => {
      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: {
          bills: () => ({
            list: () => Promise.resolve([{ ...bills[0], date: 'invalid-date' }])
          })
        },
        localStorage: window.localStorage
      });

      const spyConsole = jest.spyOn(console, 'log');
      await billsInstance.getBills();
      expect(spyConsole).toHaveBeenCalled();
    });
  });
  // Tests/Bills.test.js (suite)
  describe("When I call getBills method and there is corrupted data", () => {
    test("Then it should handle corrupted bill and log an error", async () => {
      const store = {
        bills: jest.fn().mockReturnValue({
          list: jest.fn().mockResolvedValue([
            { date: 'invalid-date', status: 'pending', fileName: 'bill1.jpg' }
          ])
        })
      };

      const billsInstance = new Bills({ document, onNavigate: jest.fn(), store, localStorage: window.localStorage });
      const consoleSpy = jest.spyOn(console, 'log');

      await billsInstance.getBills();

      // Vérifie que console.log a été appelé
      expect(consoleSpy).toHaveBeenCalled();

      // Vérifie que le premier argument dans l'appel de console.log est une instance d'Error
      const errorArg = consoleSpy.mock.calls[0][0];
      expect(errorArg instanceof Error).toBeTruthy();

      // OU vérifier tous les arguments
      const allArgs = consoleSpy.mock.calls[0];
      expect(allArgs.some(arg => arg instanceof Error || arg.toString().includes('Error'))).toBeTruthy();
    });
  });

*/
  describe('Given I am connected as a user and I am on Bills page', () => {
    describe('When I navigate to Bills', () => {
      test('Then the getBills method should return formatted bills', async () => {
        // Mock du localStorage
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'User'
        }))

        // Mock des données de test
        const mockBills = [
          {
            id: '1',
            date: '2024-01-15',
            status: 'pending',
            amount: 100
          },
          {
            id: '2',
            date: '2024-01-20',
            status: 'accepted',
            amount: 200
          }
        ]

        // Mock du store
        const store = {
          bills: jest.fn().mockImplementation(() => ({
            list: () => Promise.resolve(mockBills)
          }))
        }

        // Création de l'instance à tester
        const billsClass = new Bills({
          document,
          onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
          store,
          localStorage: window.localStorage
        })

        // Test de la fonction getBills
        const bills = await billsClass.getBills()

        // Vérifications
        expect(bills).toBeTruthy()
        expect(bills.length).toBe(2)
        expect(bills[0]).toEqual(expect.objectContaining({
          id: '1',
          date: '2024-01-15',
          formatedDate: expect.any(String), // vérifie que formatedDate existe et est une string
          status: expect.any(String)        // vérifie que status existe et est une string
        }))
      })

      test('Then the getBills method should handle formatting errors', async () => {
        // Mock du localStorage
        Object.defineProperty(window, 'localStorage', { value: localStorageMock })
        window.localStorage.setItem('user', JSON.stringify({
          type: 'User'
        }))

        // Mock des données avec une date invalide
        const mockBillsWithError = [
          {
            id: '1',
            date: 'invalid-date', // date invalide pour tester la gestion d'erreur
            status: 'pending',
            amount: 100
          }
        ]

        // Mock du store
        const store = {
          bills: jest.fn().mockImplementation(() => ({
            list: () => Promise.resolve(mockBillsWithError)
          }))
        }

        // Mock de console.log pour vérifier les erreurs
        const consoleSpy = jest.spyOn(console, 'log')

        // Création de l'instance
        const billsClass = new Bills({
          document,
          onNavigate: (pathname) => document.body.innerHTML = ROUTES({ pathname }),
          store,
          localStorage: window.localStorage
        })

        // Test de la fonction getBills
        const bills = await billsClass.getBills()

        // Vérifications
        expect(bills).toBeTruthy()
        expect(consoleSpy).toHaveBeenCalled() // vérifie que l'erreur a été loggée
        expect(bills.length).toBe(1)
      })

      test('Then getBills should return null if store is not defined', () => {
        // Création de l'instance sans store
        const billsClass = new Bills({
          document,
          onNavigate: null,
          store: null,
          localStorage: window.localStorage
        })

        // Test
        const result = billsClass.getBills()

        // Vérification
        expect(result).toBeUndefined()
      })
    })
  })


  // Test de la modale

  describe("When I am on Bills Page and I click on the icon eye", () => {
    test("Then the modal should display the image if URL is valid", async () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage
      });

      const icon = screen.getAllByTestId("icon-eye")[0];
      const validUrl = "http://example.com/valid.jpg";
      icon.setAttribute("data-bill-url", validUrl);

      // Mock jQuery modal et find avec mise à jour réelle du DOM
      $.fn.modal = jest.fn();
      $.fn.width = () => 500;
      $.fn.find = function () {
        return {
          html: function (content) {
            if (content) {
              document.querySelector("#modaleFile .modal-body").innerHTML = content;
            }
            return this;
          }
        };
      };

      // Simuler le chargement réussi de l'image
      const mockImage = new Image();
      global.Image = jest.fn(() => mockImage);

      billsInstance.handleClickIconEye(icon);

      // Déclencher manuellement l'événement onload
      mockImage.onload();

      // Vérifier le contenu de la modal
      const modalContent = document.querySelector("#modaleFile .modal-body").innerHTML;
      expect(modalContent).toBe(`<div style="text-align: center;" class="bill-proof-container"><img width="250" src="http://example.com/valid.jpg" alt="Bill"></div>`);
    });

    test("Then it should handle corrupted image URL", async () => {
      document.body.innerHTML = BillsUI({ data: bills });

      const billsInstance = new Bills({
        document,
        onNavigate: jest.fn(),
        store: null,
        localStorage: window.localStorage
      });

      const icon = screen.getAllByTestId("icon-eye")[0];
      icon.setAttribute("data-bill-url", "invalid-url");

      // Mock jQuery modal et find avec mise à jour réelle du DOM
      $.fn.modal = jest.fn();
      $.fn.width = () => 500;
      $.fn.find = function () {
        return {
          html: function (content) {
            if (content) {
              document.querySelector("#modaleFile .modal-body").innerHTML = content;
            }
            return this;
          }
        };
      };

      // Simuler le chargement échoué de l'image
      const mockImage = new Image();
      global.Image = jest.fn(() => mockImage);

      billsInstance.handleClickIconEye(icon);

      // Déclencher manuellement l'événement onerror
      mockImage.onerror();

      // Vérifier le contenu de la modal
      const modalContent = document.querySelector("#modaleFile .modal-body").innerHTML;
      expect(modalContent).toBe(`<div style="text-align: center;" class="bill-proof-container">Le fichier est corrompu</div>`);
    });
  });
});

// Test des erreurs API
describe("When API calls fail", () => {
  test("Then it should handle 404 error", async () => {
    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: {
        bills: () => ({
          list: () => Promise.reject(new Error("Erreur 404"))
        })
      },
      localStorage: window.localStorage
    });

    await expect(billsInstance.getBills()).rejects.toThrow("Erreur 404");
  });

  test("Then it should handle 500 error", async () => {
    const billsInstance = new Bills({
      document,
      onNavigate: jest.fn(),
      store: {
        bills: () => ({
          list: () => Promise.reject(new Error("Erreur 500"))
        })
      },
      localStorage: window.localStorage
    });

    await expect(billsInstance.getBills()).rejects.toThrow("Erreur 500");
  });
});

