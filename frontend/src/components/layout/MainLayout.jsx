import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar";
import { TitleContext } from "./TitleContext";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [title, setTitle] = useState("");
  const [topBarActions, setTopBarActions] = useState(null);

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      <div className="flex h-screen">

        {/* Sidebar */}
        <Sidebar collapsed={collapsed} />

        {/* Main Content */}
        <div className="flex flex-col flex-1 min-h-0">

          {/* Top Header */}
          <div className="h-14 border-b flex items-center px-4 bg-white justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setCollapsed(!collapsed)}
                className="text-xl"
              >
                ☰
              </button>

              {/* Page Title */}
              <h1 className="text-lg font-semibold text-gray-800">{title}</h1>
            </div>

            {/* Dynamic Top Bar Actions */}
            {topBarActions && (
              <div className="flex items-center gap-2">
                {topBarActions}
              </div>
            )}
          </div>

          {/* Page Content */}
          <div className="flex-1 min-h-0 bg-gray-50">
            <Outlet context={{ setTopBarActions }} />
          </div>

        </div>
      </div>
    </TitleContext.Provider>
  );
}