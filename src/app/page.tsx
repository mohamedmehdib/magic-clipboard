import Main from "./Main";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/Context/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="h-screen flex">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <Main />
        </div>
      </div>
    </ThemeProvider>
  );
}
