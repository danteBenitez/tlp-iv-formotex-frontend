import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthProvider from "./features/auth/context/provider";
import LoginPage from "./pages/auth/login";
import Home from "./pages/home";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/auth/login",
    index: true,
    element: <LoginPage />,
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
