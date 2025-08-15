import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Heart } from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => {
    return location === path;
  };

  const NavLinks = ({ mobile = false, onItemClick = () => {} }) => (
    <>
      <Link href="/">
        <Button
          variant={isActive("/") ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          onClick={onItemClick}
          data-testid="nav-home"
        >
          Нүүр
        </Button>
      </Link>
      <Link href="/pets">
        <Button
          variant={isActive("/pets") ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          onClick={onItemClick}
          data-testid="nav-pets"
        >
          Амьтад
        </Button>
      </Link>
      <Link href="/application">
        <Button
          variant={isActive("/application") ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          onClick={onItemClick}
          data-testid="nav-application"
        >
          Өргөдөл
        </Button>
      </Link>
      <Link href="/history">
        <Button
          variant={isActive("/history") ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          onClick={onItemClick}
          data-testid="nav-history"
        >
          Түүх
        </Button>
      </Link>
      <Link href="/staff">
        <Button
          variant={isActive("/staff") ? "default" : "ghost"}
          className={mobile ? "w-full justify-start" : ""}
          onClick={onItemClick}
          data-testid="nav-staff"
        >
          Ажилтан
        </Button>
      </Link>
    </>
  );

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/">
            <div className="flex items-center cursor-pointer" data-testid="nav-logo">
              <Heart className="text-primary text-2xl mr-3" />
              <h1 className="text-xl font-bold text-gray-900">
                Амьтан үрчлэх төв
              </h1>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <NavLinks />
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" data-testid="nav-mobile-toggle">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <div className="flex items-center mb-8">
                  <Heart className="text-primary text-xl mr-2" />
                  <span className="font-bold text-gray-900">Амьтан үрчлэх төв</span>
                </div>
                <div className="flex flex-col space-y-2">
                  <NavLinks mobile onItemClick={() => setIsOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
