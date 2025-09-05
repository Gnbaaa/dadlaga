import HeroSection from "../components/hero-section";
import PetCard from "../components/pet-card";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";
import { getQueryFn } from "@/lib/queryClient";

export default function Home() {
  const { data: pets, isLoading } = useQuery<Pet[]>({ 
    queryKey: ["/api/pets"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Үрчлэгдэхээр хүлээж буй амьтад
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Шинэ гэр бүлээ хайж буй найрсаг амьтдыг олоорой
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {pets?.slice(0, 6).map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}

        {pets && pets.length > 6 && (
          <div className="text-center mt-12">
            <a
              href="/pets"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View All Pets
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
