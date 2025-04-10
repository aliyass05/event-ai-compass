
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User, CalendarCheck } from "lucide-react";

const NavBar: React.FC = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header 
      className={`sticky top-0 z-50 w-full backdrop-blur-lg transition-all ${
        isScrolled ? "bg-white/70 shadow-md" : "bg-transparent"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c8957b7f-9ee5-42b8-8b27-60e14f128489.png" 
              alt="LEMS Logo" 
              className="h-8 w-auto"
            />
            <span className="hidden font-bold sm:inline-block text-xl">LEMS</span>
          </Link>
        </div>
        
        <nav className="flex items-center gap-5">
          <Link 
            to="/events" 
            className={`font-medium transition-colors relative px-3 py-2 rounded-md ${
              isActive("/events") 
                ? "text-primary bg-primary/10" 
                : "hover:text-primary hover:bg-primary/5"
            }`}
          >
            Browse Events
          </Link>
          <Link 
            to="/recommended" 
            className={`font-medium transition-colors relative px-3 py-2 rounded-md ${
              isActive("/recommended") 
                ? "text-primary bg-primary/10" 
                : "hover:text-primary hover:bg-primary/5"
            }`}
          >
            Recommended
          </Link>
          
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full neo-morph p-0 overflow-hidden">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user?.name ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="glass-morph border-none w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                  onClick={() => navigate("/profile")}
                >
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="cursor-pointer focus:bg-primary/10 focus:text-primary"
                  onClick={() => navigate("/my-events")}
                >
                  <CalendarCheck className="mr-2 h-4 w-4" />
                  <span>My Events</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-destructive focus:bg-destructive/10" 
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")}
                className="hover:bg-primary/10 hover:text-primary"
              >
                Login
              </Button>
              <Button 
                onClick={() => navigate("/signup")}
                className="neo-morph bg-primary hover:bg-primary/90"
              >
                Sign Up
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default NavBar;
