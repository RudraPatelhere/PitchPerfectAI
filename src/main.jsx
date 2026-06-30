import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  BarChart3,
  Bot,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Gauge,
  Info,
  LineChart,
  MessageSquareText,
  Send,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X
} from "lucide-react";
import "./styles.css";

const personas = {
  cmo: {
    label: "Skeptical CMO (Focus: Brand Safety, ROAS)",
    role: "Skeptical CMO",
    focus: "Brand Safety, ROAS",
    mood: "Guarded, metrics-conscious",
    baseline: 80,
    avatar: "CM",
    objection:
      "AI ad platforms sound impressive, but I cannot risk unsafe placements or vague ROAS claims. Why should I trust this with our brand?",
    concerns: ["Brand safety", "ROAS proof", "Reputation control"]
  },
  cfo: {
    label: "Data-Driven CFO (Focus: CAC, LTV, Migration Time)",
    role: "Data-Driven CFO",
    focus: "CAC, LTV, Migration Time",
    mood: "Analytical, time-sensitive",
    baseline: 80,
    avatar: "CF",
    objection:
      "The migration cost worries me. Show me how this lowers CAC, protects LTV, and avoids a long operational drag.",
    concerns: ["CAC efficiency", "LTV lift", "Migration time"]
  },
  smb: {
    label: "Tech-Phobic SMB Owner (Focus: Simplicity, Implementation)",
    role: "Tech-Phobic SMB Owner",
    focus: "Simplicity, Implementation",
    mood: "Overwhelmed but curious",
    baseline: 80,
    avatar: "SB",
    objection:
      "I do not have a technical team. If this is complicated, I will lose time I need for customers. How simple is it really?",
    concerns: ["Ease of use", "Setup support", "Time savings"]
  }
};

const frameworks = {
  fab: {
    label: "FAB (Features, Advantages, Benefits)",
    guidance: "Connect platform capabilities to business advantages and measurable buyer benefits.",
    cues: ["Feature", "Advantage", "Benefit"]
  },
  spin: {
    label: "SPIN Selling",
    guidance: "Use situation, problem, implication, and need-payoff language before proposing value.",
    cues: ["Situation", "Problem", "Implication", "Need-payoff"]
  },
  sandler: {
    label: "Sandler Up-Front Contract",
    guidance: "Set expectations, confirm decision criteria, and earn permission to challenge assumptions.",
    cues: ["Agenda", "Roles", "Outcome"]
  }
};

const jargonTerms = ["neural network", "algorithms", "latent vector", "llm"];
const valueTerms = ["customer acquisition", "revenue growth", "save time", "automated roi"];

function createId() {
  return globalThis.crypto?.randomUUID?.() || `pitch-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

const teamMetrics = [
  { label: "Average Time to Close", value: "8.4 mins", icon: Clock3, tone: "text-sky-600", bg: "bg-sky-50" },
  { label: "Top Objection Bottleneck", value: "Data Privacy - 68% Failure", icon: ShieldCheck, tone: "text-rose-600", bg: "bg-rose-50" },
  { label: "Framework Compliance Rate", value: "74%", icon: Target, tone: "text-emerald-600", bg: "bg-emerald-50" }
];

const skillGaps = [
  { skill: "Technical-to-Narrative Translation", status: "Needs Improvement", score: 46, color: "bg-rose-500" },
  { skill: "Discovery Question Depth", status: "Developing", score: 58, color: "bg-amber-500" },
  { skill: "Brand Safety Reframing", status: "Proficient", score: 77, color: "bg-teal-500" },
  { skill: "Closing Urgency", status: "Proficient", score: 82, color: "bg-indigo-500" }
];

function classNames(...values) {
  return values.filter(Boolean).join(" ");
}

function analyzePitch(text, skepticism, personaKey, frameworkKey) {
  const normalized = text.toLowerCase();
  const foundJargon = jargonTerms.filter((term) => normalized.includes(term));
  const foundValue = valueTerms.filter((term) => normalized.includes(term));
  const framework = frameworks[frameworkKey];
  const persona = personas[personaKey];

  let delta = 0;
  const positives = [];
  const warnings = [];

  if (foundJargon.length > 0) {
    delta += foundJargon.length * 8;
    warnings.push(`Technical jargon detected: ${foundJargon.join(", ")}.`);
  }

  if (foundValue.length > 0) {
    delta -= foundValue.length * 10;
    positives.push(`Value language detected: ${foundValue.join(", ")}.`);
  }

  const hasQuestion = text.includes("?");
  if (hasQuestion) {
    delta -= 4;
    positives.push("Discovery question included, which keeps the buyer engaged.");
  }

  if (text.length < 45) {
    delta += 6;
    warnings.push("Response is brief; add a clearer business outcome and next step.");
  }

  if (foundJargon.length === 0 && foundValue.length === 0) {
    delta += 4;
    warnings.push("The pitch needs more buyer-specific value language.");
  }

  const nextSkepticism = Math.max(5, Math.min(100, skepticism + delta));
  const buyerTone =
    nextSkepticism > skepticism
      ? "I am still hearing complexity before business proof. Make this feel safer and easier to measure."
      : "That is closer. You are translating the platform into outcomes I can defend internally.";

  return {
    nextSkepticism,
    result: nextSkepticism > skepticism ? "risk" : "success",
    highlighted: highlightText(text, foundJargon, foundValue),
    critique: {
      headline:
        nextSkepticism > skepticism
          ? "Skepticism increased: simplify the language and anchor to business value."
          : "Skepticism decreased: strong value framing and buyer relevance.",
      positives,
      warnings,
      coaching: `Use ${framework.label} to address ${persona.focus}. ${framework.guidance}`
    },
    buyerReply: buyerTone
  };
}

function highlightText(text, badTerms, goodTerms) {
  const terms = [...badTerms.map((term) => ({ term, type: "bad" })), ...goodTerms.map((term) => ({ term, type: "good" }))];
  if (terms.length === 0) return [{ text, type: "plain" }];

  const escaped = terms.map(({ term }) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const pieces = text.split(regex).filter(Boolean);

  return pieces.map((piece) => {
    const match = terms.find(({ term }) => term.toLowerCase() === piece.toLowerCase());
    return { text: piece, type: match?.type || "plain" };
  });
}

function App() {
  const [activeView, setActiveView] = useState("simulator");
  const [personaKey, setPersonaKey] = useState("cmo");
  const [frameworkKey, setFrameworkKey] = useState("fab");
  const [skepticism, setSkepticism] = useState(80);
  const [pitch, setPitch] = useState("");
  const [showContext, setShowContext] = useState(true);
  const [feedbackLog, setFeedbackLog] = useState([]);

  const persona = personas[personaKey];
  const framework = frameworks[frameworkKey];
  const mood = skepticism > 82 ? "Resistant" : skepticism > 60 ? "Skeptical" : skepticism > 35 ? "Open but cautious" : "Engaged";

  const latestFeedback = feedbackLog[0];

  function handlePersonaChange(nextPersona) {
    setPersonaKey(nextPersona);
    setSkepticism(personas[nextPersona].baseline);
    setFeedbackLog([]);
    setPitch("");
  }

  function handleSubmit(event) {
    event.preventDefault();
    const cleaned = pitch.trim();
    if (!cleaned) return;
    const analysis = analyzePitch(cleaned, skepticism, personaKey, frameworkKey);
    setSkepticism(analysis.nextSkepticism);
    setFeedbackLog((current) => [
      {
        id: createId(),
        pitch: cleaned,
        persona: persona.role,
        framework: framework.label,
        ...analysis
      },
      ...current
    ]);
    setPitch("");
  }

  const chartInsight = useMemo(() => {
    const lowest = skillGaps.reduce((min, skill) => (skill.score < min.score ? skill : min), skillGaps[0]);
    return `${lowest.skill} is the highest-priority microlearning lane this week.`;
  }, []);

  return (
    <div className="min-h-screen bg-slate-100 text-slate-950">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(20,184,166,0.18),transparent_34%),radial-gradient(circle_at_top_right,rgba(79,70,229,0.13),transparent_30%)]" />
      <header className="sticky top-0 z-40 border-b border-white/70 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-slate-950 text-white shadow-glow">
              <Sparkles size={22} />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">PitchPerfect AI</h1>
              <p className="text-sm text-slate-500">AI Advertising Platform sales training simulator</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              className={classNames("nav-button", activeView === "simulator" && "nav-button-active")}
              onClick={() => setActiveView("simulator")}
            >
              <MessageSquareText size={17} />
              Simulator
            </button>
            <button
              className={classNames("nav-button", activeView === "dashboard" && "nav-button-active")}
              onClick={() => setActiveView("dashboard")}
            >
              <BarChart3 size={17} />
              Cohort Analytics
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <ContextBanner onOpen={() => setShowContext(true)} />
        {activeView === "simulator" ? (
          <SimulatorView
            persona={persona}
            personaKey={personaKey}
            framework={framework}
            frameworkKey={frameworkKey}
            skepticism={skepticism}
            mood={mood}
            pitch={pitch}
            latestFeedback={latestFeedback}
            feedbackLog={feedbackLog}
            onPersonaChange={handlePersonaChange}
            onFrameworkChange={setFrameworkKey}
            onPitchChange={setPitch}
            onSubmit={handleSubmit}
          />
        ) : (
          <DashboardView chartInsight={chartInsight} />
        )}
      </main>

      {showContext && <ContextModal onClose={() => setShowContext(false)} />}
    </div>
  );
}

function ContextBanner({ onOpen }) {
  return (
    <section className="mb-5 flex flex-col gap-3 rounded-lg border border-teal-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div className="flex gap-3">
        <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-50 text-teal-700">
          <Info size={18} />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Teleperformance Interview Project Context</h2>
          <p className="text-sm leading-6 text-slate-600">
            Automates onboarding evaluations and maps team-wide skill gaps for targeted microlearning.
          </p>
        </div>
      </div>
      <button className="secondary-button self-start sm:self-center" onClick={onOpen}>
        View Context
      </button>
    </section>
  );
}

function SimulatorView(props) {
  const {
    persona,
    personaKey,
    framework,
    frameworkKey,
    skepticism,
    mood,
    pitch,
    latestFeedback,
    feedbackLog,
    onPersonaChange,
    onFrameworkChange,
    onPitchChange,
    onSubmit
  } = props;

  return (
    <div className="grid gap-5 lg:grid-cols-[390px_minmax(0,1fr)]">
      <aside className="space-y-5">
        <section className="panel p-5">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="eyebrow">Training setup</p>
              <h2 className="section-title">Persona & Framework</h2>
            </div>
            <BriefcaseBusiness className="text-slate-400" size={22} />
          </div>
          <SelectField label="Client Persona" value={personaKey} onChange={onPersonaChange} options={personas} />
          <SelectField label="Sales Framework" value={frameworkKey} onChange={onFrameworkChange} options={frameworks} />
        </section>

        <section className="panel overflow-hidden">
          <div className="border-b border-slate-200 p-5">
            <p className="eyebrow">Client profile</p>
            <div className="mt-3 flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-950 text-sm font-semibold text-white">
                {persona.avatar}
              </div>
              <div>
                <h3 className="font-semibold text-slate-950">{persona.role}</h3>
                <p className="text-sm text-slate-500">{persona.focus}</p>
              </div>
            </div>
          </div>
          <div className="space-y-5 p-5">
            <Meter value={skepticism} />
            <div className="grid grid-cols-2 gap-3">
              <MiniStat label="Current mood" value={mood} />
              <MiniStat label="Framework" value={framework.cues[0]} />
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Primary concerns</p>
              <div className="flex flex-wrap gap-2">
                {persona.concerns.map((concern) => (
                  <span key={concern} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                    {concern}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </aside>

      <section className="panel flex min-h-[680px] flex-col overflow-hidden">
        <div className="border-b border-slate-200 bg-white p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="eyebrow">Live simulation</p>
              <h2 className="section-title">Objection Handling Room</h2>
              <p className="mt-1 max-w-2xl text-sm text-slate-500">{framework.guidance}</p>
            </div>
            <div className="rounded-lg bg-slate-950 px-3 py-2 text-xs font-semibold text-white">
              Skepticism {skepticism}%
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto bg-slate-50/70 p-5">
          <ChatBubble type="buyer" name={persona.role} text={persona.objection} />
          {latestFeedback && (
            <>
              <ChatBubble type="seller" name="Your pitch" highlighted={latestFeedback.highlighted} />
              <ChatBubble type="buyer" name={persona.role} text={latestFeedback.buyerReply} />
              <FeedbackPanel feedback={latestFeedback} />
            </>
          )}
          {feedbackLog.slice(1, 4).map((item) => (
            <div key={item.id} className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">Previous attempt</span>
                <span className={classNames("rounded-full px-2.5 py-1 text-xs font-semibold", item.result === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
                  {item.result === "success" ? "Improved" : "Needs revision"}
                </span>
              </div>
              <p className="line-clamp-2 text-sm text-slate-600">{item.pitch}</p>
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-4">
          <div className="flex flex-col gap-3 lg:flex-row">
            <textarea
              value={pitch}
              onChange={(event) => onPitchChange(event.target.value)}
              className="min-h-[112px] flex-1 resize-none rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              placeholder="Type your sales pitch/response here..."
            />
            <button className="primary-button lg:w-56" type="submit">
              <Send size={17} />
              Analyze Pitch & Respond
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="mb-4 block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <span className="relative block">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-full appearance-none rounded-lg border border-slate-200 bg-white px-3 pr-10 text-sm font-medium text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
        >
          {Object.entries(options).map(([key, option]) => (
            <option value={key} key={key}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
      </span>
    </label>
  );
}

function Meter({ value }) {
  const tone = value > 80 ? "bg-rose-500" : value > 55 ? "bg-amber-500" : "bg-emerald-500";
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-800">
          <Gauge size={17} />
          Skepticism Level
        </span>
        <span className="text-sm font-semibold text-slate-950">{value}%</span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
        <div className={classNames("h-full rounded-full transition-all duration-500", tone)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3">
      <p className="text-xs font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function ChatBubble({ type, name, text, highlighted }) {
  const isBuyer = type === "buyer";
  return (
    <div className={classNames("flex gap-3", isBuyer ? "justify-start" : "justify-end")}>
      {isBuyer && <Avatar icon={Bot} />}
      <div className={classNames("max-w-3xl rounded-lg px-4 py-3 shadow-sm", isBuyer ? "border border-slate-200 bg-white" : "bg-slate-950 text-white")}>
        <p className={classNames("mb-1 text-xs font-semibold", isBuyer ? "text-slate-500" : "text-slate-300")}>{name}</p>
        <p className={classNames("text-sm leading-6", isBuyer ? "text-slate-700" : "text-slate-100")}>
          {highlighted
            ? highlighted.map((part, index) => (
                <span
                  key={`${part.text}-${index}`}
                  className={classNames(
                    part.type === "bad" && "rounded bg-rose-500/20 px-1 font-semibold text-rose-200",
                    part.type === "good" && "rounded bg-emerald-400/20 px-1 font-semibold text-emerald-100"
                  )}
                >
                  {part.text}
                </span>
              ))
            : text}
        </p>
      </div>
      {!isBuyer && <Avatar icon={BrainCircuit} dark />}
    </div>
  );
}

function Avatar({ icon: Icon, dark }) {
  return (
    <div className={classNames("grid h-10 w-10 shrink-0 place-items-center rounded-lg", dark ? "bg-slate-950 text-white" : "bg-white text-teal-700 ring-1 ring-slate-200")}>
      <Icon size={18} />
    </div>
  );
}

function FeedbackPanel({ feedback }) {
  const isSuccess = feedback.result === "success";
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <div className={classNames("grid h-9 w-9 shrink-0 place-items-center rounded-lg", isSuccess ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700")}>
          {isSuccess ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
        </div>
        <div>
          <h3 className="font-semibold text-slate-950">{feedback.critique.headline}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-600">{feedback.critique.coaching}</p>
        </div>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <FeedbackList title="What worked" items={feedback.critique.positives} tone="good" fallback="No value-storytelling triggers detected yet." />
        <FeedbackList title="Coach next" items={feedback.critique.warnings} tone="risk" fallback="No major risk triggers detected." />
      </div>
    </div>
  );
}

function FeedbackList({ title, items, tone, fallback }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <p className="mb-2 text-sm font-semibold text-slate-900">{title}</p>
      <ul className="space-y-2">
        {(items.length ? items : [fallback]).map((item) => (
          <li key={item} className={classNames("flex gap-2 text-sm leading-5", tone === "good" ? "text-emerald-700" : "text-rose-700")}>
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DashboardView({ chartInsight }) {
  return (
    <div className="space-y-5">
      <section className="grid gap-4 md:grid-cols-3">
        {teamMetrics.map((metric) => (
          <article key={metric.label} className="panel p-5">
            <div className={classNames("mb-5 grid h-11 w-11 place-items-center rounded-lg", metric.bg, metric.tone)}>
              <metric.icon size={21} />
            </div>
            <p className="text-sm font-medium text-slate-500">{metric.label}</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{metric.value}</h3>
          </article>
        ))}
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="panel p-5">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Manager dashboard</p>
              <h2 className="section-title">Cohort Skill-Gap Map</h2>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">
              <LineChart size={17} />
              24 trainees
            </div>
          </div>
          <div className="space-y-5">
            {skillGaps.map((gap) => (
              <div key={gap.skill}>
                <div className="mb-2 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-slate-800">{gap.skill}</p>
                  <span className="text-sm font-semibold text-slate-500">{gap.status}</span>
                </div>
                <div className="h-4 overflow-hidden rounded-full bg-slate-100">
                  <div className={classNames("h-full rounded-full transition-all", gap.color)} style={{ width: `${gap.score}%` }} />
                </div>
                <p className="mt-1 text-xs font-medium text-slate-400">{gap.score}% demonstrated competency</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="panel p-5">
          <div className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-indigo-50 text-indigo-700">
            <Users size={22} />
          </div>
          <h3 className="text-lg font-semibold text-slate-950">Microlearning Recommendation</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600">{chartInsight}</p>
          <div className="mt-5 rounded-lg border border-teal-200 bg-teal-50 p-4">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-teal-800">
              <TrendingUp size={17} />
              Next cohort action
            </div>
            <p className="text-sm leading-6 text-teal-800">
              Assign a 12-minute objection drill that converts model mechanics into customer acquisition and revenue growth stories.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}

function ContextModal({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
      <div className="w-full max-w-2xl rounded-xl bg-white shadow-panel">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 p-5">
          <div>
            <p className="eyebrow">Portfolio overlay</p>
            <h2 className="section-title">Teleperformance Interview Project Context</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Close context modal">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 p-5 text-sm leading-7 text-slate-600">
          <p>
            PitchPerfect AI addresses the 80% instruction / 20% operational support split by automating initial onboarding evaluations for an AI Advertising Platform training program.
          </p>
          <p>
            Trainees practice persona-specific objections, receive instant coaching on jargon versus value storytelling, and generate structured performance data for managers.
          </p>
          <p>
            The cohort dashboard turns simulation results into team-wide skills gaps, enabling targeted microlearning instead of broad retraining.
          </p>
        </div>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
