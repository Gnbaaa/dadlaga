import { useQuery } from "@tanstack/react-query";
import { Adoption, Pet, Application } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Calendar } from "lucide-react";
import AdoptionStory from "@/components/adoption-story";

export default function AdoptionHistory() {
  const { data: adoptions, isLoading: adoptionsLoading } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  if (adoptionsLoading || statsLoading) {
    return (
      <div className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-64 mx-auto" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="w-full h-48 mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Амжилттай үрчлэгдсэн амьтад
          </h1>
          <p className="text-xl text-gray-600">
            Шинэ гэрт амжилттай очсон манай найзууд
          </p>
        </div>

        {/* Adoption Stories */}
        {adoptions && adoptions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {adoptions.map((adoption) => (
              <AdoptionStory key={adoption.id} adoption={adoption} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 mb-12">
            <div className="text-6xl mb-4">💕</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Амьтад үрчлэгдэхийг хүлээж байна
            </h3>
            <p className="text-gray-500">
              Анхны амжилттай үрчлэлтийг хүлээж байна.
            </p>
          </div>
        )}

        {/* Statistics */}
        <div className="text-center">
          <div className="bg-green-50 rounded-2xl p-8 inline-block">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Статистик</h3>
            <div className="flex items-center justify-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1" data-testid="stat-total-adopted">
                  {stats?.totalAdopted || 0}
                </div>
                <div className="text-gray-600">Үрчлэгдсэн</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1" data-testid="stat-current-pets">
                  {stats?.currentPets || 0}
                </div>
                <div className="text-gray-600">Хүлээж буй</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1" data-testid="stat-happy-families">
                  {stats?.happyFamilies || 0}
                </div>
                <div className="text-gray-600">Аз жаргалтай гэр бүл</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
