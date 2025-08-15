import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertApplicationSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
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

interface ApplicationFormProps {
  petId?: string;
  onSuccess?: () => void;
}

export default function ApplicationForm({ petId, onSuccess }: ApplicationFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const { toast } = useToast();
  const totalSteps = 3;

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
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
      onSuccess?.();
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
    <div>
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-medium text-gray-500">
            Алхам {currentStep} / {totalSteps}
          </span>
          <span className="text-sm font-medium text-primary">
            {currentStep === 1 ? "Хувийн мэдээлэл" : 
             currentStep === 2 ? "Амьдрах нөхцөл" : "Туршлага"}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Овог нэр *</FormLabel>
                      <FormControl>
                        <Input placeholder="Таны бүтэн нэр" {...field} />
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
                        <Input placeholder="+976 XXXX-XXXX" {...field} />
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
                        <Input type="email" placeholder="example@email.com" {...field} />
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
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}

          {/* Step 2: Living Conditions */}
          {currentStep === 2 && (
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
                        <SelectTrigger>
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

          {/* Step 3: Experience and Reason */}
          {currentStep === 3 && (
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
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Өмнөх
            </Button>
            
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Дараах
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={mutation.isPending}
                className="bg-primary hover:bg-green-600"
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
    </div>
  );
}
