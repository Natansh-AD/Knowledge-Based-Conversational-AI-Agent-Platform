import React, { useState, useEffect, useRef } from "react";

const TagSelector = ({ selectedTags, setSelectedTags, getTags, createTag }) => {
  const [allTags, setAllTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const containerRef = useRef(null);

  // Fetch all tags once
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        const data = await getTags(); // [{id, name}, ...]
        setAllTags(data);
        setFilteredTags(data);
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTags();
  }, [getTags]);

  // Filter tags based on input
  useEffect(() => {
    const lowerInput = inputValue.toLowerCase();
    const filtered = allTags.filter(
      (tag) =>
        tag.name.toLowerCase().includes(lowerInput) &&
        !selectedTags.some((t) => t.id === tag.id)
    );
    setFilteredTags(filtered);
    setIsDropdownOpen(inputValue.trim().length > 0);
    setHighlightedIndex(0);
  }, [inputValue, allTags, selectedTags]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddTag = async (tagName) => {
    // Avoid duplicates
    if (
      selectedTags.some((t) => t.name.toLowerCase() === tagName.toLowerCase()) ||
      allTags.some((t) => t.name.toLowerCase() === tagName.toLowerCase())
    ) {
      return;
    }

    try {
      const newTag = await createTag({ name: tagName });
      setAllTags([...allTags, newTag]);
      setSelectedTags([...selectedTags, newTag]);
    } catch (err) {
      console.error("Failed to create tag:", err);
    }

    setInputValue("");
    setIsDropdownOpen(false);
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!isDropdownOpen) return;
      const currentOption =
        highlightedIndex < filteredTags.length
          ? filteredTags[highlightedIndex]
          : { createNew: true, name: inputValue.trim() };
      if (currentOption.createNew) {
        handleAddTag(currentOption.name);
      } else {
        handleTagClick(currentOption);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev + 1 < filteredTags.length + 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : 0));
    } else if (e.key === "Escape") {
      setIsDropdownOpen(false);
    } else if (e.key === "Backspace" && inputValue === "") {
      // Remove last selected tag
      setSelectedTags(selectedTags.slice(0, -1));
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue("");
    setIsDropdownOpen(false);
  };

  return (
    <div className="w-full relative" ref={containerRef}>
      <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>

      <div className="flex flex-wrap gap-2 items-center min-h-[44px] px-2 py-1 border rounded-md focus-within:ring-2 focus-within:ring-gray-300 bg-white">
        {/* Selected Tags */}
        {selectedTags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm font-medium"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag.id)}
              className="ml-1 text-gray-500 hover:text-gray-700 rounded-full"
            >
              ×
            </button>
          </span>
        ))}

        {/* Input */}
        <input
          type="text"
          className="flex-1 min-w-[120px] py-1 px-2 outline-none text-sm"
          placeholder="Type to search or add tags"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
        />
      </div>

      {/* Dropdown */}
      {isDropdownOpen && (
        <div className="absolute left-0 right-0 mt-1 bg-white border rounded-md shadow-lg max-h-48 overflow-auto z-50 animate-fadeIn">
          {filteredTags.map((tag, index) => (
            <div
              key={tag.id}
              className={`px-3 py-2 text-sm cursor-pointer ${
                index === highlightedIndex ? "bg-gray-100" : ""
              }`}
              onMouseEnter={() => setHighlightedIndex(index)}
              onClick={() => handleTagClick(tag)}
            >
              {tag.name}
            </div>
          ))}

          {/* Create new tag option */}
          {inputValue.trim() !== "" && !allTags.some(t => t.name.toLowerCase() === inputValue.toLowerCase()) && (
            <div
              className={`px-3 py-2 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 ${
                highlightedIndex === filteredTags.length ? "bg-gray-100" : ""
              }`}
              onMouseEnter={() => setHighlightedIndex(filteredTags.length)}
              onClick={() => handleAddTag(inputValue.trim())}
            >
              Create new tag: <span className="font-medium">{inputValue}</span>
            </div>
          )}

          {loading && (
            <div className="px-3 py-2 text-sm text-gray-500">Loading tags...</div>
          )}
        </div>
      )}
    </div>
  );
};

export default TagSelector;