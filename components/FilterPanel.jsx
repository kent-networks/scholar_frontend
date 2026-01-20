import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const FilterPanel = ({ filters = [], onSaveFilter, onSearchChange, onReset, initialSelected = {} }) => {
  const [selected, setSelected] = useState(initialSelected);
  const [searchText, setSearchText] = useState("");
  const [openGroups, setOpenGroups] = useState({});

  const toggleGroup = (i) => {
    setOpenGroups((prev) => ({ ...prev, [i]: !prev[i] }));
  };

  const handleSelect = (groupKey, value) => {
    setSelected((prev) => {
      const updatedGroup = new Set(prev[groupKey] || []);
      if (updatedGroup.has(value)) {
        updatedGroup.delete(value);
      } else {
        updatedGroup.add(value);
      }

      return {
        ...prev,
        [groupKey]: Array.from(updatedGroup),
      };
    });
  };

  const handleReset = () => {
    setSelected({});
    setSearchText("");
    if (onReset) onReset();
  };

  const handleSave = () => {
    if (onSaveFilter) {
      onSaveFilter(selected);
    }
  };

  const handleSearchInput = (e) => {
    const val = e.target.value;
    setSearchText(val);
    if (onSearchChange) onSearchChange(val);
  };

  const isVisible = (label) =>
    label.toLowerCase().includes(searchText.toLowerCase());

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-400">See results in your view based on the filters you select here.</div>
      {/* Search Bar */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          className="w-full text-sm p-2 border border-gray-300 rounded-lg focus:ring-[0.5px] focus:ring-[#560fd1] focus:border-transparent transition-all duration-300 outline-none focus:outline-none"
          placeholder="Search filters..."
          onChange={handleSearchInput}
          value={searchText}
        />
        <button
          className="text-sm px-3 py-2 text-[#172b4d] bg-gray-100 rounded-lg border-gray-300 hover:bg-gray-200"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {/* Filters */}
      {filters.map((group, i) => (
        <div key={i} className="rounded-lg border border-gray-100 bg-white">
          <button
            className="w-full flex items-center justify-between text-left p-3 rounded-sm hover:bg-gray-50 transition"
            onClick={() => toggleGroup(i)}
          >
            <span>{group.group}</span>
            <motion.div
              animate={{ rotate: openGroups[i] ? 180 : 0 }}
              transition={{ duration: 0.25 }}
            >
              <ChevronDown size={18} strokeWidth={1.8} />
            </motion.div>
          </button>

          <AnimatePresence initial={false}>
            {openGroups[i] && (
              <motion.div
                initial={{ height: "0", opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: "0", opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="p-3 space-y-3">
                  {/* Flat options */}
                  {group.options && (
                    <div className="flex flex-wrap gap-3">
                      {group.options
                        .filter((opt) => isVisible(opt.label))
                        .map((opt) => (
                          <label
                            key={opt.value}
                            className="flex items-center gap-2 text-sm whitespace-nowrap"
                          >
                            <input
                              type="checkbox"
                              className="accent-[#560fd1]"
                              checked={selected[group.group]?.includes(opt.value) || false}
                              onChange={() => handleSelect(group.group, opt.value)}
                            />
                            <span>{opt.label}</span>
                          </label>
                        ))}
                    </div>
                  )}

                  {/* Children (nested groups) */}
                  {group.children && (
                    <div className="space-y-4">
                      {group.children.map((child, j) => (
                        <div key={j}>
                          <div className="text-xs font-medium text-gray-600 mb-2">
                            {child.group}
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {child.options
                              .filter((opt) => isVisible(opt.label))
                              .map((opt) => (
                                <label
                                  key={opt.value}
                                  className="flex items-center gap-2 text-sm whitespace-nowrap"
                                >
                                  <input
                                    type="checkbox"
                                    className="accent-[#560fd1]"
                                    checked={selected[child.group]?.includes(opt.value) || false}
                                    onChange={() => handleSelect(child.group, opt.value)}
                                  />
                                  <span>{opt.label}</span>
                                </label>
                              ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      {/* Save Filter */}
      <div className="pt-2 flex justify-end">
        <button
          className="bg-[#560fd1] text-white py-2 px-4 rounded-md text-sm hover:bg-[#440db2] transition"
          onClick={handleSave}
        >
          Save Filter
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;