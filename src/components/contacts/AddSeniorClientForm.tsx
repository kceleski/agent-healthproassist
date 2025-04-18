
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Check, User, MapPin, Phone, Mail, DollarSign, Calendar, Clipboard } from "lucide-react";

// Define the schema for form validation
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  age: z.string().refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
    message: "Age must be a positive number.",
  }),
  location: z.string().min(3, { message: "Please enter a valid location." }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  careNeeds: z.string().min(1, { message: "Please select at least one care need." }),
  budget: z.string().min(1, { message: "Please select a budget range." }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSeniorClientFormProps {
  onClose: () => void;
  onSave: (data: any) => void;
}

const careNeedOptions = [
  "Memory Care",
  "Medication Management",
  "Assisted Living",
  "Physical Therapy",
  "Independent Living",
  "Meal Preparation",
  "Skilled Nursing",
  "Wound Care",
  "Hospice Care",
  "Respite Care"
];

const budgetRanges = [
  "$2,000 - $3,000",
  "$3,000 - $4,000",
  "$3,500 - $4,500",
  "$4,000 - $5,000",
  "$5,000 - $6,500",
  "$6,500 - $8,000",
  "Above $8,000"
];

const AddSeniorClientForm = ({ onClose, onSave }: AddSeniorClientFormProps) => {
  const { toast } = useToast();
  const [selectedCareNeeds, setSelectedCareNeeds] = useState<string[]>([]);

  // Initialize the form
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: "",
      location: "",
      phone: "",
      email: "",
      careNeeds: "",
      budget: "",
      notes: "",
    },
  });

  const handleCareNeedChange = (value: string) => {
    // Split the comma-separated string into an array
    const careNeedsArray = value.split(',');
    setSelectedCareNeeds(careNeedsArray);
    form.setValue("careNeeds", value);
  };

  const onSubmit = (data: FormValues) => {
    // Convert the comma-separated careNeeds string to array
    const careNeedsArray = data.careNeeds.split(',');
    
    // Create a new senior client object
    const newSeniorClient = {
      id: crypto.randomUUID(), // Generate a unique ID
      name: data.name,
      age: parseInt(data.age),
      careNeeds: careNeedsArray,
      budget: data.budget,
      location: data.location,
      phone: data.phone,
      email: data.email,
      status: "Active",
      notes: data.notes || "",
      lastContact: "Just now",
      image: `https://avatar.vercel.sh/${data.email}`, // Generate avatar from email
      familyContacts: []
    };
    
    // Save the new senior client
    onSave(newSeniorClient);
    
    // Show success toast
    toast({
      title: "Senior Client Added",
      description: `${data.name} has been added to your clients.`,
    });
    
    // Close the modal
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Enter client name" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Age Field */}
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Age</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Enter age" type="number" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Location Field */}
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="City, State" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Phone Field */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="(555) 555-5555" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Email Field */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="email@example.com" type="email" className="pl-9" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {/* Budget Field */}
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Budget</FormLabel>
                <FormControl>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="pl-9">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {budgetRanges.map((range) => (
                          <SelectItem key={range} value={range}>
                            {range}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Care Needs Field */}
          <FormField
            control={form.control}
            name="careNeeds"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Care Needs</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Clipboard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select
                      onValueChange={(val) => handleCareNeedChange(val)}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="pl-9">
                          <SelectValue placeholder="Select care needs" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {careNeedOptions.map((need) => (
                          <SelectItem key={need} value={need}>
                            <div className="flex items-center gap-2">
                              <span>{need}</span>
                              {selectedCareNeeds.includes(need) && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {/* Notes Field */}
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter any additional notes about the client"
                  className="min-h-32"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Save Client</Button>
        </div>
      </form>
    </Form>
  );
};

export default AddSeniorClientForm;
