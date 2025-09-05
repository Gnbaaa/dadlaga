import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Menu, Heart, LogOut, User } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const isActive = (path: string) => {
    return location === path;
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      <Link href="/">
        <Button
          className={mobile ? "w-full justify-start" : ""}
          style={isActive("/") ? 
            { backgroundColor: '#22c55e', color: 'white' } : 
            { backgroundColor: 'transparent', color: '#374151' }
          }
          onClick={onItemClick}
          data-testid="nav-home"
        >
          Нүүр
        </Button>
      </Link>
      <Link href="/pets">
        <Button
          className={mobile ? "w-full justify-start" : ""}
          style={isActive("/pets") ? 
            { backgroundColor: '#22c55e', color: 'white' } : 
            { backgroundColor: 'transparent', color: '#374151' }
          }
          onClick={onItemClick}
          data-testid="nav-pets"
        >
          Амьтад
        </Button>
      </Link>
      <Link href="/application">
        <Button
          className={mobile ? "w-full justify-start" : ""}
          style={isActive("/application") ? 
            { backgroundColor: '#22c55e', color: 'white' } : 
            { backgroundColor: 'transparent', color: '#374151' }
          }
          onClick={onItemClick}
          data-testid="nav-application"
        >
          Өргөдөл
        </Button>
      </Link>
      <Link href="/history">
        <Button
          className={mobile ? "w-full justify-start" : ""}
          style={isActive("/history") ? 
            { backgroundColor: '#22c55e', color: 'white' } : 
            { backgroundColor: 'transparent', color: '#374151' }
          }
          onClick={onItemClick}
          data-testid="nav-history"
        >
          Түүх
        </Button>
      </Link>
      {isAuthenticated && (
        <Link href="/staff">
          <Button
            className={mobile ? "w-full justify-start" : ""}
            style={isActive("/staff") ? 
              { backgroundColor: '#22c55e', color: 'white' } : 
              { backgroundColor: 'transparent', color: '#374151' }
            }
            onClick={onItemClick}
            data-testid="nav-staff"
          >
            Ажилтны самбар
          </Button>
        </Link>
      )}
    </>
  );

  const AuthSection = ({ mobile = false, onItemClick = () => {} }) => {
    if (isAuthenticated && user) {
      return (
        <div className={mobile ? "mt-4 pt-4 border-t" : "ml-4"}>
          {mobile ? (
            <div className="space-y-2">
              <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                    {user.fullName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.fullName}
                  </p>
                  <p className="text-xs text-gray-500">
                    {user.role === "admin" ? "Админ" : "Ажилтан"}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => {
                  handleLogout();
                  onItemClick();
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Гарах
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                      {user.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user.fullName}</p>
                    <p className="w-[200px] truncate text-sm text-muted-foreground">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user.role === "admin" ? "Админ" : "Ажилтан"}
                    </p>
                  </div>
                </div>
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Гарах</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      );
    }

    return (
      <div className={mobile ? "mt-4 pt-4 border-t" : "ml-4"}>
        <Link href="/login">
          <Button
            className={mobile ? "w-full" : ""}
            style={{ backgroundColor: '#22c55e', color: 'white' }}
            onClick={mobile ? onItemClick : undefined}
          >
            <User className="w-4 h-4 mr-2" />
            Нэвтрэх
          </Button>
        </Link>
      </div>
    );
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center cursor-pointer" data-testid="nav-logo">
              <Heart className="text-2xl mr-3" style={{ color: '#22c55e' }} />
              <h1 className="text-xl font-bold text-gray-900">
                PetConnect
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
            <AuthSection />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button size="sm" data-testid="nav-mobile-toggle" style={{ backgroundColor: 'transparent', color: '#374151' }}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex items-center mb-8">
                  <Heart className="text-xl mr-2" style={{ color: '#22c55e' }} />
                  <span className="font-bold text-gray-900">PetConnect</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <NavLinks mobile onItemClick={() => setIsOpen(false)} />
                  <AuthSection mobile onItemClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
