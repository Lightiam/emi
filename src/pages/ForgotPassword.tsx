
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { Mail, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // For demo purposes we'll just simulate the request
      // In a real app, you would make an API call to your backend
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem('emilist_users') || '[]');
        const user = users.find((u: any) => u.email === email);
        
        if (user) {
          setIsSubmitted(true);
          toast.success('Password reset link sent');
        } else {
          toast.error('No account found with this email');
        }
        
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      toast.error('An error occurred');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-primary mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to login
          </Link>
          
          {!isSubmitted ? (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Forgot Password</h1>
                <p className="text-gray-600 mt-2">
                  Enter your email and we'll send you a link to reset your password
                </p>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full py-2 bg-primary" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </Button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h2>
              <p className="text-gray-600 mb-6">
                We sent a password reset link to<br />
                <span className="font-medium">{email}</span>
              </p>
              <Button 
                type="button" 
                className="w-full py-2 bg-primary"
                onClick={() => window.location.href = '/login'}
              >
                Back to Login
              </Button>
              <p className="mt-4 text-sm text-gray-500">
                Didn't receive the email?{' '}
                <button 
                  type="button" 
                  className="text-primary hover:underline"
                  onClick={() => {
                    setIsSubmitted(false);
                    toast.info("You can try again with a different email");
                  }}
                >
                  Click to try again
                </button>
              </p>
            </div>
          )}
        </div>
      </main>
      
      <footer className="py-4 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Emilist. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default ForgotPassword;
