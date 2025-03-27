
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { CheckCircle } from "lucide-react";

const JoinAsExpert = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex flex-col md:flex-row">
        <div className="w-full md:w-1/2 bg-accent p-8 md:p-16 flex items-center justify-center">
          <div className="max-w-md">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
              Join our network of trusted experts
            </h1>
            <p className="text-gray-600 mb-8">
              Connect with clients looking for your skills and expertise. Build your portfolio, set your own rates, and grow your business on emilist.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800">Get discovered</h3>
                  <p className="text-gray-600 text-sm">Showcase your work and skills to potential clients</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800">Set your hours</h3>
                  <p className="text-gray-600 text-sm">Work when you want, where you want</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle className="h-6 w-6 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-800">Earn more</h3>
                  <p className="text-gray-600 text-sm">Set your own competitive rates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex items-center justify-center">
          <div className="max-w-md w-full">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Create your expert profile</h2>
            <form className="space-y-4">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your full name"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your.email@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your phone number"
                />
              </div>
              
              <div>
                <label htmlFor="expertise" className="block text-sm font-medium text-gray-700 mb-1">
                  Area of Expertise
                </label>
                <select
                  id="expertise"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
                >
                  <option value="" disabled selected>Select your expertise</option>
                  <option value="carpentry">Carpentry</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="painting">Painting</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="cleaning">Cleaning</option>
                  <option value="other">Other</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience
                </label>
                <input
                  type="number"
                  id="experience"
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Years of experience"
                />
              </div>
              
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary text-white py-3 rounded-md hover:bg-primary/90 transition-colors duration-300 font-medium"
                >
                  Create Profile
                </button>
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                Already have an account? <Link to="/login" className="text-primary hover:text-primary/80">Log in</Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JoinAsExpert;
