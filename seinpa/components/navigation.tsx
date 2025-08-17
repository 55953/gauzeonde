import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Truck, Bell, User, LogOut, Home, Package, BarChart3 } from "lucide-react";
import { Link } from "wouter";

export default function Navigation() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">TruckFlow</h1>
            </div>
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900" data-testid="text-logo">
                TruckFlow
              </h1>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900"
                data-testid="link-home"
              >
                <Home className="w-4 h-4 mr-2" />
                Home
              </Button>
            </Link>
            <Link href="/customer">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900"
                data-testid="link-customer"
              >
                <Package className="w-4 h-4 mr-2" />
                Customer
              </Button>
            </Link>
            <Link href="/driver">
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-gray-900"
                data-testid="link-driver"
              >
                <Truck className="w-4 h-4 mr-2" />
                Driver
              </Button>
            </Link>
            {user?.role === 'admin' && (
              <Link href="/admin">
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-gray-900"
                  data-testid="link-admin"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
          </nav>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="relative"
              data-testid="button-notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-8 w-8 rounded-full"
                  data-testid="button-user-menu"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover"
                    src={
                      user?.profileImageUrl ||
                      `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=1E40AF&color=fff`
                    }
                    alt={`${user?.firstName} ${user?.lastName}`}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.firstName && (
                      <p className="font-medium" data-testid="text-user-menu-name">
                        {user.firstName} {user.lastName}
                      </p>
                    )}
                    {user?.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    )}
                    {user?.role && (
                      <Badge variant="outline" className="w-fit">
                        {user.role}
                      </Badge>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <Link href="/">
                  <DropdownMenuItem data-testid="menu-dashboard">
                    <User className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                </Link>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => window.location.href = '/api/logout'}
                  data-testid="menu-logout"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
