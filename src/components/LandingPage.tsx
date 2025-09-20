import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Compass, Home, Shield, Zap, Users, CheckCircle } from 'lucide-react';

export const LandingPage = () => {
  const features = [
    {
      icon: Compass,
      title: "Vastu Direction Analysis",
      description: "Get precise directional guidance for optimal energy flow in your space."
    },
    {
      icon: Home,
      title: "Floor Plan Analysis",
      description: "Upload your floor plans and receive detailed Vastu compliance reports."
    },
    {
      icon: Shield,
      title: "Energy Protection",
      description: "Identify and correct negative energy zones in your home or office."
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get immediate analysis and recommendations for your spaces."
    }
  ];

  const reviews = [
    {
      name: "Priya Sharma",
      role: "Homeowner",
      rating: 5,
      text: "The Vastu Tool Kit helped me redesign my home layout. I've noticed improved harmony and positive energy flow."
    },
    {
      name: "Rajesh Kumar",
      role: "Architect",
      rating: 5,
      text: "As an architect, this tool has become invaluable for incorporating Vastu principles into my designs."
    },
    {
      name: "Anita Patel",
      role: "Interior Designer",
      rating: 5,
      text: "The detailed analysis and easy-to-use interface make this the best Vastu tool I've used."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-slate-800">Vastu Tool Kit</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-blue-600 transition-colors">Features</a>
              <a href="#reviews" className="text-slate-600 hover:text-blue-600 transition-colors">Reviews</a>
              <a href="#about" className="text-slate-600 hover:text-blue-600 transition-colors">About</a>
            </div>

            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Register</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-6 bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Compass className="w-4 h-4 mr-2" />
            Ancient Wisdom, Modern Technology
          </Badge>
          
          <h1 className="text-4xl lg:text-6xl font-bold text-slate-800 mb-6 leading-tight">
            Transform Your Space with
            <span className="text-blue-600 block">Vastu Principles</span>
          </h1>
          
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Analyze your floor plans, optimize energy flow, and create harmonious living spaces using time-tested Vastu Shastra principles with our advanced digital toolkit.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Start Free Analysis
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Login to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              Powerful Vastu Analysis Tools
            </h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need to create perfectly balanced and energetically optimized spaces
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <feature.icon className="w-8 h-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-800 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-slate-600">
              Join thousands of satisfied users who have transformed their spaces
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <CardTitle className="text-lg">{review.name}</CardTitle>
                  <p className="text-sm text-slate-500">{review.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600 italic">"{review.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            Ready to Transform Your Space?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Start your Vastu analysis today and create harmonious living environments
          </p>
          <Link to="/register">
            <Button size="lg" variant="secondary">
              Get Started Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Compass className="h-6 w-6" />
            <span className="text-xl font-bold">Vastu Tool Kit</span>
          </div>
          <p className="text-sm text-slate-300 mb-2">
            © 2024 Vastu Tool Kit. All rights reserved.
          </p>
          <p className="text-xs text-slate-400">
            Enhance your spaces with ancient Vastu principles
          </p>
        </div>
      </footer>
    </div>
  );
};