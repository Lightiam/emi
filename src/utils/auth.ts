
export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

// Initialize local storage with some demo users if none exist
export const initializeAuth = () => {
  if (!localStorage.getItem('emilist_users')) {
    const initialUsers = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        createdAt: new Date().toISOString()
      }
    ];
    localStorage.setItem('emilist_users', JSON.stringify(initialUsers));
  }
};

// Get current user
export const getCurrentUser = (): User | null => {
  const userJson = localStorage.getItem('emilist_current_user');
  return userJson ? JSON.parse(userJson) : null;
};

// Log out
export const logout = () => {
  localStorage.removeItem('emilist_current_user');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};
