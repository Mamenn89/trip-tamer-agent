import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import AnimatedBackground from '../components/AnimatedBackground';
import { Mail, Lock, UserPlus, LogIn, Chrome, CheckCircle } from 'lucide-react';
import { Provider } from '@supabase/supabase-js';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const { login, signup, signInWithOAuth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/planner');
    }
  }, [isAuthenticated, navigate]);

  // Get the appropriate redirect URL
  const getRedirectUrl = () => {
    // Use the production URL if available, otherwise use the current origin
    return import.meta.env.VITE_REDIRECT_URL || window.location.origin;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(email, password);
      toast({
        title: 'Login successful',
        description: 'Welcome back!',
        duration: 3000,
      });
      
      // Redirect to the planner page using the correct base URL
      const redirectUrl = getRedirectUrl();
      window.location.href = `${redirectUrl}/planner`;
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : 'Please check your credentials',
        variant: 'destructive',
        duration: 3000,
      });
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await signup(email, password);
      toast({
        title: 'Signup successful',
        description: 'Please check your email for a confirmation link.',
        duration: 3000,
      });
      
      setSignupSuccess(true);
      setSignupEmail(email);
      setEmail('');
      setPassword('');
      setIsSubmitting(false);
    } catch (error) {
      toast({
        title: 'Signup failed',
        description: error instanceof Error ? error.message : 'Please try again with a different email',
        variant: 'destructive',
        duration: 3000,
      });
      setIsSubmitting(false);
    }
  };

  const handleOAuthLogin = async (provider: Provider) => {
    try {
      setIsSubmitting(true);
      await signInWithOAuth(provider);
      // No need for toast or navigation here as Supabase will handle the redirect
    } catch (error) {
      toast({
        title: 'Login failed',
        description: error instanceof Error ? error.message : `Could not sign in with ${provider}`,
        variant: 'destructive',
        duration: 3000,
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen">

      <AnimatedBackground />
      <NavBar />

      <main className="container mx-auto px-4 py-20">
        {signupSuccess ? (
          <div className="max-w-md mx-auto text-center space-y-6 glass-panel backdrop-blur-md bg-blue-900/70 p-8 rounded-xl text-white shadow-lg">
            <div className="flex justify-center">
              <CheckCircle className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-2xl font-bold">Thank You for Registering!</h2>
            <p className="text-white/90">
              We've sent a confirmation link to <span className="font-medium underline">{signupEmail}</span>.
              Please check your email and click the link to verify your account.
            </p>
            <p className="text-white/80 text-sm">
              If you don't see the email, please check your spam folder.
            </p>
            <Button 
              className="mt-4 backdrop-blur-sm bg-transparent border border-white/50 hover:bg-white/10 text-white"
              onClick={() => {
                setSignupSuccess(false);
              }}
            >
              Return to Login
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="login" className="max-w-md mx-auto backdrop-blur-md bg-transparent rounded-xl p-8 shadow-lg border border-white/10">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <h2 className="text-2xl font-bold text-center mb-6">Login to Your Account</h2>
              
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  <LogIn className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Signing in...' : 'Sign In'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center"
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="signup">
              <h2 className="text-2xl font-bold text-center mb-6">Create Your Account</h2>
              
              <form onSubmit={handleSignup} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="signup-email" className="text-sm font-medium">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="signup-password" className="text-sm font-medium">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="pl-10"
                    />
                  </div>
                  <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                </div>

                <Button
                  type="submit"
                  className="w-full py-6 bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  <UserPlus className="w-5 h-5 mr-2" />
                  {isSubmitting ? 'Creating account...' : 'Create Account'}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or sign up with</span>
                  </div>
                </div>
                
                <div className="mt-6">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => handleOAuthLogin('google')}
                    disabled={isSubmitting}
                    className="w-full inline-flex justify-center items-center"
                  >
                    <Chrome className="w-5 h-5 mr-2" />
                    Google
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Login;
