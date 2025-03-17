
import React from 'react';
import { ModuleCollageData } from '@/data/moduleData';

interface ModuleCollageProps {
  data: ModuleCollageData;
  description?: string;
  variant?: number;
}

const ModuleCollage: React.FC<ModuleCollageProps> = ({ data, description, variant = 0 }) => {
  // Different layout variants for visual variety
  const layouts = [
    // Variant 0: Main photo right, screenshot bottom left, taglines spread
    "photo-right",
    // Variant 1: Photo top, screenshot right, taglines bottom
    "photo-top",
    // Variant 2: Photo left, screenshot bottom right, taglines top right
    "photo-left",
    // Variant 3: Screenshot centered right, photo left, taglines spread
    "screenshot-right"
  ];
  
  const layout = layouts[variant];
  
  return (
    <div className="w-full h-full relative p-4 flex flex-col">
      <div className="relative flex-grow">
        {/* Main photo */}
        <div className={`absolute rounded-xl overflow-hidden border-4 border-white shadow-lg ${
          layout === "photo-right" 
            ? "top-4 right-4 w-[60%] h-[60%]" 
            : layout === "photo-top" 
            ? "top-4 left-1/2 transform -translate-x-1/2 w-[80%] h-[50%]" 
            : layout === "photo-left" 
            ? "top-4 left-4 w-[55%] h-[70%]" 
            : "left-4 top-1/4 w-[50%] h-[60%]"
        }`}>
          <img 
            src={data.photo} 
            alt="Module visual" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Screenshot/UI mockup */}
        <div className={`absolute rounded-xl overflow-hidden border-4 border-white shadow-xl ${
          layout === "photo-right" 
            ? "bottom-4 left-4 w-[50%] h-[50%]" 
            : layout === "photo-top" 
            ? "bottom-4 right-4 w-[60%] h-[40%]" 
            : layout === "photo-left" 
            ? "bottom-4 right-4 w-[50%] h-[45%]" 
            : "right-4 top-4 w-[45%] h-[65%]"
        }`}>
          <img 
            src={data.screenshot} 
            alt="Module interface" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Tagline 1 */}
        <div className={`absolute bg-carmen-navy text-white px-5 py-3 rounded-full shadow-lg ${
          layout === "photo-right" 
            ? "top-1/4 left-8" 
            : layout === "photo-top" 
            ? "bottom-1/3 left-8" 
            : layout === "photo-left" 
            ? "top-8 right-8" 
            : "bottom-1/4 left-1/4"
        }`}>
          <p className="font-medium">{data.tagline1}</p>
        </div>
        
        {/* Tagline 2 */}
        <div className={`absolute bg-carmen-navy text-white px-5 py-3 rounded-full shadow-lg ${
          layout === "photo-right" 
            ? "bottom-1/3 right-1/4" 
            : layout === "photo-top" 
            ? "bottom-1/6 right-1/3" 
            : layout === "photo-left" 
            ? "top-1/3 right-1/6" 
            : "bottom-8 right-8"
        }`}>
          <p className="font-medium">{data.tagline2}</p>
        </div>
      </div>
      
      {/* Caption */}
      {description && (
        <div className="mt-2 p-2 bg-white/80 rounded-lg absolute bottom-2 left-4 right-4 backdrop-blur-sm">
          <p className="text-sm text-gray-700 italic text-center">{description}</p>
        </div>
      )}
    </div>
  );
};

export default ModuleCollage;
