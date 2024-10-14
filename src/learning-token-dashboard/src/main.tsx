import React from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import "./index.css";
import AllRoutes from "./routes/index.tsx";
import { store } from "./store/index.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AllRoutes />
      <Toaster />
    </Provider>
  </React.StrictMode>
);
