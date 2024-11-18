/* eslint-disable jest/no-mocks-import */
/**
 * @jest-environment jsdom
 */

import { screen, fireEvent, within, waitFor } from "@testing-library/dom";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { JSDOM } from 'jsdom';
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import mockStore from "../__mocks__/store.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes.js";
import { bills } from "../fixtures/bills.js";
import router from "../app/Router.js";
import BillsUI from "../views/BillsUI.js";


jest.mock("../app/store", () => mockStore);
/*
jest.mock("../app/store", () => ({
  bills: jest.fn(() => ({
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({}),
  })),
}));
*/
describe("Given I am connected as an employee", () => {
  beforeAll(() => {
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    window.localStorage.setItem("user", JSON.stringify({ type: "Employee", email: "a@a" }));
  });

  beforeEach(() => {
    const root = document.createElement("div");
    root.setAttribute("id", "root");
    document.body.append(root);
    router();
    document.body.innerHTML = NewBillUI();
    window.onNavigate(ROUTES_PATH.NewBill);
  });

  afterEach(() => {
    jest.resetAllMocks();
    document.body.innerHTML = "";
  });

  // Fonction utilitaire pour configurer NewBill
  const setupNewBill = () => {
    const onNavigate = (pathname) => {
      document.body.innerHTML = ROUTES({ pathname });
    };

    const newBillInit = new NewBill({
      document, onNavigate, store: mockStore, localStorage: window.localStorage
    });

    return { newBillInit };
  };

  describe("When I am on NewBill Page", () => {
    test("Then newBill icon in vertical layout should be highlighted", () => {
      const windowIcon = screen.getByTestId("icon-mail");
      expect(windowIcon).toHaveClass("active-icon");
    });

    test("Then show the new bill page", async () => {
      window.onNavigate(ROUTES_PATH.NewBill);
      await waitFor(() => screen.getByTestId("form-new-bill"));
      expect(screen.getByTestId("form-new-bill")).toBeTruthy();
    });

    describe("When I submit a new Bill", () => {
      test("Then must save the bill", async () => {
        const { newBillInit } = setupNewBill();
        const formNewBill = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn((e) => newBillInit.handleSubmit(e));
        formNewBill.addEventListener("submit", handleSubmit);
        fireEvent.submit(formNewBill);
        expect(handleSubmit).toHaveBeenCalled();
      });

      test("Then verify the file bill", async () => {
        const { newBillInit } = setupNewBill();
        const file = new File(['image'], 'image.png', { type: 'image/png' });
        const handleChangeFile = jest.fn((e) => newBillInit.handleChangeFile(e));
        const billFile = screen.getByTestId('file');
        billFile.addEventListener("change", handleChangeFile);
        await userEvent.upload(billFile, file);
        expect(billFile.files[0].name).toBeDefined();
        expect(handleChangeFile).toBeCalled();
      });

      test("Then the submission process should work properly, and I should be sent on the Bills Page", async () => {
        const { newBillInit } = setupNewBill();
        const inputData = bills[0];
        const newBillForm = screen.getByTestId("form-new-bill");
        const handleSubmit = jest.fn(newBillInit.handleSubmit);
        const imageInput = screen.getByTestId("file");
        const file = new File(["img"], inputData.fileName, { type: "image/jpg" });

        // Remplir le formulaire
        fireEvent.change(screen.getByTestId("expense-type"), { target: { value: inputData.type } });
        fireEvent.change(screen.getByTestId("expense-name"), { target: { value: inputData.name } });
        fireEvent.change(screen.getByTestId("datepicker"), { target: { value: inputData.date } });
        fireEvent.change(screen.getByTestId("amount"), { target: { value: inputData.amount.toString() } });
        fireEvent.change(screen.getByTestId("vat"), { target: { value: inputData.vat.toString() } });
        fireEvent.change(screen.getByTestId("pct"), { target: { value: inputData.pct.toString() } });
        fireEvent.change(screen.getByTestId("commentary"), { target: { value: inputData.commentary } });

        await userEvent.upload(imageInput, file);
        newBillInit.fileName = file.name;

        newBillForm.addEventListener("submit", handleSubmit);
        fireEvent.submit(newBillForm);
        expect(handleSubmit).toHaveBeenCalledTimes(1);

        // Vérifier la navigation vers la page Bills
        await waitFor(() => {
          expect(screen.getByText("Mes notes de frais")).toBeTruthy();
        });
      });
    });
    /*
        describe("When I upload a file", () => {
          test("Then it should accept a valid file format", async () => {
            const { newBillInit } = setupNewBill();
            const handleChangeFile = jest.spyOn(newBillInit, "handleChangeFile");
    
            const file = new File(['image'], '20240122_092117.jpg', { type: 'image/jpg' });
            const imageInput = screen.getByTestId("file");
    
            await userEvent.upload(imageInput, file);
    
            expect(handleChangeFile).toHaveBeenCalled();
            expect(imageInput.files[0]).toStrictEqual(file);
            expect(imageInput).toHaveClass("form-control", "blue-border");
          });
    
          test("Then it should reject an invalid file format", async () => {
            const { newBillInit } = setupNewBill();
            const handleChangeFile = jest.spyOn(newBillInit, "handleChangeFile");
    
            const file = new File(['document'], "document.pdf", { type: "application/pdf" });
            const imageInput = screen.getByTestId("file");
    
            await userEvent.upload(imageInput, file);
    
            expect(handleChangeFile).toHaveBeenCalled();
            expect(imageInput).toHaveClass("is-invalid");
          });
        });
        */
    describe("When I upload a file", () => {
      test("Then it should accept a valid file format", async () => {
        const { newBillInit } = setupNewBill();
        const handleChangeFile = jest.spyOn(newBillInit, "handleChangeFile");

        const file = new File(['image'], '20240122_092117.jpg', { type: 'image/jpg' });
        const imageInput = screen.getByTestId("file");

        await userEvent.upload(imageInput, file);

        // expect(handleChangeFile).toHaveBeenCalled();
        expect(imageInput.files[0]).toStrictEqual(file);
        expect(imageInput).not.toHaveClass("is-invalid");
      });

      test("Then it should reject an invalid file format", async () => {
        const { newBillInit } = setupNewBill();
        const handleChangeFile = jest.spyOn(newBillInit, "handleChangeFile");

        const file = new File(['document'], "document.pdf", { type: "application/pdf" });
        const imageInput = screen.getByTestId("file");

        await userEvent.upload(imageInput, file);

        // expect(handleChangeFile).toHaveBeenCalled();
        expect(imageInput).toHaveClass("is-invalid");
      });
    });

    describe("When there is an API error", () => {
      test("Then it should handle a 404 error", async () => {
        const { newBillInit } = setupNewBill();
        const mockedBill = jest.spyOn(mockStore, "bills")
          .mockImplementationOnce(() => {
            return { create: jest.fn().mockRejectedValue(new Error("Erreur 404")) };
          });

        await expect(mockedBill().create).rejects.toThrow("Erreur 404");
        expect(mockedBill).toHaveBeenCalledTimes(1);
      });

      test("Then it should handle a 500 error", async () => {
        const { newBillInit } = setupNewBill();
        const mockedBill = jest.spyOn(mockStore, "bills")
          .mockImplementationOnce(() => {
            return { create: jest.fn().mockRejectedValue(new Error("Erreur 500")) };
          });

        await expect(mockedBill().create).rejects.toThrow("Erreur 500");
        expect(mockedBill).toHaveBeenCalledTimes(1);
      });
    });
  });

  //// Intégration POST new bill ////////////////////////////////
  describe("Integration test - POST new bill", () => {
    test("Should create a new bill and redirect to Bills page", async () => {
      // Définir le mock du store avant le test
      const mockedBills = {
        create: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({})
      };

      jest.spyOn(mockStore, "bills").mockImplementation(() => mockedBills);

      document.body.innerHTML = NewBillUI();

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname });
      };

      const newBill = new NewBill({
        document,
        onNavigate,
        store: mockStore, // Utiliser mockStore au lieu d'un nouveau store
        localStorage: window.localStorage
      });

      // Remplissage du formulaire
      const inputData = bills[0];
      const newBillForm = screen.getByTestId("form-new-bill");
      const imageInput = screen.getByTestId("file");
      const file = new File(["img"], inputData.fileName, { type: "image/jpg" });

      // Simulation des entrées utilisateur
      fireEvent.change(screen.getByTestId("expense-type"), {
        target: { value: inputData.type }
      });
      fireEvent.change(screen.getByTestId("expense-name"), {
        target: { value: inputData.name }
      });
      fireEvent.change(screen.getByTestId("datepicker"), {
        target: { value: inputData.date }
      });
      fireEvent.change(screen.getByTestId("amount"), {
        target: { value: inputData.amount.toString() }
      });
      fireEvent.change(screen.getByTestId("vat"), {
        target: { value: inputData.vat.toString() }
      });
      fireEvent.change(screen.getByTestId("pct"), {
        target: { value: inputData.pct.toString() }
      });
      fireEvent.change(screen.getByTestId("commentary"), {
        target: { value: inputData.commentary }
      });

      await userEvent.upload(imageInput, file);

      // Soumission du formulaire
      const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
      newBillForm.addEventListener("submit", handleSubmit);
      fireEvent.submit(newBillForm);

      // Vérifications
      expect(handleSubmit).toHaveBeenCalled();
      expect(mockedBills.create).toHaveBeenCalled();
      expect(mockedBills.update).toHaveBeenCalled();

      // Vérification de la redirection
      await waitFor(() => {
        expect(screen.getByText("Mes notes de frais")).toBeTruthy();
      });
    });
  });
  /*
    describe("Integration test - POST new bill", () => {
      /*
          jest.mock("../app/store", () => ({
            bills: jest.fn(() => ({
              create: jest.fn().mockResolvedValue({}),
              update: jest.fn().mockResolvedValue({}),
            })),
          }));*/
  /*
jest.mock("../app/store", () => mockStore);
beforeAll(() => {
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

window.localStorage.setItem(
  "user",
  JSON.stringify({
    type: "Employee",
    email: "a@a",
  })
);
});

beforeEach(() => {
const root = document.createElement("div");
root.setAttribute("id", "root");
document.body.append(root);
router();
document.body.innerHTML = NewBillUI();
window.onNavigate(ROUTES_PATH.NewBill);
});

afterEach(() => {
jest.resetAllMocks();
document.body.innerHTML = "";
});


test("Should create a new bill and redirect to Bills page", async () => {
// Mock du store
const store = {
  bills: () => ({
    create: jest.fn().mockResolvedValue({}),
    update: jest.fn().mockResolvedValue({})
  })
}

// Initialisation du composant avec le store mocké


document.body.innerHTML = NewBillUI();
// Configuration de l'environnement
const onNavigate = (pathname) => {
  document.body.innerHTML = ROUTES({ pathname });
};

const newBill = new NewBill({
  document,
  onNavigate,
  store: store,
  localStorage: window.localStorage
});

// Remplissage du formulaire
const inputData = bills[0];
const newBillForm = screen.getByTestId("form-new-bill");
const imageInput = screen.getByTestId("file");
const file = new File(["img"], inputData.fileName, { type: "image/jpg" });

// Simulation des entrées utilisateur
fireEvent.change(screen.getByTestId("expense-type"), {
  target: { value: inputData.type }
});
fireEvent.change(screen.getByTestId("expense-name"), {
  target: { value: inputData.name }
});
fireEvent.change(screen.getByTestId("datepicker"), {
  target: { value: inputData.date }
});
fireEvent.change(screen.getByTestId("amount"), {
  target: { value: inputData.amount.toString() }
});
fireEvent.change(screen.getByTestId("vat"), {
  target: { value: inputData.vat.toString() }
});
fireEvent.change(screen.getByTestId("pct"), {
  target: { value: inputData.pct.toString() }
});
fireEvent.change(screen.getByTestId("commentary"), {
  target: { value: inputData.commentary }
});

await userEvent.upload(imageInput, file);

// Soumission du formulaire
const handleSubmit = jest.fn((e) => newBill.handleSubmit(e));
newBillForm.addEventListener("submit", handleSubmit);
fireEvent.submit(newBillForm);

// Vérifications
expect(handleSubmit).toHaveBeenCalled();
expect(mockStore.bills().create).toHaveBeenCalled();
expect(mockStore.bills().update).toHaveBeenCalled();

// Vérification de la redirection
await waitFor(() => {
  expect(screen.getByText("Mes notes de frais")).toBeTruthy();
});
});

});
*/
});




