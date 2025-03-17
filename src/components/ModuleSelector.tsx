
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
      <p className="text-lg font-medium text-gray-800 mb-4">Select a module to learn more:</p>
      {modules.map((module) => (
        <Button
          key={module.id}
          variant="outline"
          className={`w-full justify-start text-left py-6 px-6 rounded-xl transition-all duration-300 ${
            activeTab === module.id 
              ? "bg-carmen-navy/5 border-carmen-navy border-2 text-carmen-navy shadow-md" 
              : "hover:bg-gray-50 text-gray-700 border-gray-200"
          }`}
          onClick={() => setActiveTab(module.id)}
        >
          <div className="flex items-center gap-4">
            <div className={`rounded-full p-2 ${activeTab === module.id ? 'bg-carmen-navy text-white' : 'bg-gray-100 text-gray-600'}`}>
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
