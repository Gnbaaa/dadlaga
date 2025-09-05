import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Heart, Calendar, Scale, Users } from "lucide-react";

export default function PetDetails() {
  const { id } = useParams();
  
  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: ["/api/pets", id],
  });

  if (isLoading) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="w-full h-96" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Амьтан олдсонгүй
          </h1>
          <p className="text-gray-600 mb-8">
            Уучлаарай, таны хайж буй амьтны мэдээлэл олдсонгүй.
          </p>
          <Link href="/pets">
            <Button data-testid="button-back-to-pets">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Амьтдын жагсаалт руу буцах
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getGenderColor = (gender: string) => {
    return gender === "эр" ? "bg-blue-100 text-blue-800" : "bg-pink-100 text-pink-800";
  };

  const getSpeciesIcon = (species: string) => {
    switch (species) {
      case "нохой": return "🐕";
      case "муур": return "🐱";
      case "туулай": return "🐰";
      default: return "🐾";
    }
  };

  return (
    <div className="py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <Link href="/pets">
            <Button variant="ghost" className="gap-2" data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
              Буцах
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Pet Image */}
          <div className="relative">
            <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
              {pet.imageUrl ? (
                <img 
                  src={pet.imageUrl} 
                  alt={pet.name}
                  className="w-full h-full object-cover"
                  data-testid="img-pet"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-8xl">
                  {getSpeciesIcon(pet.species)}
                </div>
              )}
            </div>
            {pet.isAdopted && (
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
                Үрчлэгдсэн
              </div>
            )}
          </div>

          {/* Pet Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-900" data-testid="text-pet-name">
                  {pet.name}
                </h1>
                <Badge className={getGenderColor(pet.gender)} data-testid="badge-gender">
                  {pet.gender}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-5 h-5 text-secondary" />
                  <span data-testid="text-breed">{pet.breed}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-5 h-5 text-secondary" />
                  <span data-testid="text-age">{pet.age}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Scale className="w-5 h-5 text-secondary" />
                  <span data-testid="text-weight">{pet.weight}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {pet.healthStatus.map((status, index) => (
                  <Badge key={index} variant="outline" className="text-green-700 border-green-200">
                    {status}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Тухай
                </h3>
                <p className="text-gray-700 leading-relaxed" data-testid="text-description">
                  {pet.description}
                </p>
              </CardContent>
            </Card>

            {/* Adoption Button */}
            {!pet.isAdopted && (
              <Link href={`/application/${pet.id}`}>
                <Button className="w-full py-4 text-lg" style={{ backgroundColor: '#22c55e', color: 'white' }} data-testid="button-adopt">
                  <Heart className="w-5 h-5 mr-2" />
                  Үрчлэх өргөдөл гаргах
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
