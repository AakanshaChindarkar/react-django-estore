import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsTable from "./ProductsTable";
import { getAdminProducts, adminDeleteProduct } from "../../api";

// Mock API layer
jest.mock("../../api");

// Mock Modal to avoid rendering actual modal
jest.mock("./AddEditProductModal", () => (props) => (
  <div data-testid="mock-modal">
    {props.product && props.product.id ? "Edit Product" : "Add Product"}
  </div>
));

// Sample products
const productsMock = [
  { id: 1, name: "Product A", price: 100, stock: 10, description: "Desc A" },
  { id: 2, name: "Product B", price: 200, stock: 5, description: "Desc B" },
];

describe("ProductsTable Component", () => {
  let originalConfirm;

  beforeAll(() => {
    // Save original window.confirm
    originalConfirm = window.confirm;
  });

  afterAll(() => {
    // Restore original
    window.confirm = originalConfirm;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders loading, products table and Add button", async () => {
    getAdminProducts.mockResolvedValueOnce(productsMock);

    render(<ProductsTable />);

    // Loading row is shown first
    expect(screen.getByText(/loading products/i)).toBeInTheDocument();

    // Wait for products to appear
    const productA = await screen.findByText("Product A");
    const productB = await screen.findByText("Product B");

    expect(productA).toBeInTheDocument();
    expect(productB).toBeInTheDocument();

    // Add New Product button
    const addButton = screen.getByText(/\+ add new product/i);
    expect(addButton).toBeInTheDocument();

    // Clicking Add button opens modal
    await userEvent.click(addButton);
    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(screen.getByText(/add product/i)).toBeInTheDocument();
  });

  test("opens Edit modal for a product", async () => {
    getAdminProducts.mockResolvedValueOnce(productsMock);

    render(<ProductsTable />);

    await screen.findByText("Product A");

    const editButton = screen.getAllByText("Edit")[0];
    await userEvent.click(editButton);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(screen.getByText(/edit product/i)).toBeInTheDocument();
  });

  test("deletes a product and reloads table", async () => {
    // Initial load
    getAdminProducts.mockResolvedValueOnce(productsMock);
    // DELETE call
    adminDeleteProduct.mockResolvedValueOnce({});
    // Reload after deletion
    getAdminProducts.mockResolvedValueOnce([productsMock[1]]);

    render(<ProductsTable />);

    await screen.findByText("Product A");

    // Mock confirm dialog
    window.confirm = jest.fn(() => true);

    const deleteButton = screen.getAllByText("Delete")[0];
    await userEvent.click(deleteButton);

    // Product A should disappear
    await waitFor(() => {
      expect(screen.queryByText("Product A")).not.toBeInTheDocument();
    });

    // Product B should still exist
    expect(screen.getByText("Product B")).toBeInTheDocument();

    // Ensure API calls were made
    expect(adminDeleteProduct).toHaveBeenCalledWith(1);
    expect(getAdminProducts).toHaveBeenCalledTimes(2); // initial + reload
  });

  test("cancel delete does not call API", async () => {
    getAdminProducts.mockResolvedValueOnce(productsMock);

    render(<ProductsTable />);
    await screen.findByText("Product A");

    // Cancel deletion
    window.confirm = jest.fn(() => false);

    const deleteButton = screen.getAllByText("Delete")[0];
    await userEvent.click(deleteButton);

    expect(adminDeleteProduct).not.toHaveBeenCalled();
  });
});
