import Main from "./Main";
import Navbar from "./Navbar";

export default function Home() {
  return (
    <div className="h-screen bg-black text-white flex">
      <Navbar />
      <div className="flex-1 overflow-y-auto">
        <Main />
      </div>
    </div>
  );
}
