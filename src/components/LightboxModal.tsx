import React from 'react';
import { GalleryItem } from '../types';
import { X } from 'lucide-react';

interface LightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="max-w-4xl w-full bg-[#fef9f2] border border-[#d4c3bd] p-4 sm:p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-[#3C2117] text-white hover:bg-[#504440] transition-colors cursor-pointer"
          aria-label="Close image"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="aspect-[16/10] w-full overflow-hidden bg-[#e6e2dc] mb-4">
          <img
            src={item.imageUrl}
            alt={item.altText}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex justify-between items-center font-['Inter'] px-2">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#84523e] font-semibold block">
              {item.category}
            </span>
            <h3 className="font-['Plus_Jakarta_Sans'] text-lg text-[#3C2117] font-medium">
              {item.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-[#504440] uppercase tracking-widest hover:text-[#3C2117]"
          >
            Close View
          </button>
        </div>
      </div>
    </div>
  );
};
