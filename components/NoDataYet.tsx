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
        return <SearchX className="w-12 h-12 text-gray-400" strokeWidth={1.5}/>;
      case "assets":
        return <Package className="w-12 h-12 text-gray-400" strokeWidth={1.5}/>;
      case "users":
        return <Users className="w-12 h-12 text-gray-400" strokeWidth={1.5}/>;
      case "locations":
        return <MapPin className="w-12 h-12 text-gray-400" strokeWidth={1.5}/>;
      case "categories":
        return <FolderOpen className="w-12 h-12 text-gray-400" strokeWidth={1.5}/>;
      default:
        return <SearchX className="w-12 h-12 text-gray-400" strokeWidth={1.5}/>;
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 ${className} `}
    >
      <div className="flex flex-col items-center p-4 space-y-4 text-center bg-white rounded-2xl">
        {/* Icon */}
        <div className="flex items-center justify-center p-6 bg-gray-100 rounded-full">
          {getIcon()}
        </div>

        {/* Title */}
        <div>
          <h3 className="mb-2 text-lg font-semibold text-gray-900">{title}</h3>
          <p className="max-w-md text-sm text-gray-500">{message}</p>
        </div>

        {/* Optional search suggestion */}
        {showSearch && (
          <div className="p-3 mt-4 border border-blue-200 rounded-lg bg-blue-50">
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

