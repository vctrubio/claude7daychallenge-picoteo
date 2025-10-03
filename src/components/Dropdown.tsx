"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode | (({ closeDropdown }: { closeDropdown: () => void }) => ReactNode);
  align?: "left" | "right";
  disabled?: boolean;
}

export default function Dropdown({ trigger, children, align = "left", disabled = false }: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        isOpen
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleTriggerClick = () => {
    if (disabled) return;
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <button
        ref={triggerRef}
        onClick={handleTriggerClick}
        disabled={disabled}
        className="focus:outline-none"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {trigger}
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg min-w-48 ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          <div className="py-1" role="menu">
            {typeof children === "function" ? children({ closeDropdown }) : children}
          </div>
        </div>
      )}
    </div>
  );
}