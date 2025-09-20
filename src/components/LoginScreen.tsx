
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, Compass } from 'lucide-react';
import { toast } from 'sonner';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate a brief loading state
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        toast.success('Login successful!');
        onLogin();
      } else {
        setError('Invalid username or password. Please try again.');
        toast.error('Login failed. Please check your credentials.');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-warm-gray flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back to Home Link */}
        <Link 
          to="/" 
          className="inline-flex items-center text-text-medium hover:text-emerald-primary transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Compass className="h-8 w-8 text-emerald-primary" />
              <span className="text-2xl font-bold text-text-dark">Vastu Tool Kit</span>
            </div>
            <CardTitle className="text-2xl font-bold text-text-dark">
              Welcome Back
            </CardTitle>
            <p className="text-text-medium mt-2">Sign in to access your dashboard</p>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-text-medium">
              Don't have an account?{' '}
              <Link to="/register" className="text-emerald-primary hover:underline font-medium">
                Sign up here
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
      </div>
    </div>
  );
};
