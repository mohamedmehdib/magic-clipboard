"use client";
import React, { useState } from "react";
import UploadText from "./UploadText";
import List from "./List";

export default function Main() {
  
  return (
    <div className="bg-black min-h-screen md:w-4/5 md:float-right space-y-5">
        <UploadText/>
        <List/>
    </div>
  );
}
