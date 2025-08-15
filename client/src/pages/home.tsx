import HeroSection from "../components/hero-section";
import PetCard from "../components/pet-card";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const { data: pets, isLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  return (
    <div>
      <HeroSection />
      
      {/* Featured Pets Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Үрчлэгдэхээр хүлээж буй амьтад
            </h2>
            <p className="text-xl text-gray-600">
              Шинэ гэр бүлээ хайж буй найрсаг амьтдыг олоорой
            </p>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                  <Skeleton className="w-full h-64 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-20 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pets?.slice(0, 6).map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          )}
          
          {pets && pets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Одоогоор үрчлэгдэхээр хүлээж буй амьтан байхгүй байна.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-green-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">247</div>
              <div className="text-gray-600">Үрчлэгдсэн амьтан</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">{pets?.length || 0}</div>
              <div className="text-gray-600">Хүлээж буй амьтан</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">189</div>
              <div className="text-gray-600">Аз жаргалтай гэр бүл</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
