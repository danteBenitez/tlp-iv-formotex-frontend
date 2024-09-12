import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./features/auth/context/provider";
import PrivateRoute from "./features/common/private-route";
import PublicRoute from "./features/common/public-route";
import LoginPage from "./pages/auth/login";
import InventoryPage from "./pages/inventory";

const router = createBrowserRouter([
  {
    path: "/auth/login",
    element: (
      <PublicRoute>
        <LoginPage />
      </PublicRoute>
    ),
  },
  {
    path: "/inventory",
    element: (
      <PrivateRoute>
        <InventoryPage />
      </PrivateRoute>
    ),
  },
]);

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />;
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
