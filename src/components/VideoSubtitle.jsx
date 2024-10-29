import { Main } from "./Main";
import { Navbar } from "./Navbar";
import { CustomVideoProvider } from "./VideoProvider";
export default function VideoSubtitle() {
  return (
    <CustomVideoProvider>
      <Navbar />
      <Main />
    </CustomVideoProvider>
  );
}
