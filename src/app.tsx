import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Header } from "./components/headers/header.components";
import ErrorPage from "./error-page";
import PageHeaders from "./pages/headers";
import PageRadioButtons from "./pages/radiobuttons";
import Root from "./pages/root";
import Selectors from "./pages/selector";
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
  {
    path: "/selectors",
    element: <Selectors />,
    errorElement: <ErrorPage />,
  },
]);

export default function App() {
  return (
    <>
      <Header.Simple />
      <RouterProvider router={router} />;
    </>
  );
}
