import { Link } from "wouter";
import { Button } from "./ui/button";
import { Search, Heart } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="gradient-bg text-white py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Гэрийн тэжээвэр амьтдад шинэ гэр олгоё
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-green-100">
          Хайр халамжтай гэр бүл хайж буй амьтдыг олоорой
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/pets">
            <Button 
              className="px-8 py-4 text-lg"
              style={{ backgroundColor: 'white', color: '#22c55e' }}
              data-testid="button-search-pets"
            >
              <Search className="mr-2" />
              Амьтан хайх
            </Button>
          </Link>
          <Link href="/application">
            <Button 
              variant="outline"
              className="px-8 py-4 text-lg"
              style={{ border: '2px solid white', color: 'white', backgroundColor: 'transparent' }}
              data-testid="button-help"
            >
              <Heart className="mr-2" />
              Тусламж үзүүлэх
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
