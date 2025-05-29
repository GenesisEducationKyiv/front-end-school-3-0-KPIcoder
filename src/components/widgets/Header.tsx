import { Link } from "@tanstack/react-router";
import { Search, Menu, User, Heart, PlayCircle, Headphones, Settings, LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useState } from "react";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b">
      <div className="container flex h-16 items-center px-4">
        {/* Logo & Brand */}
        <div className="flex mr-4">
          <Link to="/" className="flex items-center space-x-2">
            <Headphones className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl hidden sm:inline-block">Music Player</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
            <Link to="/tracks">Tracks</Link>
          </Button>
        </nav>

        {/* Search bar - grows to fill space */}
        <div className="flex-1 hidden md:block max-w-md mx-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search songs, artists, albums..."
              className="w-full pl-8 bg-background"
            />
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-auto">
          {/* Currently playing indicator (desktop only) */}
          <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary">
            <PlayCircle className="h-5 w-5" />
          </Button>
          
          {/* Favorites (desktop only) */}
          <Button variant="ghost" size="icon" className="hidden md:flex text-muted-foreground hover:text-primary">
            <Heart className="h-5 w-5" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                <span>Favorites</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container py-4 px-4 space-y-4">
            {/* Mobile search */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search songs, artists, albums..."
                className="w-full pl-8 bg-background"
              />
            </div>
            
            {/* Mobile navigation */}
            <nav className="flex flex-col space-y-1">
              <Button asChild variant="ghost" className="justify-start" onClick={() => setIsMobileMenuOpen(false)}>
                <Link to="/tracks">Tracks</Link>
              </Button>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
