import { useState } from "react";

const steps = [
  {
    id: "identity",
    question: "What is your name and role at oRise?",
    hint: null,
    type: "text",
    placeholder: "e.g. Sarah Müller, Senior Consultant",
    field: "identity",
  },
  {
    id: "origin",
    question: "Where did this idea come from?",
    hint: "Pick the context, then briefly describe what you or the other person were trying to do.",
    type: "choice+text",
    choices: [
      "Client engagement",
      "Sales conversation",
      "Customer success",
      "Internal discussion",
      "Something else",
    ],
    otherChoice: "Something else",
    otherPlaceholder: "Describe the situation briefly",
    placeholder: "What were you or the other person trying to do when this came up?",
    field: "origin",
  },
  {
    id: "problem",
    question: "What problem did you observe?",
    hint: "Describe what was broken, missing, or being done manually. Not the solution yet — just what you saw.",
    type: "textarea",
    placeholder: "I noticed that...",
    field: "problem",
  },
  {
    id: "solution",
    question: "What solution do you have in mind?",
    hint: "Describe what you think could be built or offered. Rough is fine — we're not holding you to this.",
    type: "textarea",
    placeholder: "What I think could work is...",
    field: "solution",
  },
  {
    id: "frequency",
    question: "Have you seen or heard about this problem elsewhere?",
    hint: "This helps us understand whether it's a pattern or a one-off.",
    type: "radio",
    choices: [
      "Only here, once",
      "At more than one client or site",
      "Others mentioned it to me, but I haven't seen it directly",
      "This came from outside my work context entirely",
    ],
    textChoices: [
      "Others mentioned it to me, but I haven't seen it directly",
      "This came from outside my work context entirely",
    ],
    textPlaceholder: "Tell us a bit more about where this came from",
    field: "frequency",
  },
  {
    id: "standalone",
    question: "Could a customer use this without oRise being involved every time?",
    hint: "Think about whether they'd need a consultant to guide them each time, or if it could run on its own.",
    type: "radio+text",
    choices: ["Yes", "No", "Not sure"],
    placeholder: "Why do you think that?",
    field: "standalone",
  },
  {
    id: "contact",
    question: "Who else should we speak to about this?",
    hint: "Optional. Ideas often carry context that lives with a specific person — the client who dealt with this daily, a colleague who saw the same thing at a different site. Knowing who else holds that context means we can go deeper when we follow up, without losing what made the idea interesting in the first place. A name and a sentence is enough — we'll always go through you first.",
    type: "textarea",
    placeholder: "e.g. Klaus at BASF plant — he was the one dealing with this daily",
    field: "contact",
    optional: true,
  },
];

const ACCENT = "#1a1a2e";
const HIGHLIGHT = "#e8ff47";

export default function App() {
  const [current, setCurrent] = useState(0);
  const [form, setForm] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [direction, setDirection] = useState("forward");

  const step = steps[current];
  const isLast = current === steps.length - 1;
  const progress = ((current) / steps.length) * 100;

  function getValue(field) {
    return form[field] || {};
  }

  function updateField(field, key, value) {
    setForm((prev) => ({
      ...prev,
      [field]: { ...(prev[field] || {}), [key]: value },
    }));
  }

  function canAdvance() {
    if (step.optional) return true;
    const val = form[step.field];
    if (!val) return false;
    if (step.type === "text") return (val.text || "").trim().length > 2;
    if (step.type === "textarea") return (val.text || "").trim().length > 5;
    if (step.type === "radio") return !!val.choice;
    if (step.type === "choice+text") return !!val.choice && (val.text || "").trim().length > 3;
    if (step.type === "radio+text") return !!val.choice;
    return true;
  }

  function advance() {
    if (!canAdvance()) return;
    setDirection("forward");
    if (isLast) {
      setSubmitted(true);
    } else {
      setCurrent((c) => c + 1);
    }
  }

  function back() {
    if (current === 0) return;
    setDirection("back");
    setCurrent((c) => c - 1);
  }

  function handleKey(e) {
    if (e.key === "Enter" && e.metaKey) advance();
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.card}>
          <div style={styles.logoBlock}>
            <span style={styles.logo}>oRise</span>
            <span style={styles.logoDivider}>·</span>
            <span style={styles.logoSignal}>Signal</span>
          </div>
          <div style={{ height: "28px" }} />
          <div style={{ ...styles.pill, background: HIGHLIGHT, color: ACCENT }}>Received</div>
          <h1 style={styles.doneTitle}>Thank you.</h1>
          <p style={styles.doneText}>
            Your Signal is in. We&#39;ll review it and reach out personally — usually within a few days.
            Nothing gets lost here.
          </p>
          <div style={styles.divider} />
          <p style={{ ...styles.hint, marginTop: 0 }}>
            Questions? Reach out to your growth contact directly.
          </p>
        </div>
      </div>
    );
  }

  const val = getValue(step.field);

  return (
    <div style={styles.page} onKeyDown={handleKey}>
      {/* Progress bar */}
      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${progress}%`,
            transition: "width 0.4s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.logoBlock}>
          <span style={styles.logo}>oRise</span>
          <span style={styles.logoDivider}>·</span>
          <span style={styles.logoSignal}>Signal</span>
        </div>
        <span style={styles.stepCount}>{current + 1} / {steps.length}</span>
      </div>

      {/* Card */}
      <div style={styles.card}>
        <div style={styles.questionBlock}>
          {step.optional && (
            <span style={styles.optionalBadge}>Optional</span>
          )}
          <h2 style={styles.question}>{step.question}</h2>
          {step.hint && <p style={styles.hint}>{step.hint}</p>}
        </div>

        <div style={styles.inputBlock}>
          {/* Plain text */}
          {step.type === "text" && (
            <input
              autoFocus
              style={styles.input}
              placeholder={step.placeholder}
              value={val.text || ""}
              onChange={(e) => updateField(step.field, "text", e.target.value)}
            />
          )}

          {/* Textarea */}
          {step.type === "textarea" && (
            <textarea
              autoFocus
              style={styles.textarea}
              placeholder={step.placeholder}
              value={val.text || ""}
              onChange={(e) => updateField(step.field, "text", e.target.value)}
            />
          )}

          {/* Radio only */}
          {step.type === "radio" && (
            <>
              <div style={styles.choices}>
                {step.choices.map((c) => (
                  <button
                    key={c}
                    style={{
                      ...styles.choiceBtn,
                      ...(val.choice === c ? styles.choiceBtnActive : {}),
                    }}
                    onClick={() => updateField(step.field, "choice", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {step.textChoices && val.choice && step.textChoices.includes(val.choice) && (
                <textarea
                  autoFocus
                  style={{ ...styles.textarea, marginTop: "20px" }}
                  placeholder={step.textPlaceholder}
                  value={val.text || ""}
                  onChange={(e) => updateField(step.field, "text", e.target.value)}
                />
              )}
            </>
          )}

          {/* Choice + text */}
          {step.type === "choice+text" && (
            <>
              <div style={styles.choices}>
                {step.choices.map((c) => (
                  <button
                    key={c}
                    style={{
                      ...styles.choiceBtn,
                      ...(val.choice === c ? styles.choiceBtnActive : {}),
                    }}
                    onClick={() => updateField(step.field, "choice", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {val.choice === step.otherChoice && (
                <input
                  autoFocus
                  style={{ ...styles.input, marginTop: "20px" }}
                  placeholder={step.otherPlaceholder}
                  value={val.otherText || ""}
                  onChange={(e) => updateField(step.field, "otherText", e.target.value)}
                />
              )}
              {val.choice && (
                <textarea
                  style={{ ...styles.textarea, marginTop: "20px" }}
                  placeholder={step.placeholder}
                  value={val.text || ""}
                  onChange={(e) => updateField(step.field, "text", e.target.value)}
                />
              )}
            </>
          )}

          {/* Radio + text */}
          {step.type === "radio+text" && (
            <>
              <div style={styles.choices}>
                {step.choices.map((c) => (
                  <button
                    key={c}
                    style={{
                      ...styles.choiceBtn,
                      ...(val.choice === c ? styles.choiceBtnActive : {}),
                    }}
                    onClick={() => updateField(step.field, "choice", c)}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {val.choice && (
                <textarea
                  style={{ ...styles.textarea, marginTop: "20px" }}
                  placeholder={step.placeholder}
                  value={val.text || ""}
                  onChange={(e) => updateField(step.field, "text", e.target.value)}
                />
              )}
            </>
          )}
        </div>

        {/* Navigation */}
        <div style={styles.nav}>
          {current > 0 ? (
            <button style={styles.backBtn} onClick={back}>← Back</button>
          ) : (
            <span />
          )}
          <button
            style={{
              ...styles.nextBtn,
              opacity: canAdvance() ? 1 : 0.35,
              cursor: canAdvance() ? "pointer" : "default",
            }}
            onClick={advance}
          >
            {isLast ? "Submit Signal" : "Continue →"}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f5f4ef",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "'Georgia', 'Times New Roman', serif",
    padding: "0 16px 60px",
  },
  progressTrack: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    height: "3px",
    background: "#e0dfd8",
    zIndex: 100,
  },
  progressFill: {
    height: "100%",
    background: ACCENT,
    borderRadius: "0 2px 2px 0",
  },
  header: {
    width: "100%",
    maxWidth: "620px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "32px 0 24px",
  },
  logoBlock: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  logo: {
    fontSize: "15px",
    fontWeight: "700",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: ACCENT,
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
  },
  logoDivider: {
    fontSize: "14px",
    color: "#ccc",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: "300",
    lineHeight: "1",
  },
  logoSignal: {
    fontSize: "15px",
    fontWeight: "400",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: HIGHLIGHT,
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    background: ACCENT,
    padding: "3px 9px",
    borderRadius: "3px",
  },
  stepCount: {
    fontSize: "13px",
    color: "#999",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    letterSpacing: "0.04em",
  },
  card: {
    width: "100%",
    maxWidth: "620px",
    background: "#ffffff",
    borderRadius: "16px",
    padding: "48px 52px 40px",
    boxShadow: "0 2px 24px rgba(0,0,0,0.06)",
  },
  questionBlock: {
    marginBottom: "32px",
    position: "relative",
  },
  optionalBadge: {
    display: "inline-block",
    fontSize: "11px",
    fontFamily: "'Helvetica Neue', sans-serif",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: "#aaa",
    marginBottom: "10px",
  },
  question: {
    fontSize: "26px",
    lineHeight: "1.3",
    color: ACCENT,
    margin: "0 0 12px",
    fontWeight: "normal",
  },
  hint: {
    fontSize: "15px",
    color: "#888",
    margin: 0,
    lineHeight: "1.6",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
  },
  inputBlock: {
    marginBottom: "36px",
  },
  input: {
    width: "100%",
    border: "none",
    borderBottom: `2px solid ${ACCENT}`,
    background: "transparent",
    fontSize: "17px",
    fontFamily: "'Georgia', serif",
    color: ACCENT,
    padding: "10px 0",
    outline: "none",
    boxSizing: "border-box",
  },
  textarea: {
    width: "100%",
    border: `1.5px solid #ddd`,
    borderRadius: "10px",
    background: "#fafaf8",
    fontSize: "16px",
    fontFamily: "'Georgia', serif",
    color: ACCENT,
    padding: "16px",
    outline: "none",
    boxSizing: "border-box",
    minHeight: "110px",
    resize: "vertical",
    lineHeight: "1.6",
    transition: "border-color 0.2s",
  },
  choices: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  choiceBtn: {
    textAlign: "left",
    background: "#fafaf8",
    border: "1.5px solid #e0dfd8",
    borderRadius: "10px",
    padding: "14px 18px",
    fontSize: "15px",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    color: "#444",
    cursor: "pointer",
    transition: "all 0.15s",
  },
  choiceBtnActive: {
    background: ACCENT,
    borderColor: ACCENT,
    color: HIGHLIGHT,
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backBtn: {
    background: "none",
    border: "none",
    fontSize: "14px",
    fontFamily: "'Helvetica Neue', sans-serif",
    color: "#aaa",
    cursor: "pointer",
    padding: 0,
    letterSpacing: "0.02em",
  },
  nextBtn: {
    background: ACCENT,
    color: HIGHLIGHT,
    border: "none",
    borderRadius: "50px",
    padding: "14px 28px",
    fontSize: "15px",
    fontFamily: "'Helvetica Neue', 'Arial', sans-serif",
    fontWeight: "600",
    letterSpacing: "0.03em",
    cursor: "pointer",
    transition: "opacity 0.2s",
  },
  cmdEnter: {
    textAlign: "right",
    marginTop: "14px",
    fontSize: "12px",
    color: "#ccc",
    fontFamily: "'Helvetica Neue', sans-serif",
    marginBottom: 0,
  },
  pill: {
    display: "inline-block",
    padding: "6px 14px",
    borderRadius: "50px",
    fontSize: "12px",
    fontFamily: "'Helvetica Neue', sans-serif",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    marginBottom: "20px",
  },
  doneTitle: {
    fontSize: "42px",
    fontWeight: "normal",
    color: ACCENT,
    margin: "0 0 16px",
  },
  doneText: {
    fontSize: "17px",
    color: "#555",
    lineHeight: "1.7",
    fontFamily: "'Helvetica Neue', sans-serif",
    margin: "0 0 32px",
  },
  divider: {
    height: "1px",
    background: "#eee",
    margin: "0 0 24px",
  },
};