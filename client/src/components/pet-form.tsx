import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertPetSchema } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const petFormSchema = insertPetSchema;
type PetForm = z.infer<typeof petFormSchema>;

interface PetFormProps {
  onSuccess?: () => void;
}

export default function PetForm({ onSuccess }: PetFormProps) {
  const { toast } = useToast();

  const form = useForm<PetForm>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: "",
      species: "",
      breed: "",
      age: "",
      weight: "",
      gender: "",
      description: "",
      healthStatus: [],
      imageUrl: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: PetForm) => {
      return await apiRequest("POST", "/api/pets", data);
    },
    onSuccess: () => {
      toast({
        title: "Амжилттай нэмэгдлээ!",
        description: "Шинэ амьтны мэдээлэл амжилттай нэмэгдлээ.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets/all"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      form.reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Алдаа гарлаа",
        description: "Амьтны мэдээлэл нэмэхэд алдаа гарлаа. Дахин оролдоно уу.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: PetForm) => {
    mutation.mutate(data);
  };

  const healthStatusOptions = [
    "эрүүл",
    "вакцинжуулсан",
    "стерилизацилагдсан",
    "хэрэгцээтэй"
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Амьтны нэр *</FormLabel>
                <FormControl>
                  <Input placeholder="жич: Бар, Улаан" {...field} data-testid="input-pet-name" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="species"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Амьтны төрөл *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-pet-species">
                      <SelectValue placeholder="Сонгоно уу" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="нохой">Нохой</SelectItem>
                    <SelectItem value="муур">Муур</SelectItem>
                    <SelectItem value="туулай">Туулай</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Үүлдэр *</FormLabel>
                <FormControl>
                  <Input placeholder="жич: Голден Ретривер" {...field} data-testid="input-pet-breed" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Хүйс *</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger data-testid="select-pet-gender">
                      <SelectValue placeholder="Сонгоно уу" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="эр">Эр</SelectItem>
                    <SelectItem value="эм">Эм</SelectItem>
                  </SelectContent>
                </Select>
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
                  <Input placeholder="жич: 8 сартай, 2 настай" {...field} data-testid="input-pet-age" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Жин *</FormLabel>
                <FormControl>
                  <Input placeholder="жич: 12 кг, 1.5 кг" {...field} data-testid="input-pet-weight" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Зургийн холбоос</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com/image.jpg" {...field} data-testid="input-pet-image" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Тайлбар *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Амьтны зан төлөв, сонголт, онцлогийн талаар дэлгэрэнгүй бичнэ үү"
                  className="min-h-32"
                  {...field}
                  data-testid="textarea-pet-description"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="healthStatus"
          render={() => (
            <FormItem>
              <div className="mb-4">
                <FormLabel className="text-base">Эрүүл мэндийн байдал</FormLabel>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {healthStatusOptions.map((option) => (
                  <FormField
                    key={option}
                    control={form.control}
                    name="healthStatus"
                    render={({ field }) => {
                      return (
                        <FormItem
                          key={option}
                          className="flex flex-row items-start space-x-3 space-y-0"
                        >
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(option)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, option])
                                  : field.onChange(
                                      field.value?.filter(
                                        (value) => value !== option
                                      )
                                    )
                              }}
                              data-testid={`checkbox-health-${option}`}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {option}
                          </FormLabel>
                        </FormItem>
                      )
                    }}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button 
          type="submit" 
          className="w-full bg-primary hover:bg-green-600" 
          disabled={mutation.isPending}
          data-testid="button-submit-pet"
        >
          {mutation.isPending ? "Нэмж байна..." : "Амьтан нэмэх"}
        </Button>
      </form>
    </Form>
  );
}
