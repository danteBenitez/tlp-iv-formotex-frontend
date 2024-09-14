import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./features/auth/context/provider";
import PrivateRoute from "./features/common/private-route";
import PublicRoute from "./features/common/public-route";
import InventoryLayout from "./layouts/inventory-layout";
import LoginPage from "./pages/auth/login";
import RegisterPage from "./pages/auth/register";
import UsersTablePage from "./pages/dashboard/users-table";
import EquipmentFormPage from "./pages/equipment-form";
import EquipmentTypesPage from "./pages/equipment-types";
import InventoryPage from "./pages/inventory";
import OrganizationsPage from "./pages/organizations";

const router = createBrowserRouter([
  {
    path: "/",
    // TODO: Cambiar esto para representar una página principal
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/auth/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/auth/register",
    element: (
      <PublicRoute>
        <RegisterPage />
      </PublicRoute>
    ),
  },
  {
    path: "/dashboard",
    element: <InventoryLayout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute>
            <InventoryPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/users",
        element: (
          <PrivateRoute needsAdmin={true}>
            <UsersTablePage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/types",
        element: (
          <PrivateRoute>
            <EquipmentTypesPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/organizations",
        element: (
          <PrivateRoute>
            <OrganizationsPage />
          </PrivateRoute>
        ),
      },
      {
        path: "/dashboard/form/:equipmentId?",
        element: (
          <PrivateRoute>
            <EquipmentFormPage />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />;
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
