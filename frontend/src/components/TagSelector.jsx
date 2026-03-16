import React, { useState, useEffect } from "react";

const TagSelector = ({ selectedTags, setSelectedTags, getTags, createTag }) => {
  const [allTags, setAllTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);

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
    setFilteredTags(
      allTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(lowerInput) &&
          !selectedTags.some((t) => t.id === tag.id)
      )
    );
  }, [inputValue, allTags, selectedTags]);

  const handleAddTag = async (tagName) => {
    // Check if tag already exists
    const existing = allTags.find(
      (t) => t.name.toLowerCase() === tagName.toLowerCase()
    );

    if (existing) {
      // Select existing tag
      if (!selectedTags.some((t) => t.id === existing.id)) {
        setSelectedTags([...selectedTags, existing]);
      }
    } else {
      // Create new tag
      try {
        const newTag = await createTag({ name: tagName }); // {id, name}
        setAllTags([...allTags, newTag]);
        setSelectedTags([...selectedTags, newTag]);
      } catch (err) {
        console.error("Failed to create tag:", err);
      }
    }

    setInputValue("");
  };

  const handleRemoveTag = (tagId) => {
    setSelectedTags(selectedTags.filter((t) => t.id !== tagId));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      handleAddTag(inputValue.trim());
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTags([...selectedTags, tag]);
    setInputValue("");
  };

  return (
    <div>
      <label>Tags</label>
      <div className="tag-input-container">
        {selectedTags.map((tag) => (
          <span key={tag.id} className="tag">
            {tag.name}{" "}
            <button type="button" onClick={() => handleRemoveTag(tag.id)}>
              ×
            </button>
          </span>
        ))}

        <input
          type="text"
          placeholder="Type or press Enter to add"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      {/* Show filtered tags dropdown */}
      {inputValue && filteredTags.length > 0 && (
        <div className="tag-dropdown">
          {filteredTags.map((tag) => (
            <div
              key={tag.id}
              className="tag-dropdown-item"
              onClick={() => handleTagClick(tag)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}

      {/* Show loading or 'create new tag' suggestion */}
      {loading && <small>Loading tags...</small>}
      {!loading && inputValue && filteredTags.length === 0 && (
        <small>Press Enter to create tag named : "{inputValue}"</small>
      )}
    </div>
  );
};

export default TagSelector;