import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import React, { useState } from 'react';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import axios from '../../plugin/axios';
import './Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
  event.preventDefault();
  try {
    const response = await axios.post('login', {
      email,
      password,
    });
    console.log('Login successful:', response.data);
    // Handle successful login (e.g., redirect, store token, etc.)
  } catch (error) {
    console.error('Login failed:', error);
    // Handle login error (e.g., show error message)
  }
};
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-violet-700 via-purple-600 to-fuchsia-500">
      <Card className="w-full md:w-[90%] max-w-md p-8 space-y-6 bg-white/60 rounded-2xl shadow-2xl border border-gray-200 backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-2">
          {/* Animated Avatar */}
          <div className="relative flex items-center justify-center w-20 h-20 mb-2 rounded-full bg-gradient-to-tr from-violet-700 via-purple-600 to-fuchsia-500 shadow-lg">
            <div className="absolute inset-0 rounded-full animate-pulse bg-gradient-to-tr from-violet-700 via-purple-600 to-fuchsia-500 opacity-30 blur"></div>
            <span className="relative text-4xl font-bold text-white drop-shadow">FS</span>
          </div>
          <h2 className="text-3xl font-extrabold text-center text-gray-900 drop-shadow">Welcome Back</h2>
          <p className="text-sm text-gray-600 text-center">Sign in to your account</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
  Email
</Label>
<Input
  type="text"
  id="email"
  name="email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-fuchsia-400 focus:border-fuchsia-400 text-base bg-white/80"
  placeholder="Enter your email"
  autoComplete="email"
/>
            </div>
            <div>
              <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-3 mt-1 border border-gray-300 rounded-lg shadow-sm focus:ring-fuchsia-400 focus:border-fuchsia-400 text-base bg-white/80"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            <Button
              type="submit"
              className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-md  duration-200"
            >
              Login
            </Button>
            <div className="flex justify-end">
              <a href="#" className="text-xs text-fuchsia-500 hover:underline">
                Forgot password?
              </a>
            </div>
          </form>
        </CardContent>
      </Card>
      <p className="mt-6 text-sm text-white/80 drop-shadow">Developed by: Ryan Reyes</p>
      <div className="flex space-x-4 mt-3">
        <a href="#" className="rounded-full bg-white/30 backdrop-blur-md p-2 hover:bg-fuchsia-400/60 transition-colors shadow-lg">
          <Facebook size={22} className="text-violet-700" />
        </a>
        <a href="#" className="rounded-full bg-white/30 backdrop-blur-md p-2 hover:bg-fuchsia-400/60 transition-colors shadow-lg">
          <Instagram size={22} className="text-fuchsia-500" />
        </a>
        <a href="#" className="rounded-full bg-white/30 backdrop-blur-md p-2 hover:bg-fuchsia-400/60 transition-colors shadow-lg">
          <Twitter size={22} className="text-violet-400" />
        </a>
      </div>
    </div>
  );
};

export default Login;