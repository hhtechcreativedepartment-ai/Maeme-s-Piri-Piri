'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface AccordionItem {
  id: string;
  question: string;
  answer: string;
}

interface AccordionProps {
  items: AccordionItem[];
}

export default function AccordionComponent({ items }: AccordionProps) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id}>
          <button
            onClick={() => setOpenId(openId === item.id ? null : item.id)}
            className="w-full flex items-center justify-between bg-white p-6 rounded-lg border-2 border-[#e8e0d5] hover:border-[#c41e3a] transition-colors group cursor-pointer"
          >
            <span className="font-bold text-[#2a1818] text-left">
              {item.question}
            </span>
            <ChevronDown 
              size={24} 
              className={`text-[#c41e3a] transition-transform ${openId === item.id ? 'rotate-180' : ''}`}
            />
          </button>
          {openId === item.id && (
            <div className="bg-[#f5f1e8] p-6 rounded-b-lg border-2 border-t-0 border-[#e8e0d5]">
              <p className="text-[#2a1818]">
                {item.answer}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
