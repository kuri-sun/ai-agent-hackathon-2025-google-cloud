import { useState, useEffect, useRef } from "react";
import { twMerge } from "tailwind-merge";

function Dropdown({
  items = [],
  children,
}: {
  items: {
    label: string;
    value: string;
    className: string;
    onClick: (value: string) => void;
  }[];
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative inline-flex">
      <button
        onClick={toggleDropdown}
        // className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {children}
      </button>
      {isOpen && (
        <div className="absolute top-8 right-0 mt-2 p-2 bg-white dark:bg-neutral-800 border border-gray-200 rounded shadow-md">
          <ul className="">
            {items.map((item) => (
              <li key={item.value}>
                <button
                  onClick={() => {
                    toggleDropdown();
                    item.onClick(item.value);
                  }}
                  className={twMerge(
                    "block px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-black/60 w-full text-left",
                    item.className
                  )}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dropdown;
