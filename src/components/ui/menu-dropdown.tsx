import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { createPortal } from 'react-dom';

export interface MenuDropdownItem {
  icon?: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive';
}

interface MenuDropdownProps {
  items: MenuDropdownItem[];
  align?: 'left' | 'right';
  triggerIcon?: React.ReactNode;
  triggerClassName?: string;
  dropdownClassName?: string;
}

export function MenuDropdown({
  items,
  align = 'right',
  triggerIcon = <MoreVertical className="h-4 w-4" />,
  triggerClassName,
  dropdownClassName,
}: MenuDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, right: 0 });

  const toggleDropdown = () => {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
      
      setDropdownPosition({
        top: rect.bottom + scrollY,
        left: align === 'left' ? rect.left + scrollX : 0,
        right: align === 'right' ? window.innerWidth - rect.right - scrollX : 0
      });
    }
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <Button 
        ref={triggerRef}
        variant="ghost" 
        size="icon" 
        className={cn("", triggerClassName)}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {triggerIcon}
      </Button>

      {isOpen && createPortal(
        <div 
          ref={dropdownRef}
          style={{
            position: 'absolute',
            top: `${dropdownPosition.top}px`,
            ...(align === 'left' 
              ? { left: `${dropdownPosition.left}px` } 
              : { right: `${dropdownPosition.right}px` }),
            zIndex: 9999,
          }}
          className={cn(
            "w-40 bg-background rounded-md shadow-md border",
            "py-1 overflow-hidden",
            dropdownClassName
          )}
        >
          {items.map((item, index) => (
            <button 
              key={index}
              onClick={() => { 
                item.onClick();
                setIsOpen(false);
              }}
              disabled={item.disabled}
              className={cn(
                "flex items-center w-full px-3 py-2 text-sm focus:outline-none",
                item.variant === 'destructive' 
                  ? "text-destructive hover:bg-destructive/10 focus:bg-destructive/10" 
                  : "hover:bg-muted focus:bg-muted",
                "disabled:opacity-50"
              )}
            >
              {item.icon && <span className="mr-2">{item.icon}</span>}
              {item.label}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
} 