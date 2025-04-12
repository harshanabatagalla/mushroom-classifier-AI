import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Leaf, User, LogOut, Settings, Home, Menu, LogIn, UserPlus, Layers, MessageSquare } from 'lucide-react';

const Header = () => {
  const { currentUser, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b bg-white dark:bg-gray-900">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="flex items-center gap-2">
          <img src="/logo.svg" alt="Fungalyzer AI Logo" className="h-8 w-8" />
          <span className="sm:text-xl text-md font-bold">Fungalyzer AI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-mushroom-primary">
            Home
          </Link>
          <Link to="/identify" className="text-sm font-medium hover:text-mushroom-primary">
            Identify
          </Link>
          <Link to="/about" className="text-sm font-medium hover:text-mushroom-primary">
            About
          </Link>
          <Link to="/feedback" className="text-sm font-medium hover:text-mushroom-primary">
            Feedbacks
          </Link>
          {currentUser && (
            <Link to="/my-collection" className="text-sm font-medium hover:text-mushroom-primary">
              My Collection
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden flex-1" />
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[250px] md:hidden">
            <div className="flex flex-col gap-4 py-4">
              <Link
                to="/"
                className="text-base font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={closeMobileMenu}
              >
                <Home className="inline mr-2 h-4 w-4" />
                Home
              </Link>
              <Link
                to="/identify"
                className="text-base font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={closeMobileMenu}
              >
                <Leaf className="inline mr-2 h-4 w-4" />
                Identify
              </Link>
              <Link
                to="/about"
                className="text-base font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                onClick={closeMobileMenu}
              >
                <User className="inline mr-2 h-4 w-4" />
                About
              </Link>
              <Link
                to="/feedback"
                className="text-base font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                onclick={closeMobileMenu}
              >
                <MessageSquare className="inline mr-2 h-4 w-4" />
                Feedbacks
              </Link>
              {currentUser && (
                <Link
                  to="/my-collection"
                  className="text-base font-medium px-4 py-2 hover:bg-gray-100 rounded-md"
                  onClick={closeMobileMenu}
                >
                  <Layers className="inline mr-2 h-4 w-4" />
                  My Collection
                </Link>
              )}

              {/* Add login/signup links for mobile when user is not logged in */}
              {!currentUser && (
                <>
                  <div className="border-t my-2"></div>
                  <Link
                    to="/login"
                    className="text-base font-medium px-4 py-2 hover:bg-gray-100 rounded-md text-mushroom-primary"
                    onClick={closeMobileMenu}
                  >
                    <LogIn className="inline mr-2 h-4 w-4" />
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    className="text-base font-medium px-4 py-2 bg-mushroom-primary text-white hover:bg-mushroom-dark rounded-md"
                    onClick={closeMobileMenu}
                  >
                    <UserPlus className="inline mr-2 h-4 w-4" />
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <div className="flex items-center gap-4">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{currentUser.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/login">
                <Button variant="outline" size="sm" className="hidden md:inline-flex">
                  Log In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" className="bg-mushroom-primary hover:bg-mushroom-dark hidden md:inline-flex">
                  Sign Up
                </Button>
              </Link>
              {/* <Link to="/login" className="md:hidden">
                <Button variant="ghost" size="icon" className="relative h-8 w-8 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </Link> */}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;