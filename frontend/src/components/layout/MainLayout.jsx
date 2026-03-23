import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { TitleContext } from "./TitleContext";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main Content */}
        <div className="flex flex-col flex-1">

          {/* 🔥 TOP HEADER */}
          <div className="h-14 border-b flex items-center px-4 bg-white">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="mr-4 text-xl"
            >
              ☰
            </button>

            <h1 className="text-lg font-semibold text-gray-800">
              {title}
            </h1>
          </div>

          {/* Page Content */}
          <div className="flex-1 overflow-auto bg-gray-50">
            <Outlet />
          </div>

        </div>
      </div>
    </TitleContext.Provider>
  );
}