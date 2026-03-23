import { useState } from "react";
import Sidebar from "../Sidebar";

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />

      {/* Main Section */}
      <div className="flex flex-col flex-1">
        
        {/* 🔥 TOP HEADER */}
        <div className="h-14 border-b flex items-center px-4 bg-white">
          {/* Drawer Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="mr-4 text-xl"
          >
            ☰
          </button>

          {/* Dynamic Title */}
          <h1 className="text-lg font-semibold text-gray-800">
            {title}
          </h1>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto bg-gray-50">
          {/* 👇 Inject setTitle into pages */}
          {children(setTitle)}
        </div>
      </div>
    </div>
  );
}