import { Provider } from "react-redux";
import { store } from "./store/store";
import "./index.css";
import AppContent from "./AppContent";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </Provider>
  );
}

export default App;
