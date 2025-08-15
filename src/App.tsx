import { Provider } from "react-redux";
import { store,persistor } from "./store/store";
import "./index.css";
import AppContent from "./AppContent";
import { BrowserRouter } from "react-router-dom";
import { PersistGate } from "redux-persist/integration/react";


function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
