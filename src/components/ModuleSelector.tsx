
import React from 'react';
import { Button } from '@/components/ui/button';
import { Module } from '@/data/moduleData';

interface ModuleSelectorProps {
  modules: Module[];
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const ModuleSelector: React.FC<ModuleSelectorProps> = ({ modules, activeTab, setActiveTab }) => {
  return (
    <div className="space-y-4 fade-in-up">
      <p className="text-lg font-medium text-[#0049a4] mb-4">Select a module to learn more:</p>
      {modules.map((module) => (
        <Button
          key={module.id}
          variant="outline"
          className={`w-full justify-start text-left py-6 px-6 rounded-2xl transition-all duration-300 ${
            activeTab === module.id 
              ? "bg-white border-[#0069e4] border-2 text-[#0049a4] shadow-md" 
              : "hover:bg-white text-gray-700 border-white/50 bg-white/50"
          }`}
          onClick={() => setActiveTab(module.id)}
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-2.5 ${activeTab === module.id ? 'bg-[#0069e4] text-white' : 'bg-[#bbc1ff]/30 text-[#0069e4]'}`}>
              {module.icon}
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">{module.title}</h3>
              <p className="text-sm opacity-80 line-clamp-2">{module.description}</p>
            </div>
          </div>
        </Button>
      ))}
    </div>
  );
};

export default ModuleSelector;
