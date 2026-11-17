import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import WhatsAppButton from "./WhatsAppButton";
import EnquiryPopup from "./EnquiryPopup";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <WhatsAppButton />
    <EnquiryPopup />
  </React.StrictMode>,
);
