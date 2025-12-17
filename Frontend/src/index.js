import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import SiteMetaProvider from "./components/SiteMetaProvider";

import { Provider } from "react-redux";
import Store from "./redux/store";

const root = createRoot(document.getElementById("root"));
root.render(
  <Provider store={Store}>
    <SiteMetaProvider>
      <App />
    </SiteMetaProvider>
  </Provider>
);

reportWebVitals();
