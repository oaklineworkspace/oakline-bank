import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { z } from "zod";

import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Input } from "../components/ui/input";
import { Checkbox } from "../components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useToast } from "../hooks/use-toast";
import { apiRequest } from "../lib/queryClient";
import { StepIndicator } from "../components/step-indicator";
import { AccountTypeCard } from "../components/account-type-card";
import { US_STATES, COUNTRIES } from "../lib/account-types";

const applicationSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone is required"),
  dob: z.string().min(1, "Date of birth is required"),
  ssnOrId: z.string().min(5, "SSN or ID is required"),
  country: z.string().min(2, "Country is required"),
  state: z.string().min(2, "State is required"),
  city: z.string().min(1, "City is required"),
  address: z.string().min(5, "Address is required"),
  zipCode: z.string().min(4, "ZIP code is required"),
  selectedAccountTypes: z.array(z.string()).min(1, "Select at least one account type"),
  termsAgreed: z.boolean().refine(val => val, "You must agree to terms"),
  emailConsent: z.boolean().refine(val => val, "Email consent is required"),
  marketingConsent: z.boolean(),
});

export default function Apply() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [showAllAccountTypes, setShowAllAccountTypes] = useState(false);

  const form = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      dob: "",
      ssnOrId: "",
      country: "",
      state: "",
      city: "",
      address: "",
      zipCode: "",
      selectedAccountTypes: [],
      termsAgreed: false,
      emailConsent: false,
      marketingConsent: false,
    },
  });

  const { data: accountTypes } = useQuery({
    queryKey: ["account-types"],
    queryFn: async () => {
      const res = await apiRequest("GET", "/api/account-types");
      return res.json();
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (data) => {
      const res = await apiRequest("POST", "/api/applications", data);
      if (!res.ok) throw new Error("Failed to submit application");
      return res.json();
    },
    onSuccess: (data) => {
      toast({ title: "Application Submitted!", description: "Check your email for enrollment link." });
      router.push(`/success?applicationId=${data.id}`);
    },
    onError: (error) => {
      toast({ title: "Submission Error", description: error.message, variant: "destructive" });
    },
  });

  const handleNext = async () => {
    const isValid = await form.trigger();
    if (isValid) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const toggleAccountType = (id) => {
    const selected = form.getValues("selectedAccountTypes") || [];
    const updated = selected.includes(id) ? selected.filter(a => a !== id) : [...selected, id];
    form.setValue("selectedAccountTypes", updated);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Oakline Bank</h1>
        </div>
      </header>

      <main className="py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card className="shadow-lg">
            <CardContent>
              <StepIndicator currentStep={currentStep} totalSteps={3} steps={[
                { title: "Personal Info" }, 
                { title: "Accounts" }, 
                { title: "Verify" }
              ]} />

              <Form {...form}>
                <form onSubmit={form.handleSubmit((data) => submitApplication.mutate(data))} className="space-y-6">

                  {/* Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField name="firstName" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField name="lastName" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField name="email" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl><Input type="email" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <FormField name="phone" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl><Input {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField name="dob" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>Date of Birth</FormLabel>
                            <FormControl><Input type="date" {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField name="ssnOrId" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>SSN / ID</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>

                      <FormField name="country" control={form.control} render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <SelectTrigger><SelectValue placeholder="Select country" /></SelectTrigger>
                            <SelectContent>
                              {COUNTRIES.map(c => <SelectItem key={c.code} value={c.name}>{c.name}</SelectItem>)}
                              <SelectItem value="Other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )} />

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormField name="state" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>State</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
                              <SelectContent>
                                {US_STATES.map(s => <SelectItem key={s.value} value={s.label}>{s.label}</SelectItem>)}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField name="city" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>City</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <FormField name="zipCode" control={form.control} render={({ field }) => (
                          <FormItem>
                            <FormLabel>ZIP Code</FormLabel>
                            <FormControl><Input {...field} /></FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Account Types */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold">Select Account Types</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {accountTypes?.slice(0, showAllAccountTypes ? accountTypes.length : 6).map(at => (
                          <AccountTypeCard
                            key={at.id}
                            accountType={at}
                            isSelected={form.getValues("selectedAccountTypes").includes(at.id)}
                            onSelect={toggleAccountType}
                          />
                        ))}
                      </div>
                      {accountTypes && accountTypes.length > 6 && !showAllAccountTypes && (
                        <Button onClick={() => setShowAllAccountTypes(true)}>Show More</Button>
                      )}
                    </div>
                  )}

                  {/* Step 3: Verification */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h2 className="text-lg font-bold">Review & Submit</h2>
                      <p>Make sure all information is correct before submitting.</p>

                      <FormField name="termsAgreed" control={form.control} render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel>I agree to terms & conditions</FormLabel>
                        </FormItem>
                      )} />

                      <FormField name="emailConsent" control={form.control} render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel>I consent to receive account notifications via email</FormLabel>
                        </FormItem>
                      )} />

                      <FormField name="marketingConsent" control={form.control} render={({ field }) => (
                        <FormItem className="flex items-center space-x-2">
                          <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                          <FormLabel>Receive marketing updates (optional)</FormLabel>
                        </FormItem>
                      )} />
                    </div>
                  )}

                  <div className="flex justify-between mt-6">
                    {currentStep > 1 && <Button onClick={handleBack}>Back</Button>}
                    {currentStep < 3 ? 
                      <Button onClick={handleNext}>Next</Button> :
                      <Button type="submit">Submit Application</Button>
                    }
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}