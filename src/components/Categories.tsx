
import React from 'react';
import CategoryCard from './CategoryCard';
import { Wrench, Briefcase, Package, ClipboardList, Settings, 
         ConstructionIcon, PaintRollerIcon, CarIcon, ChefHatIcon, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Categories = () => {
  const navigate = useNavigate();
  
  const handleCategoryClick = (profession: string) => {
    navigate(`/?query=${profession}`);
  };
  
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-8 text-center">Service Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 staggered-fade-in">
          <CategoryCard 
            title="Mechanic" 
            icon={Wrench} 
            onClick={() => handleCategoryClick('mechanic')}
          />
          <CategoryCard 
            title="Developer" 
            icon={Briefcase} 
            onClick={() => handleCategoryClick('developer')}
          />
          <CategoryCard 
            title="Electrician" 
            icon={Settings} 
            onClick={() => handleCategoryClick('electrician')}
          />
          <CategoryCard 
            title="Plumber" 
            icon={Wrench} 
            onClick={() => handleCategoryClick('plumber')}
          />
          <CategoryCard 
            title="Carpenter" 
            icon={ConstructionIcon} 
            onClick={() => handleCategoryClick('carpenter')}
          />
          <CategoryCard 
            title="Painter" 
            icon={PaintRollerIcon} 
            onClick={() => handleCategoryClick('painter')}
          />
          <CategoryCard 
            title="Driver" 
            icon={CarIcon} 
            onClick={() => handleCategoryClick('driver')}
          />
          <CategoryCard 
            title="Cook" 
            icon={ChefHatIcon} 
            onClick={() => handleCategoryClick('cook')}
          />
          <CategoryCard 
            title="Bricklayer" 
            icon={ConstructionIcon} 
            onClick={() => handleCategoryClick('bricklayer')}
          />
          <CategoryCard 
            title="All Services" 
            icon={Users} 
            onClick={() => navigate('/categories/all-services')}
          />
        </div>
      </div>
    </section>
  );
};

export default Categories;
