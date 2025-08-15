import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Pet, Application, Adoption, insertPetSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import PetForm from "../components/pet-form";
import { Plus, FileText, Heart, Eye, Check, X } from "lucide-react";

export default function StaffDashboard() {
  const [isAddPetOpen, setIsAddPetOpen] = useState(false);
  const { toast } = useToast();

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: applications, isLoading: applicationsLoading } = useQuery<Application[]>({
    queryKey: ["/api/applications"],
  });

  const { data: allPets, isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets/all"],
  });

  const updateApplicationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return await apiRequest("PATCH", `/api/applications/${id}/status`, { status });
    },
    onSuccess: () => {
      toast({
        title: "Амжилттай шинэчлэгдлээ",
        description: "Өргөдлийн статус шинэчлэгдлээ.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
    onError: () => {
      toast({
        title: "Алдаа гарлаа",
        description: "Өргөдлийн статус шинэчлэхэд алдаа гарлаа.",
        variant: "destructive",
      });
    },
  });

  const createAdoptionMutation = useMutation({
    mutationFn: async (data: { petId: string; applicationId: string; adoptedBy: string; story?: string }) => {
      return await apiRequest("POST", "/api/adoptions", data);
    },
    onSuccess: () => {
      toast({
        title: "Амжилттай үрчлэгдлээ",
        description: "Амьтан амжилттай үрчлэгдлээ.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/adoptions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
    },
  });

  const handleApproveApplication = async (application: Application) => {
    // Update application status
    await updateApplicationMutation.mutateAsync({
      id: application.id,
      status: "approved",
    });

    // Create adoption record
    await createAdoptionMutation.mutateAsync({
      petId: application.petId,
      applicationId: application.id,
      adoptedBy: application.fullName,
      story: `${application.fullName} амжилттай үрчилж авлаа.`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-yellow-700 border-yellow-200">Хүлээгдэж буй</Badge>;
      case "approved":
        return <Badge variant="outline" className="text-green-700 border-green-200">Зөвшөөрөгдсөн</Badge>;
      case "rejected":
        return <Badge variant="outline" className="text-red-700 border-red-200">Татгалзсан</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPetById = (petId: string) => {
    return allPets?.find(pet => pet.id === petId);
  };

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Ажилтны самбар
          </h1>
          <p className="text-xl text-gray-600">
            Амьтан болон өргөдлийн мэдээллийг удирдах
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Хурдан үйлдэл</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Dialog open={isAddPetOpen} onOpenChange={setIsAddPetOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full bg-primary hover:bg-green-600" data-testid="button-add-pet">
                    <Plus className="w-4 h-4 mr-2" />
                    Шинэ амьтан нэмэх
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Шинэ амьтан нэмэх</DialogTitle>
                  </DialogHeader>
                  <PetForm onSuccess={() => setIsAddPetOpen(false)} />
                </DialogContent>
              </Dialog>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.scrollTo({ top: document.getElementById('applications')?.offsetTop, behavior: 'smooth' })}
                data-testid="button-view-applications"
              >
                <FileText className="w-4 h-4 mr-2" />
                Өргөдлүүд харах
              </Button>

              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open('/history', '_blank')}
                data-testid="button-view-adoptions"
              >
                <Heart className="w-4 h-4 mr-2" />
                Үрчлэлтүүд харах
              </Button>
            </CardContent>
          </Card>

          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Статистик</CardTitle>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-8" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Өнөөдрийн өргөдөл</span>
                    <span className="text-2xl font-bold text-primary" data-testid="stat-today-applications">
                      {(stats as any)?.todayApplications || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Энэ сарын үрчлэлт</span>
                    <span className="text-2xl font-bold text-secondary" data-testid="stat-monthly-adoptions">
                      {(stats as any)?.monthlyAdoptions || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Идэвхтэй амьтан</span>
                    <span className="text-2xl font-bold text-blue-500" data-testid="stat-active-pets">
                      {(stats as any)?.activePets || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Хүлээгдэж буй өргөдөл</span>
                    <span className="text-2xl font-bold text-accent" data-testid="stat-pending-applications">
                      {(stats as any)?.pendingApplications || 0}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Сүүлийн үйл ажиллагаа</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Шинэ амьтан нэмэгдлээ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Өргөдөл ирлээ</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Үрчлэлт бүртгэгдлээ</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Applications */}
        <Card className="mt-8" id="applications">
          <CardHeader>
            <CardTitle>Сүүлийн өргөдлүүд</CardTitle>
          </CardHeader>
          <CardContent>
            {applicationsLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            ) : applications && applications.length > 0 ? (
              <div className="space-y-4">
                {applications.slice(0, 10).map((application) => {
                  const pet = getPetById(application.petId);
                  return (
                    <div key={application.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900" data-testid={`text-applicant-${application.id}`}>
                          {application.fullName}
                        </p>
                        <p className="text-sm text-gray-600">
                          {pet ? `${pet.name} (${pet.species})` : "Амьтан олдсонгүй"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {application.createdAt ? new Date(application.createdAt).toLocaleDateString('mn-MN') : ''}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(application.status)}
                        {application.status === "pending" && (
                          <div className="flex gap-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-green-600 border-green-200 hover:bg-green-50"
                              onClick={() => handleApproveApplication(application)}
                              disabled={updateApplicationMutation.isPending || createAdoptionMutation.isPending}
                              data-testid={`button-approve-${application.id}`}
                            >
                              <Check className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                              onClick={() => updateApplicationMutation.mutate({
                                id: application.id,
                                status: "rejected"
                              })}
                              disabled={updateApplicationMutation.isPending}
                              data-testid={`button-reject-${application.id}`}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Өргөдөл байхгүй байна.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
