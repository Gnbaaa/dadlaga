import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Pet } from "@shared/schema";
import PetCard from "../components/pet-card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

export default function Pets() {
  const [speciesFilter, setSpeciesFilter] = useState("all");
  const [ageFilter, setAgeFilter] = useState("all");
  const [sizeFilter, setSizeFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: pets, isLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
  });

  const filteredPets = pets?.filter((pet) => {
    const matchesSpecies = speciesFilter === "all" || pet.species === speciesFilter;
    const matchesAge = ageFilter === "all" || pet.age.includes(ageFilter);
    const matchesSearch = pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSpecies && matchesAge && matchesSearch;
  }) || [];

  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Үрчлэгдэхээр хүлээж буй амьтад
          </h1>
          <p className="text-lg text-gray-600">
            Шинэ гэр бүлээ хайж буй найрсаг амьтдыг олоорой
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Амьтны нэр, үүлдэр хайх..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search"
              />
            </div>
            
            <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
              <SelectTrigger data-testid="select-species">
                <SelectValue placeholder="Амьтны төрөл" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх амьтан</SelectItem>
                <SelectItem value="нохой">Нохой</SelectItem>
                <SelectItem value="муур">Муур</SelectItem>
                <SelectItem value="туулай">Туулай</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ageFilter} onValueChange={setAgeFilter}>
              <SelectTrigger data-testid="select-age">
                <SelectValue placeholder="Нас" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх нас</SelectItem>
                <SelectItem value="сар">Зээрд (0-6 сар)</SelectItem>
                <SelectItem value="1 жил">Залуу (6сар-2жил)</SelectItem>
                <SelectItem value="2 жил">Том (2-7жил)</SelectItem>
                <SelectItem value="7 жил">Хөгшин (7+ жил)</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger data-testid="select-size">
                <SelectValue placeholder="Хэмжээ" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх хэмжээ</SelectItem>
                <SelectItem value="small">Жижиг</SelectItem>
                <SelectItem value="medium">Дунд</SelectItem>
                <SelectItem value="large">Том</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredPets.length} амьтан олдлоо
          </p>
        </div>

        {/* Pet Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg p-6">
                <Skeleton className="w-full h-64 mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-20 w-full mb-4" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : filteredPets.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🐾</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Хайлтын үр дүн олдсонгүй
            </h3>
            <p className="text-gray-500">
              Хайлтын нөхцөлийг өөрчилж дахин оролдоно уу.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
