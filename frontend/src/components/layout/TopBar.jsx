import React from "react";
import { useTitle } from "./TitleContext";

/**
 * TopBar shows the current page title and optional actions.
 * Props:
 * - actions: React node(s) to render on the right side
 */
export default function TopBar({ actions }) {
  const { title } = useTitle();

  return (
    <div className="flex justify-between items-center mb-6 p-4 bg-white shadow rounded-md">
      <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}