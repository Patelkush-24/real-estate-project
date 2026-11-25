// Labelled input with inline validation message.
export default function Field({ label, error, as = "input", children, ...rest }) {
  const Tag = as;
  return (
    <label className={`field ${error ? "bad" : ""}`}>
      <span>{label}</span>
      <Tag {...rest}>{children}</Tag>
      {error && <em role="alert">{error}</em>}
    </label>
  );
}
