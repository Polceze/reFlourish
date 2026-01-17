import React from "react";
import { Leaf, Map, BarChart3 } from "lucide-react";

const Sidebar = () => {
  return (
    <div className="w-80 bg-white shadow-xl flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary-500 rounded-lg">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ReFlourish</h1>
            <p className="text-sm text-gray-600">
              Ecosystem Restoration Platform
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="p-6 border-b border-gray-200">
        <nav className="space-y-2">
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-primary-600 bg-primary-50 rounded-lg">
            <Map className="w-5 h-5" />
            <span className="font-medium">Map Analysis</span>
          </button>
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            <BarChart3 className="w-5 h-5" />
            <span className="font-medium">Impact Dashboard</span>
          </button>
        </nav>
      </div>

      {/* Analysis Panel */}
      <div className="flex-1 p-6">
        <div className="text-center text-gray-500 mt-8">
          <Map className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <h3 className="font-medium mb-2">Select an Area</h3>
          <p className="text-sm">
            Draw a bounding box on the map to analyze ecosystem restoration
            potential
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="p-6 border-t border-gray-200">
        <div className="text-xs text-gray-500 text-center">
          <p>Hackathon MVP</p>
          <p>Phase 1: The Canvas</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
