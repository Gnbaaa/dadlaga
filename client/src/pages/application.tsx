import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema, type Pet } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { z } from "zod";

const applicationFormSchema = insertApplicationSchema.extend({
  experience: z.string().min(1, "Туршлагын талаар бичнэ үү"),
  reason: z.string().min(1, "Үрчлэх шалтгаанаа бичнэ үү"),
});

type ApplicationForm = z.infer<typeof applicationFormSchema>;

export default function Application() {
  const { petId } = useParams();
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = petId ? 3 : 4; // Add extra step for pet selection if no pet is pre-selected

  const { data: pet } = useQuery<Pet>({
    queryKey: ["/api/pets", petId || ""],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !!petId,
  });

  // Fetch available pets if no specific pet is selected
  const { data: pets } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    queryFn: getQueryFn({ on401: "returnNull" }),
    enabled: !petId,
    select: (data) => data.filter(pet => !pet.isAdopted), // Only show available pets
  });

  const form = useForm<ApplicationForm>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      petId: petId || "",
      fullName: "",
      phoneNumber: "",
      email: "",
      age: 18,
      address: "",
      livingCondition: "",
      experience: "",
      reason: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: ApplicationForm) => {
      return await apiRequest("POST", "/api/applications", data);
    },
    onSuccess: () => {
      toast({
        title: "Амжилттай илгээгдлээ!",
        description: "Таны өргөдөл амжилттай илгээгдлээ. Бид удахгүй холбогдох болно.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/applications"] });
      setLocation("/");
    },
    onError: () => {
      toast({
        title: "Алдаа гарлаа",
        description: "Өргөдөл илгээхэд алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ApplicationForm) => {
    mutation.mutate(data);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="bg-gray-100 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Үрчлэх өргөдөл
          </h1>
          <p className="text-xl text-gray-600">
            {pet ? `${pet.name}-г үрчлэхийн тулд мэдээллээ бөглөнө үү` : "Үрчлэх амьтанаа сонгоод мэдээллээ бөглөнө үү"}
          </p>
        </div>

        <Card className="shadow-lg">
          <CardContent className="p-8">
            {/* Progress */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-500">
                  Алхам {currentStep} / {totalSteps}
                </span>
                <span className="text-sm font-medium text-primary">
                  {currentStep === 1 && !petId ? "Амьтан сонгох" :
                   currentStep === (petId ? 1 : 2) ? "Хувийн мэдээлэл" : 
                   currentStep === (petId ? 2 : 3) ? "Амьдрах нөхцөл" : "Туршлага"}
                </span>
              </div>
              <Progress value={progress} className="h-2" data-testid="progress-application" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Step 1: Pet Selection (only if no pet is pre-selected) */}
                {currentStep === 1 && !petId && (
                  <div className="space-y-6">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Үрчлэх амьтанаа сонгоно уу
                      </h3>
                      <p className="text-gray-600">
                        Доорх жагсаалтаас үрчлэх амьтанаа сонгоно уу
                      </p>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="petId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Амьтан *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-pet">
                                <SelectValue placeholder="Үрчлэх амьтанаа сонгоно уу" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {pets?.map((pet) => (
                                <SelectItem key={pet.id} value={pet.id}>
                                  {pet.name} - {pet.species} ({pet.breed})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Show selected pet image */}
                    {form.watch("petId") && (
                      <div className="mt-6">
                        {(() => {
                          const selectedPet = pets?.find(pet => pet.id === form.watch("petId"));
                          if (selectedPet) {
                            return (
                              <div className="bg-gray-50 rounded-lg p-6 border">
                                <div className="flex items-center space-x-4">
                                  <div className="flex-shrink-0">
                                    <img
                                      src={selectedPet.imageUrl || "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=96&h=96&fit=crop&crop=center"}
                                      alt={selectedPet.name}
                                      className="w-24 h-24 object-cover rounded-lg"
                                      onError={(e) => {
                                        e.currentTarget.src = "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=96&h=96&fit=crop&crop=center";
                                      }}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="text-lg font-semibold text-gray-900">{selectedPet.name}</h4>
                                    <p className="text-gray-600">{selectedPet.species} • {selectedPet.breed}</p>
                                    <p className="text-gray-600">{selectedPet.age} • {selectedPet.gender}</p>
                                    <p className="text-gray-600 mt-2">{selectedPet.description}</p>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    )}
                  </div>
                )}

                {/* Step 1/2: Personal Information */}
                {currentStep === (petId ? 1 : 2) && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Овог нэр *</FormLabel>
                            <FormControl>
                              <Input placeholder="Таны бүтэн нэр" {...field} data-testid="input-fullname" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Утасны дугаар *</FormLabel>
                            <FormControl>
                              <Input placeholder="+976 XXXX-XXXX" {...field} data-testid="input-phone" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>И-мэйл хаяг *</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="example@email.com" {...field} data-testid="input-email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Нас *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="18"
                                max="100"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                data-testid="input-age"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 2/3: Living Conditions */}
                {currentStep === (petId ? 2 : 3) && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Гэрийн хаяг *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Таны бүтэн гэрийн хаяг"
                              className="min-h-24"
                              {...field}
                              data-testid="textarea-address"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="livingCondition"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Амьдрах нөхцөл *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-living-condition">
                                <SelectValue placeholder="Сонгоно уу" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="apartment">Байр</SelectItem>
                              <SelectItem value="house">Байшин</SelectItem>
                              <SelectItem value="house-with-yard">Хашаатай байшин</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 3/4: Experience and Reason */}
                {currentStep === (petId ? 3 : 4) && (
                  <div className="space-y-6">
                    <FormField
                      control={form.control}
                      name="experience"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Амьтан өсгөсөн туршлага *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Өмнө нь амьтан өсгөсөн туршлагаа дэлгэрэнгүй бичнэ үү"
                              className="min-h-32"
                              {...field}
                              data-testid="textarea-experience"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Үрчлэх шалтгаан *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Яагаад амьтан үрчлэх гэж байгаагаа дэлгэрэнгүй бичнэ үү"
                              className="min-h-32"
                              {...field}
                              data-testid="textarea-reason"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    data-testid="button-prev"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Өмнөх
                  </Button>
                  
                  {currentStep < totalSteps ? (
                    <Button 
                      type="button" 
                      onClick={nextStep} 
                      style={{ backgroundColor: '#22c55e', color: 'white' }}
                      data-testid="button-next"
                      disabled={currentStep === 1 && !petId && !form.watch("petId")}
                    >
                      Дараах
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button 
                      type="submit" 
                      disabled={mutation.isPending}
                      style={{ backgroundColor: '#22c55e', color: 'white' }}
                      data-testid="button-submit"
                    >
                      {mutation.isPending ? (
                        "Илгээж байна..."
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Өргөдөл илгээх
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
