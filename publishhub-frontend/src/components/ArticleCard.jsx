import { FaEye, FaEdit, FaTrash, FaUser, FaCalendarAlt } from "react-icons/fa";
import { getStatusColor, formatDate } from "../utils/helpers";

const ArticleCard = ({ article, onView, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-4 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-800 mb-2">
            {article.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <FaUser className="mr-1" size={12} />
            <span className="mr-3">{article.author?.name}</span>
            <FaCalendarAlt className="mr-1" size={12} />
            <span>{formatDate(article.created_at)}</span>
          </div>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(article.status)}`}
        >
          {article.status.replace("_", " ")}
        </span>
      </div>

      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
        {article.content?.substring(0, 150)}...
      </p>

      <div className="flex gap-2">
        <button
          onClick={() => onView(article.id)}
          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 text-sm font-medium flex items-center transition-all duration-200"
        >
          <FaEye className="mr-2" /> View
        </button>
        {onEdit && (
          <button
            onClick={() => onEdit(article.id)}
            className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 text-sm font-medium flex items-center transition-all duration-200"
          >
            <FaEdit className="mr-2" /> Edit
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(article.id)}
            className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 text-sm font-medium flex items-center transition-all duration-200"
          >
            <FaTrash className="mr-2" /> Delete
          </button>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
