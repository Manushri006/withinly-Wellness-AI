import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState, type FormEvent } from "react";
import {
  Activity,
  ArrowRight,
  Brain,
  Check,
  ChevronDown,
  HeartPulse,
  Leaf,
  LoaderCircle,
  Mail,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateWellnessPlan, joinWaitlist, type WellnessPlan } from "@/lib/withinly.functions";
import heroImage from "@/assets/withinly-hero.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Withinly | AI Wellness for South Indian Women" },
      { name: "description", content: "Smarter nutrition, fitness, and wellness guidance personalized for South Indian women by Withinly." },
      { property: "og:title", content: "Withinly | Small Steps. A Stronger You." },
      { property: "og:description", content: "Smarter nutrition, fitness, and wellness for South Indian women. Build healthy habits and become the strongest version of yourself with AI-powered guidance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const features = [
  { icon: Utensils, title: "Personalized Nutrition", text: "Food guidance that respects your preferences, routines, and South Indian staples." },
  { icon: Activity, title: "Adaptive Fitness Plans", text: "Movement recommendations that evolve with your energy, schedule, and progress." },
  { icon: Brain, title: "AI Wellness Companion", text: "Thoughtful support to help you make informed, sustainable everyday choices." },
  { icon: TrendingUp, title: "Progress Insights", text: "Clear patterns and encouraging milestones that keep your goals within reach." },
];

const fieldClass = "h-12 rounded-md border-border bg-background px-4 shadow-none focus-visible:ring-2";

function Index() {
  const generate = useServerFn(generateWellnessPlan);
  const signup = useServerFn(joinWaitlist);
  const [plan, setPlan] = useState<WellnessPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [planError, setPlanError] = useState("");
  const [signupLoading, setSignupLoading] = useState(false);
  const [signupMessage, setSignupMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handlePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPlanLoading(true);
    setPlanError("");
    const form = new FormData(event.currentTarget);
    try {
      const result = await generate({
        data: {
          age: Number(form.get("age")),
          dietPreference: String(form.get("dietPreference")),
          primaryGoal: String(form.get("primaryGoal")),
          activityLevel: String(form.get("activityLevel")),
          description: String(form.get("description")),
        },
      });
      setPlan(result);
      requestAnimationFrame(() => document.querySelector("#your-plan")?.scrollIntoView({ behavior: "smooth", block: "start" }));
    } catch (error) {
      setPlanError(error instanceof Error ? error.message : "We couldn't generate your plan. Please try again.");
    } finally {
      setPlanLoading(false);
    }
  };

  const handleSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formElement = event.currentTarget;
    setSignupLoading(true);
    setSignupMessage(null);
    const form = new FormData(formElement);
    try {
      const result = await signup({ data: { fullName: String(form.get("fullName")), email: String(form.get("email")) } });
      setSignupMessage({
        type: "success",
        text: result.alreadyJoined
          ? "This email is already on the Withinly waitlist. We'll notify you when we launch."
          : "Thank you for joining the Withinly waitlist. We'll notify you when we launch.",
      });
      if (!result.alreadyJoined) formElement.reset();
    } catch (error) {
      setSignupMessage({ type: "error", text: error instanceof Error ? error.message : "Please try again." });
    } finally {
      setSignupLoading(false);
    }
  };

  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      <nav className="absolute inset-x-0 top-0 z-20" aria-label="Main navigation">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 md:px-8">
          <a href="#top" className="flex items-center gap-2 text-xl font-bold" aria-label="Withinly home">
            <span className="grid size-9 place-items-center rounded-full bg-primary text-primary-foreground"><Leaf className="size-5" /></span>
            Withinly
          </a>
          <Button asChild size="lg" className="h-11 rounded-full px-6 shadow-none">
            <a href="#waitlist">Join the Waitlist</a>
          </Button>
        </div>
      </nav>

      <section id="top" className="relative min-h-[700px] md:min-h-[780px]">
        <img src={heroImage} alt="A South Indian woman preparing a nourishing meal at home" width={1536} height={1024} className="absolute inset-0 h-full w-full object-cover object-[68%_center]" />
        <div className="hero-wash absolute inset-0" />
        <div className="relative mx-auto flex min-h-[700px] max-w-7xl items-center px-5 pb-14 pt-28 md:min-h-[780px] md:px-8">
          <div className="max-w-2xl animate-rise">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-4 py-2 text-sm font-semibold text-primary backdrop-blur-sm">
              <Sparkles className="size-4" /> Wellness that understands you
            </div>
            <h1 className="max-w-xl text-5xl font-semibold leading-[1.02] sm:text-6xl md:text-7xl">Small Steps. <span className="text-primary">A Stronger You.</span></h1>
            <p className="mt-6 max-w-xl text-xl font-semibold leading-relaxed md:text-2xl">Smarter Nutrition, Fitness, and Wellness for South Indian Women.</p>
            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground md:text-lg">Get personalized wellness plans, nutrition guidance, fitness recommendations, and AI-powered support tailored to your goals and lifestyle. Build healthy habits, stay consistent, and become the strongest version of yourself.</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="h-13 rounded-full px-7 text-base shadow-lg shadow-primary/20">
                <a href="#waitlist">Join the Waitlist <ArrowRight /></a>
              </Button>
              <a href="#plan-generator" className="text-sm font-semibold text-foreground underline decoration-primary/40 underline-offset-8">Try the free starter plan</a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><Check className="size-4 text-primary" /> Personalized to you</span>
              <span className="flex items-center gap-2"><ShieldCheck className="size-4 text-primary" /> Private and secure</span>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-background py-20 md:py-28" aria-labelledby="why-heading">
        <div className="mx-auto max-w-7xl px-5 md:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-primary">Why Withinly</p>
            <h2 id="why-heading" className="mt-3 text-4xl font-semibold md:text-5xl">Wellness that fits your real life.</h2>
            <p className="mt-4 text-lg leading-8 text-muted-foreground">One thoughtful place for food, movement, mindset, and meaningful progress.</p>
          </div>
          <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ icon: Icon, title, text }, index) => (
              <article key={title} className="wellness-card group animate-rise bg-card p-7" style={{ animationDelay: `${index * 90}ms` }}>
                <span className={`grid size-12 place-items-center rounded-full ${index % 2 ? "bg-blue-soft" : "bg-lavender-soft"} text-primary`}><Icon className="size-5" /></span>
                <h3 className="mt-6 text-2xl font-semibold">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="plan-generator" className="wellness-gradient py-20 md:py-28" aria-labelledby="plan-heading">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 md:px-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="grid size-12 place-items-center rounded-full bg-primary text-primary-foreground"><Sparkles className="size-5" /></span>
            <h2 id="plan-heading" className="mt-6 text-4xl font-semibold leading-tight md:text-5xl">Get Your Personalized Starter Wellness Plan</h2>
            <p className="mt-5 text-lg leading-8 text-muted-foreground">Describe your wellness goals and receive a personalized wellness plan powered by AI.</p>
            <p className="mt-6 border-l-2 border-primary pl-4 text-sm leading-6 text-muted-foreground">This plan offers general wellness guidance and does not replace advice from a qualified healthcare professional.</p>
          </div>

          <div>
            <form onSubmit={handlePlan} className="wellness-card bg-card p-6 md:p-9">
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Age" htmlFor="age"><Input className={fieldClass} id="age" name="age" type="number" min="18" max="100" placeholder="e.g. 32" required /></Field>
                <SelectField label="Diet Preference" name="dietPreference" options={["Vegetarian", "Vegan", "Eggetarian", "Non-vegetarian"]} />
                <SelectField label="Primary Goal" name="primaryGoal" options={["Feel more energetic", "Build strength", "Manage weight", "Improve overall wellness"]} />
                <SelectField label="Activity Level" name="activityLevel" options={["Mostly sedentary", "Lightly active", "Moderately active", "Very active"]} />
              </div>
              <div className="mt-5">
                <Field label="Wellness Goal Description" htmlFor="description">
                  <Textarea id="description" name="description" required minLength={10} maxLength={600} rows={5} placeholder="Tell us what you would like to feel or improve, and anything that shapes your routine..." className="min-h-32 resize-y rounded-md bg-background p-4 shadow-none focus-visible:ring-2" />
                </Field>
              </div>
              {planError && <p role="alert" className="mt-4 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">{planError}</p>}
              <Button type="submit" disabled={planLoading} size="lg" className="mt-6 h-13 w-full rounded-full text-base">
                {planLoading ? <><LoaderCircle className="animate-spin" /> Creating your plan...</> : <>Generate My Plan <Sparkles /></>}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {(planLoading || plan) && (
        <section id="your-plan" className="scroll-mt-10 bg-background py-20" aria-live="polite">
          <div className="mx-auto max-w-7xl px-5 md:px-8">
            <p className="text-sm font-bold uppercase text-primary">Made for you</p>
            <h2 className="mt-3 text-4xl font-semibold">Your starter wellness plan</h2>
            {planLoading ? <PlanLoading /> : plan && <PlanResults plan={plan} />}
            {plan && (
              <div className="mt-12 flex flex-col items-start justify-between gap-5 border-t pt-8 md:flex-row md:items-center">
                <p className="max-w-2xl font-display text-2xl font-semibold md:text-3xl">Ready for a complete wellness journey? Join the Withinly waitlist.</p>
                <Button asChild size="lg" className="h-12 shrink-0 rounded-full px-6"><a href="#waitlist">Join the Waitlist <ArrowRight /></a></Button>
              </div>
            )}
          </div>
        </section>
      )}

      <section id="waitlist" className="waitlist-gradient relative py-20 md:py-28" aria-labelledby="waitlist-heading">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
          <Mail className="mx-auto size-8 text-primary" />
          <h2 id="waitlist-heading" className="mt-5 text-4xl font-semibold md:text-5xl">Be first to feel the difference.</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-muted-foreground">Join the Withinly waitlist for early access and launch updates.</p>
          <form onSubmit={handleSignup} className="mx-auto mt-9 grid max-w-xl gap-4 text-left sm:grid-cols-2">
            <Field label="Full Name" htmlFor="fullName"><Input className={fieldClass} id="fullName" name="fullName" autoComplete="name" minLength={2} maxLength={100} required placeholder="Your name" /></Field>
            <Field label="Email Address" htmlFor="email"><Input className={fieldClass} id="email" name="email" type="email" autoComplete="email" maxLength={254} required placeholder="you@example.com" /></Field>
            <Button type="submit" disabled={signupLoading} size="lg" className="h-13 rounded-full text-base sm:col-span-2">
              {signupLoading ? <><LoaderCircle className="animate-spin" /> Joining...</> : <>Join the Waitlist <ArrowRight /></>}
            </Button>
            {signupMessage && <p role="status" className={`rounded-md px-4 py-3 text-center text-sm sm:col-span-2 ${signupMessage.type === "success" ? "bg-sage/20 text-foreground" : "bg-destructive/10 text-destructive"}`}>{signupMessage.text}</p>}
          </form>
          <p className="mt-4 text-xs text-muted-foreground">No spam. Just thoughtful updates from Withinly.</p>
        </div>
      </section>

      <footer className="border-t bg-background py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 text-sm text-muted-foreground md:flex-row md:px-8">
          <p>Copyright © {new Date().getFullYear()} Withinly</p>
          <div className="flex gap-6"><a href="#privacy" className="hover:text-foreground">Privacy Policy</a><a href="mailto:hello@withinly.com" className="hover:text-foreground">hello@withinly.com</a></div>
        </div>
        <p id="privacy" className="sr-only">Withinly only uses submitted details to provide requested plans and waitlist updates.</p>
      </footer>
    </main>
  );
}

function Field({ label, htmlFor, children }: { label: string; htmlFor: string; children: React.ReactNode }) {
  return <div className="space-y-2"><Label htmlFor={htmlFor} className="text-sm font-semibold">{label}</Label>{children}</div>;
}

function SelectField({ label, name, options }: { label: string; name: string; options: string[] }) {
  return (
    <Field label={label} htmlFor={name}>
      <div className="relative">
        <select id={name} name={name} required defaultValue="" className={`${fieldClass} w-full appearance-none border text-sm text-foreground outline-none focus:ring-2 focus:ring-ring`}>
          <option value="" disabled>Select one</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-4 top-4 size-4 text-muted-foreground" />
      </div>
    </Field>
  );
}

function PlanLoading() {
  return <div className="mt-10 grid gap-5 md:grid-cols-2"><div className="h-44 animate-pulse rounded-lg bg-muted" /><div className="h-44 animate-pulse rounded-lg bg-muted" /><div className="h-52 animate-pulse rounded-lg bg-muted md:col-span-2" /></div>;
}

function PlanResults({ plan }: { plan: WellnessPlan }) {
  const cards = [
    { title: "Wellness Summary", icon: HeartPulse, body: <p>{plan.summary}</p> },
    { title: "Daily Habits", icon: Sparkles, body: <BulletList items={plan.dailyHabits} /> },
    { title: "One-Day Meal Plan", icon: Utensils, body: <div className="space-y-3">{plan.mealPlan.map((item) => <div key={item.meal}><p className="font-semibold text-foreground">{item.meal}</p><p>{item.suggestion}</p></div>)}</div> },
    { title: "Activity Recommendations", icon: Activity, body: <BulletList items={plan.activities} /> },
    { title: "Wellness Tips", icon: Leaf, body: <BulletList items={plan.wellnessTips} /> },
  ];
  return <div className="mt-10 grid gap-5 md:grid-cols-2">{cards.map(({ title, icon: Icon, body }, index) => <article key={title} className={`rounded-lg border bg-background p-6 shadow-sm ${index === 2 ? "md:row-span-2" : ""}`}><div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full bg-lavender-soft text-primary"><Icon className="size-4" /></span><h3 className="text-2xl font-semibold">{title}</h3></div><div className="mt-5 text-sm leading-6 text-muted-foreground">{body}</div></article>)}</div>;
}

function BulletList({ items }: { items: string[] }) {
  return <ul className="space-y-3">{items.map((item) => <li key={item} className="flex gap-3"><Check className="mt-1 size-4 shrink-0 text-primary" /><span>{item}</span></li>)}</ul>;
}