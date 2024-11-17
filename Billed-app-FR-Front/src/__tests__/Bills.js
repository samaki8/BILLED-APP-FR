/**
 * @jest-environment jsdom
 */

import { screen, waitFor } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import Bills from "../containers/Bills.js";
import BillsUI from "../views/BillsUI.js";
import { ROUTES_PATH } from "../constants/routes";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store";
import router from "../app/Router.js";
import { bills } from "../fixtures/bills.js";

jest.mock("../app/store", () => ({
    bills: () => ({
        list: () => Promise.resolve([{
            id: "1",
            date: "2024-01-15",
            status: "pending",
            amount: 100
        }])
    })
}));


describe("Bills", () => {
    /*
    beforeEach(() => {
        Object.defineProperty(window, 'localStorage', { value: localStorageMock });
        window.localStorage.setItem('user', JSON.stringify({ type: 'Employee' }));
        document.body.innerHTML = '<div id="root"></div>';
        router();
    });
    */
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
    });
    describe("Basic Component Tests", () => {
        test("Bills instance should be properly initialized", () => {
            const onNavigate = jest.fn();
            const bills = new Bills({ document, onNavigate, store: mockStore, localStorage });

            expect(bills.onNavigate).toBe(onNavigate);
            expect(bills.store).toBeDefined();
            expect(bills.document).toBe(document);
        });

        test("New Bill button should navigate to NewBill page", () => {
            document.body.innerHTML = BillsUI({ data: [] });
            const onNavigate = jest.fn();
            const bills = new Bills({ document, onNavigate, store: mockStore, localStorage });

            const button = screen.getByTestId("btn-new-bill");
            userEvent.click(button);

            expect(onNavigate).toHaveBeenCalledWith(ROUTES_PATH["NewBill"]);
        });
    });

    describe("getBills Method", () => {
        test("should return formatted bills", async () => {
            const bills = new Bills({
                document,
                onNavigate: jest.fn(),
                store: mockStore,
                localStorage
            });

            const result = await bills.getBills();

            expect(result).toBeDefined();
            expect(Array.isArray(result)).toBe(true);
            expect(result[0].date).toBeDefined();
            expect(result[0].status).toBeDefined();
        });

        test("should return undefined when store is null", () => {
            const bills = new Bills({
                document,
                onNavigate: jest.fn(),
                store: null,
                localStorage
            });

            const result = bills.getBills();

            expect(result).toBeUndefined();
        });

        test("should handle API errors", async () => {
            const errorStore = {
                bills: () => ({
                    list: () => Promise.reject(new Error("API Error"))
                })
            };

            const bills = new Bills({
                document,
                onNavigate: jest.fn(),
                store: errorStore,
                localStorage
            });

            await expect(bills.getBills()).rejects.toThrow("API Error");
        });
    });

    describe("Modal Tests", () => {
        test("should display image in modal", () => {
            // Setup du DOM
            document.body.innerHTML = BillsUI({ data: [] });
            document.body.innerHTML += `
            <div id="modaleFile" class="modal fade">
              <div class="modal-body"></div>
            </div>`;

            // Setup de l'instance Bills
            const bills = new Bills({
                document,
                onNavigate: jest.fn(),
                store: null,
                localStorage: window.localStorage
            });

            // Mock complet de jQuery
            $.fn.modal = jest.fn();
            $.fn.width = jest.fn().mockReturnValue(500);
            $.fn.find = jest.fn().mockReturnValue({
                html: jest.fn()
            });

            // Création et setup de l'icône
            const icon = document.createElement("div");
            icon.setAttribute("data-testid", "icon-eye");
            icon.setAttribute("data-bill-url", "http://example.com/image.jpg");

            // Mock de l'objet Image
            const mockImage = {
                onload: null,
                onerror: null
            };
            global.Image = jest.fn(() => mockImage);

            // Déclenchement du click
            bills.handleClickIconEye(icon);

            // Simulation du chargement réussi de l'image
            mockImage.onload && mockImage.onload();

            // Vérifications
            expect($.fn.modal).toHaveBeenCalled();
            expect(document.querySelector(".modal-body")).toBeDefined();
        });

        test("should handle corrupted image", () => {
            // Setup du DOM
            document.body.innerHTML = BillsUI({ data: [] });
            document.body.innerHTML += `
            <div id="modaleFile" class="modal fade">
              <div class="modal-body"></div>
            </div>`;

            // Setup de l'instance Bills
            const bills = new Bills({
                document,
                onNavigate: jest.fn(),
                store: null,
                localStorage: window.localStorage
            });

            // Mock complet de jQuery
            $.fn.modal = jest.fn();
            $.fn.width = jest.fn().mockReturnValue(500);
            $.fn.find = jest.fn().mockReturnValue({
                html: jest.fn((content) => {
                    const modalBody = document.querySelector(".modal-body");
                    if (modalBody && content) {
                        modalBody.innerHTML = content;
                    }
                })
            });

            // Création et setup de l'icône
            const icon = document.createElement("div");
            icon.setAttribute("data-testid", "icon-eye");
            icon.setAttribute("data-bill-url", "invalid-url");

            // Mock de l'objet Image
            const mockImage = {
                onload: null,
                onerror: null
            };
            global.Image = jest.fn(() => mockImage);

            // Déclenchement du click
            bills.handleClickIconEye(icon);

            // Simulation de l'erreur de chargement de l'image
            mockImage.onerror && mockImage.onerror();

            // Vérifications
            expect($.fn.modal).toHaveBeenCalled();
            const modalBody = document.querySelector(".modal-body");
            expect(modalBody).toBeDefined();
            expect(modalBody.innerHTML).toContain("corrompu");
        });
    });
    /*
        describe("Modal Tests", () => {
            test("should display image in modal", () => {
                document.body.innerHTML = BillsUI({ data: [] }) +
                    '<div id="modaleFile"><div class="modal-body"></div></div>';
    
                const bills = new Bills({ document, onNavigate: jest.fn(), store: null, localStorage });
                const icon = document.createElement("div");
                icon.setAttribute("data-bill-url", "http://example.com/image.jpg");
    
                // Mock jQuery
                global.$ = jest.fn(() => ({
                    modal: jest.fn(),
                    find: jest.fn(() => ({
                        html: jest.fn()
                    }))
                }));
    
                bills.handleClickIconEye(icon);
    
                expect($).toHaveBeenCalled();
                expect(document.querySelector(".modal-body")).toBeDefined();
            });
    
            test("should handle corrupted image", () => {
                document.body.innerHTML = BillsUI({ data: [] }) +
                    '<div id="modaleFile"><div class="modal-body"></div></div>';
    
                const bills = new Bills({ document, onNavigate: jest.fn(), store: null, localStorage });
                const icon = document.createElement("div");
                icon.setAttribute("data-bill-url", "invalid-url");
    
                // Mock jQuery
                global.$ = jest.fn(() => ({
                    modal: jest.fn(),
                    find: jest.fn(() => ({
                        html: jest.fn()
                    }))
                }));
    
                bills.handleClickIconEye(icon);
    
                const modalBody = document.querySelector(".modal-body");
                expect(modalBody).toBeDefined();
                expect(modalBody.textContent).toContain("corrompu");
            });
        });
        */
});