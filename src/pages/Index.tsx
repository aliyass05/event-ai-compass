
import React from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import NavBar from "@/components/NavBar";
import { useAuth } from "@/context/AuthContext";
import { CalendarCheck, Book, Star, Users } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
        <div className="container flex flex-col items-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
            Discover Academic Events Tailored to <span className="text-primary">You</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mb-8">
            EventAICompass helps university students discover events that match their academic interests, 
            powered by AI recommendations based on your transcript.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={() => navigate("/events")}>
              Browse Events
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate(isAuthenticated ? "/recommended" : "/login")}
            >
              {isAuthenticated ? "Get Recommendations" : "Sign In & Get Started"}
            </Button>
          </div>
        </div>
      </section>

      <section className="py-16 container">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Book className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Upload Transcript</h3>
            <p className="text-muted-foreground">
              Submit your academic transcript to help our AI understand your interests
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Star className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Get Recommendations</h3>
            <p className="text-muted-foreground">
              Receive personalized event suggestions based on your academic profile
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <CalendarCheck className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Reserve Your Spot</h3>
            <p className="text-muted-foreground">
              Easily sign up for events that interest you and manage your schedule
            </p>
          </div>
          
          <div className="flex flex-col items-center text-center p-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Share Feedback</h3>
            <p className="text-muted-foreground">
              Review events you've attended and help future attendees make informed decisions
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold mb-4">
                AI-Powered Recommendations
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Our platform uses advanced AI to analyze your academic history and match you with events 
                that will enhance your university experience and complement your studies.
              </p>
              <ul className="space-y-2 mb-8">
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Tailored to your academic interests</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Refine suggestions with AI chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-5 w-5 rounded-full bg-primary flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <span>Discover events you might have missed</span>
                </li>
              </ul>
              <Button onClick={() => navigate(isAuthenticated ? "/recommended" : "/signup")}>
                {isAuthenticated ? "View Recommendations" : "Sign Up Now"}
              </Button>
            </div>
            <div className="md:w-1/2">
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img 
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=1470&auto=format&fit=crop"
                  alt="Student using laptop" 
                  className="w-full h-auto"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-8">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <CalendarCheck className="h-5 w-5 text-primary" />
              <span className="font-semibold">EventAICompass</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} EventAICompass. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
