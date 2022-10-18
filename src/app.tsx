import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./error-page";
import PageHeaders from "./pages/headers";
import PageRadioButtons from "./pages/radiobuttons";
import Root from "./pages/root";
import Tables from "./pages/tables";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/headers",
    element: <PageHeaders />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/radio-buttons",
    element: <PageRadioButtons />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/tables",
    element: <Tables />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
