import Main from "./Main";
import Navbar from "./Navbar";
import { ThemeProvider } from "@/Context/ThemeContext";

export default function Home() {
  return (
    <ThemeProvider>
      <div className="h-screen">
        <Navbar />
        <Main />
      </div>
    </ThemeProvider>
  );
}
