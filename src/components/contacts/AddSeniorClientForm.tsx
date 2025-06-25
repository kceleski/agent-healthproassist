
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { createSeniorClient, SeniorClientData } from '@/services/clientService';
import { Checkbox } from '../ui/checkbox';

// This schema defines the structure and validation rules for the form
const formSchema = z.object({
  first_name: z.string().min(2, "First name is required"),
  last_name: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email address").optional().or(z.literal('')),
  phone: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  veteran_status: z.boolean().default(false),
});

interface AddSeniorClientFormProps {
    userId: string;
    agencyId: string | null;
    onClientAdded: (newClient: SeniorClientData) => void;
}

export const AddSeniorClientForm = ({ userId, agencyId, onClientAdded }: AddSeniorClientFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      city: "Phoenix",
      state: "AZ",
      veteran_status: false,
    },
  });

  // This function is called when the form is submitted
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newClient = await createSeniorClient(values);
    if (newClient) {
        onClientAdded(newClient); // This updates the UI on the ContactsPage
        form.reset(); // This clears the form fields
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex gap-4">
            <FormField name="first_name" control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
            <FormField name="last_name" control={form.control} render={({ field }) => (<FormItem className="flex-1"><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField name="email" control={form.control} render={({ field }) => (<FormItem><FormLabel>Email</FormLabel><FormControl><Input placeholder="you@example.com" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <FormField name="phone" control={form.control} render={({ field }) => (<FormItem><FormLabel>Phone</FormLabel><FormControl><Input placeholder="(555) 123-4567" {...field} /></FormControl><FormMessage /></FormItem>)} />
        <div className="flex gap-4">
          <FormField name="city" control={form.control} render={({ field }) => (<FormItem className='flex-1'><FormLabel>City</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
          <FormField name="state" control={form.control} render={({ field }) => (<FormItem className='w-24'><FormLabel>State</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
        </div>
        <FormField
          control={form.control}
          name="veteran_status"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>This client is a veteran</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
          {form.formState.isSubmitting ? 'Adding Client...' : 'Add Client'}
        </Button>
      </form>
    </Form>
  );
};
