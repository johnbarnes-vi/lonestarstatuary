// src/components/common/CollapsibleSection.tsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

type MaxHeightProp = 'FULL_HEIGHT' | string;

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
    className?: string;
    maxHeight?: MaxHeightProp; // Accepts 'FULL_HEIGHT' or a string value
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
    title,
    children,
    className = '',
    maxHeight = '400px' // Default max height
}) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`border rounded-lg shadow-sm ${className}`}>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 rounded-t-lg"
          >
            <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
            <ChevronDown 
              className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                isExpanded ? '' : '-rotate-90'
              }`}
            />
          </button>
          <div
            className={`transition-all duration-200 ${
              isExpanded ? 'opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
            }`}
          >
            <div 
              className={`p-4 border-t ${maxHeight === 'FULL_HEIGHT' ? '' : 'overflow-y-auto'}`}
              style={{ maxHeight: maxHeight === 'FULL_HEIGHT' ? 'none' : maxHeight }}
            >
              {children}
            </div>
          </div>
        </div>
      );
    };