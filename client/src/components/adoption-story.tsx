import { useQuery } from "@tanstack/react-query";
import { Adoption, Pet } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface AdoptionStoryProps {
  adoption: Adoption;
}

export default function AdoptionStory({ adoption }: AdoptionStoryProps) {
  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: ["/api/pets", adoption.petId],
  });

  const getSpeciesIcon = (species?: string) => {
    switch (species) {
      case "нохой": return "🐕";
      case "муур": return "🐱";
      case "туулай": return "🐰";
      default: return "🐾";
    }
  };

  const getSpeciesColor = (species?: string) => {
    switch (species) {
      case "нохой": return "bg-blue-500";
      case "муур": return "bg-pink-500";
      case "туулай": return "bg-green-500";
      default: return "bg-primary";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <Skeleton className="w-full h-48 mb-4" />
          <div className="flex items-center mb-3">
            <Skeleton className="w-12 h-12 rounded-full mr-3" />
            <div>
              <Skeleton className="h-5 w-20 mb-1" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
          <Skeleton className="h-16 w-full mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden" data-testid={`adoption-story-${adoption.id}`}>
      <div className="relative">
        <div className="w-full h-48 bg-gray-200 overflow-hidden">
          {pet?.imageUrl ? (
            <img 
              src={pet.imageUrl} 
              alt={pet.name}
              className="w-full h-full object-cover"
              data-testid={`img-adopted-pet-${adoption.id}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-4xl">
              {getSpeciesIcon(pet?.species)}
            </div>
          )}
        </div>
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center mb-3">
          <div className={`w-12 h-12 ${getSpeciesColor(pet?.species)} rounded-full flex items-center justify-center text-white font-bold mr-3`}>
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900" data-testid={`text-adopted-pet-name-${adoption.id}`}>
              {pet?.name || "Амьтан"}
            </h3>
            <p className="text-sm text-gray-600 flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span data-testid={`text-adoption-date-${adoption.id}`}>
                {adoption.adoptionDate ? new Date(adoption.adoptionDate).toLocaleDateString('mn-MN') : ''}
              </span>
            </p>
          </div>
        </div>
        
        {adoption.story && (
          <p className="text-gray-700 mb-4 italic" data-testid={`text-adoption-story-${adoption.id}`}>
            "{adoption.story}"
          </p>
        )}
        
        <p className="text-sm text-gray-500" data-testid={`text-adopted-by-${adoption.id}`}>
          - {adoption.adoptedBy}
        </p>
        
        <Badge variant="outline" className="mt-2 text-green-700 border-green-200">
          Амжилттай үрчлэгдсэн
        </Badge>
      </CardContent>
    </Card>
  );
}
