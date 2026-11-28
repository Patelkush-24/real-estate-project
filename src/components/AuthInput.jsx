// Input with a leading icon, optional trailing control (eye button) and inline error.
export default function AuthInput({ icon: Icon, label, error, right, ...rest }) {
  return (
    <label className={`ai ${error ? "bad" : ""}`}>
      <span className="ai-label">{label}</span>
      <span className="ai-box">
        {Icon && <Icon className="ai-icon" />}
        <input {...rest} />
        {right}
      </span>
      {error && <em role="alert">{error}</em>}
    </label>
  );
}
