import React from "react";
import { SearchX, Package, Users, MapPin, FolderOpen } from "lucide-react";

interface NoDataYetProps {
  title?: string;
  message?: string;
  icon?: "search" | "assets" | "users" | "locations" | "categories";
  showSearch?: boolean;
  className?: string;
}

const NoDataYet: React.FC<NoDataYetProps> = ({
  title = "No data found",
  message = "Try adjusting your search or filter criteria",
  icon = "search",
  showSearch = true,
  className = "",
}) => {
  const getIcon = () => {
    switch (icon) {
      case "search":
        return <SearchX className="w-12 h-12 text-gray-400" />;
      case "assets":
        return <Package className="w-12 h-12 text-gray-400" />;
      case "users":
        return <Users className="w-12 h-12 text-gray-400" />;
      case "locations":
        return <MapPin className="w-12 h-12 text-gray-400" />;
      case "categories":
        return <FolderOpen className="w-12 h-12 text-gray-400" />;
      default:
        return <SearchX className="w-12 h-12 text-gray-400" />;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className} `}
    >
      <div className="flex flex-col items-center space-y-4 text-center bg-white rounded-2xl p-4">
        {/* Icon */}
        <div className="flex items-center justify-center p-6 rounded-full bg-gray-100">
          {getIcon()}
        </div>

        {/* Title */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 max-w-md">{message}</p>
        </div>

        {/* Optional search suggestion */}
        {showSearch && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700">
              💡 Try searching with different keywords or clearing your filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoDataYet;

