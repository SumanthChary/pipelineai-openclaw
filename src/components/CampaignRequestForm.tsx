import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";

const campaignSchema = z.object({
  campaignName: z.string().min(3, "Give your campaign a name."),
  companyName: z.string().min(2, "Company or product is required."),
  contactEmail: z.string().email("Enter a valid email."),
  targetPersona: z.string().min(3, "Describe who you want to reach."),
  offer: z.string().min(6, "Outline what you're offering."),
  notes: z
    .string()
    .max(1000, "Keep additional context under 1,000 characters.")
    .optional()
    .transform((value) => (value?.trim() ? value.trim() : undefined)),
});

type CampaignFormValues = z.infer<typeof campaignSchema>;

const defaultValues: CampaignFormValues = {
  campaignName: "Outbound sprint",
  companyName: "PipelineAI",
  contactEmail: "ops@pipeline.ai",
  targetPersona: "RevOps leaders at cloud-native SaaS companies",
  offer: "Autonomous SDRs that qualify and book meetings end-to-end",
  notes: "",
};

const CampaignRequestForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmissionId, setLastSubmissionId] = useState<string | null>(null);

  const form = useForm<CampaignFormValues>({
    resolver: zodResolver(campaignSchema),
    defaultValues,
  });

  const handleSubmit = async (values: CampaignFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/campaigns/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          submittedFrom: "pipelineai-openclaw-ui",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || "Unable to submit campaign right now.");
      }

      toast({
        title: "Campaign queued",
        description: `OpenClaw is processing request ${result.campaignId}.`,
      });

      setLastSubmissionId(result.campaignId);
      form.reset(defaultValues);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      toast({
        title: "Submission failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-white/20 bg-white/95 text-left shadow-2xl backdrop-blur dark:border-slate-800/60 dark:bg-slate-950/70">
      <CardHeader className="space-y-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Sparkles className="h-5 w-5 text-primary" /> Launch an autonomous sprint
        </CardTitle>
        <CardDescription>
          Every submission drops a JSON job into your <span className="font-medium text-foreground">openclaw-bridge</span> folder for the worker
          to pick up.
        </CardDescription>
        <div className="flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-200">
          <ShieldCheck className="h-4 w-4" /> Encrypted locally · Files never leave your machine
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign name</FormLabel>
                  <FormControl>
                    <Input placeholder="Funded SaaS blitz" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company / Product</FormLabel>
                  <FormControl>
                    <Input placeholder="PipelineAI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notification email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="ops@pipeline.ai" {...field} />
                  </FormControl>
                  <FormDescription>We use this for audit trails inside OpenClaw.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="targetPersona"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target persona</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Growth leads at Series B+ B2B SaaS" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="offer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Offer / angle</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Autonomous SDRs that 10x pipeline without new headcount" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional notes</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="Key accounts, do-not-contact lists, constraints, etc." {...field} />
                  </FormControl>
                  <FormDescription>Optional. Anything here will be included verbatim in the bridge file.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2 pt-2">
              <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending to OpenClaw
                  </>
                ) : (
                  <>Drop to bridge</>
                )}
              </Button>
              {lastSubmissionId && (
                <p className="text-center text-xs text-muted-foreground">
                  Tracking ID: <span className="font-semibold text-foreground">{lastSubmissionId}</span>
                </p>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default CampaignRequestForm;
