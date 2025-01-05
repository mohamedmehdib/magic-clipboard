import { Barrio } from "next/font/google";
const ul = Barrio({ subsets: ["latin"], weight: "400" });

export default function page() {
  return (
    <div className={ul.className+" text-9xl h-screen bg-black text-blue-700 flex justify-center items-center"}>
        <link
        rel="stylesheet"
        href="https://unicons.iconscout.com/release/v4.0.8/css/line.css"
      ></link>
       <i className="uil uil-clipboard-notes"></i>
    </div>
  )
}
