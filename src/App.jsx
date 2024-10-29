import VideoSubtitle from "./components/VideoSubtitle";
import "primeicons/primeicons.css";
import { PrimeReactProvider } from "primereact/api";
import "primeflex/primeflex.css";
import "primereact/resources/primereact.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
function App() {
  return (
    <PrimeReactProvider>
      <div className="App">
        <VideoSubtitle />
      </div>
    </PrimeReactProvider>
  );
}

export default App;
