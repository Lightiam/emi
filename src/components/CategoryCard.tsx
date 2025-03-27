
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface CategoryCardProps {
  title: string;
  icon: LucideIcon;
  onClick?: () => void;
  href?: string;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon: Icon, onClick, href }) => {
  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault();
      onClick();
    }
  };

  const content = (
    <div className="category-card flex flex-col items-center text-center p-6 group cursor-pointer">
      <div className="category-icon group-hover:scale-110 transition-transform duration-300">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold text-gray-800 mt-2 group-hover:text-primary transition-colors duration-300">
        {title}
      </h3>
    </div>
  );

  if (href) {
    return (
      <a href={href} onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <div onClick={handleClick}>
      {content}
    </div>
  );
};

export default CategoryCard;
