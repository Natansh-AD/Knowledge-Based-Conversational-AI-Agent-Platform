import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select...",
  labelKey = "name",
  valueKey = "name",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleOption = (value) => {
    const updated = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(updated);
  };

  const removeTag = (value, e) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== value));
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      {/* Selected Tags */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[40px] px-3 py-2 border rounded-md flex flex-wrap gap-1 cursor-pointer"
      >
        {selectedValues.length === 0 ? (
          <span className="text-gray-400">{placeholder}</span>
        ) : (
          selectedValues.map((val) => {
            const option = options.find((opt) => opt[valueKey] === val);
            return (
              <span
                key={val}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded"
              >
                {option ? option[labelKey] : val}
                <button
                  onClick={(e) => removeTag(val, e)}
                  className="text-gray-600 hover:text-black"
                >
                  ×
                </button>
              </span>
            );
          })
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border rounded-md shadow-lg">
          {options.map((opt) => {
            const label = opt[labelKey];
            const value = opt[valueKey];
            const isSelected = selectedValues.includes(value);

            return (
              <div
                key={value}
                onClick={() => toggleOption(value)}
                className={`px-3 py-2 cursor-pointer flex justify-between hover:bg-gray-100 ${
                  isSelected ? "bg-gray-100" : ""
                }`}
              >
                <span>{label}</span>
                {isSelected && <span>✓</span>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;