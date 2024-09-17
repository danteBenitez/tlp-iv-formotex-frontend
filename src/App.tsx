import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./features/auth/context/provider";
import ThemeProvider from "./features/common/components/theme-provider";
import PrivateRoute from "./features/common/private-route";
import PublicRoute from "./features/common/public-route";
import InventoryLayout from "./layouts/inventory-layout";
import LoginPage from "./pages/auth/login";
import MakeTablePage from "./pages/dashboard/make-table";
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
        path: "/dashboard/makes",
        element: (
          <PrivateRoute>
            <MakeTablePage />
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
        <ThemeProvider>
          <RouterProvider router={router} />;
        </ThemeProvider>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
