import { Link } from "wouter";
import { Pet } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Scale, Users } from "lucide-react";

interface PetCardProps {
  pet: Pet;
}

export default function PetCard({ pet }: PetCardProps) {
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
    <Card className="card-hover overflow-hidden" data-testid={`card-pet-${pet.id}`}>
      <div className="relative">
        <div className="w-full h-64 bg-gray-200 overflow-hidden">
          {pet.imageUrl ? (
            <img 
              src={pet.imageUrl} 
              alt={pet.name}
              className="w-full h-full object-cover"
              data-testid={`img-pet-${pet.id}`}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">
              {getSpeciesIcon(pet.species)}
            </div>
          )}
        </div>
        {pet.isAdopted && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            Үрчлэгдсэн
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900" data-testid={`text-pet-name-${pet.id}`}>
            {pet.name}
          </h3>
          <Badge className={getGenderColor(pet.gender)} data-testid={`badge-gender-${pet.id}`}>
            {pet.gender}
          </Badge>
        </div>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-600">
            <Users className="h-4 w-4 mr-2 text-secondary" />
            <span data-testid={`text-breed-${pet.id}`}>{pet.breed}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-4 w-4 mr-2 text-secondary" />
            <span data-testid={`text-age-${pet.id}`}>{pet.age}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Scale className="h-4 w-4 mr-2 text-secondary" />
            <span data-testid={`text-weight-${pet.id}`}>{pet.weight}</span>
          </div>
        </div>
        
        <p className="text-gray-700 mb-4 line-clamp-3" data-testid={`text-description-${pet.id}`}>
          {pet.description}
        </p>
        
        <div className="flex gap-1 mb-4 flex-wrap">
          {pet.healthStatus.map((status, index) => (
            <Badge key={index} variant="outline" className="text-green-700 border-green-200 text-xs">
              {status}
            </Badge>
          ))}
        </div>
        
        <Link href={`/pets/${pet.id}`}>
          <Button 
            className="w-full" 
            style={{ backgroundColor: '#22c55e', color: 'white' }}
            data-testid={`button-view-details-${pet.id}`}
          >
            Дэлгэрэнгүй үзэх
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
