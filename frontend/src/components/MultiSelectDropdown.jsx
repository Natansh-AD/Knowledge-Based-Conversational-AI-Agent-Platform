import React, { useState, useRef, useEffect } from "react";

const MultiSelectDropdown = ({
  options = [],
  selectedValues = [],
  onChange,
  placeholder = "Select...",
  labelKey = "name",
  valueKey = "id",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef();
  const inputRef = useRef();

  // Filter options based on search and exclude selected
  const filteredOptions = options.filter(
    (opt) =>
      opt[labelKey].toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedValues.includes(opt[valueKey])
  );

  // Handle outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setHighlightedIndex(0);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      const option = filteredOptions[highlightedIndex];
      if (option) handleSelect(option);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    } else if (e.key === "Backspace" && searchTerm === "" && selectedValues.length) {
      onChange(selectedValues.slice(0, -1));
    }
  };

  const handleSelect = (option) => {
    onChange([...selectedValues, option[valueKey]]);
    setSearchTerm(""); // clear search after selection
    setHighlightedIndex(0);
    inputRef.current?.focus();
  };

  const removeTag = (value) => {
    onChange(selectedValues.filter((v) => v !== value));
  };

  // Scroll highlighted into view
  useEffect(() => {
    const list = document.getElementById("dropdown-list");
    if (list) {
      const item = list.children[highlightedIndex];
      if (item) item.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div
        className="w-full min-h-[40px] px-2 py-2 border rounded-md flex flex-wrap items-center gap-1 cursor-text hover:border-gray-400"
        onClick={() => {
          setIsOpen(true);
          inputRef.current?.focus();
        }}
      >
        {selectedValues.map((val) => {
          const option = options.find((opt) => opt[valueKey] === val);
          return (
            <span
              key={val}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-200 rounded-full"
            >
              {option ? option[labelKey] : val}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(val);
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                ×
              </button>
            </span>
          );
        })}

        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={selectedValues.length === 0 ? placeholder : ""}
          className="flex-1 min-w-[120px] px-1 py-1 border-none outline-none text-sm"
        />
      </div>

      {isOpen && (
        <div
          id="dropdown-list"
          className="absolute z-50 mt-1 w-full max-h-60 overflow-auto bg-white border rounded-md shadow-lg scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
        >
          {filteredOptions.length > 0 ? (
            filteredOptions.map((opt, index) => {
              const label = opt[labelKey];
              const value = opt[valueKey];
              const isHighlighted = index === highlightedIndex;

              return (
                <div
                  key={value}
                  onClick={() => handleSelect(opt)}
                  className={`px-3 py-2 cursor-pointer flex justify-between items-center ${
                    isHighlighted ? "bg-gray-200" : "hover:bg-gray-50"
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  <span>{label}</span>
                  {selectedValues.includes(value) && <span>✓</span>}
                </div>
              );
            })
          ) : (
            <div className="px-3 py-2 text-gray-400">No options found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default MultiSelectDropdown;