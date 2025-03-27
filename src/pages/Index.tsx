
import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Categories from '../components/Categories';
import { Worker } from '../services/db';
import { toast } from "sonner";
import { getCurrentUser } from '../utils/auth';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(getCurrentUser());

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    // Check if user is logged in
    setCurrentUser(getCurrentUser());

    // Welcome message for returning users
    if (currentUser) {
      const lastVisit = localStorage.getItem(`last_visit_${currentUser.id}`);
      if (lastVisit) {
        const timeSinceLastVisit = Date.now() - new Date(lastVisit).getTime();
        const daysSinceLastVisit = Math.floor(timeSinceLastVisit / (1000 * 60 * 60 * 24));
        
        if (daysSinceLastVisit > 0) {
          toast.success(`Welcome back, ${currentUser.name}!`, {
            description: `It's been ${daysSinceLastVisit} day(s) since your last visit.`,
          });
        } else {
          toast.success(`Welcome back, ${currentUser.name}!`);
        }
      }
      
      // Update last visit timestamp
      localStorage.setItem(`last_visit_${currentUser.id}`, new Date().toISOString());
    }

    return () => clearTimeout(timer);
  }, []);

  // Fade in the entire page once it's loaded
  useEffect(() => {
    if (!loading) {
      document.body.classList.add('loaded');
    }
  }, [loading]);

  return (
    <div className={`min-h-screen flex flex-col transition-opacity duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Categories />
      </main>
      <footer className="py-8 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Emilist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
