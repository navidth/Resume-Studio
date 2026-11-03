import { Loader2 } from "lucide-react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "ghost" | "soft" | "danger" | "light" | "outline-light";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: "md" | "sm";
  icon?: ReactNode;
  loading?: boolean;
}

export function Button({ variant = "secondary", size = "md", icon, loading, children, className = "", disabled, ...rest }: ButtonProps) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${size === "sm" ? "btn-sm" : ""} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Loader2 size={16} className="spin" /> : icon}
      {children && <span className="btn-text">{children}</span>}
    </button>
  );
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  danger?: boolean;
}

export function IconButton({ label, danger, children, className = "", ...rest }: IconButtonProps) {
  return (
    <button type="button" className={`icon-btn ${danger ? "danger" : ""} ${className}`} aria-label={label} title={label} {...rest}>
      {children}
    </button>
  );
}

interface TextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  optional?: boolean;
  multiline?: boolean;
  rows?: number;
  type?: string;
  className?: string;
  autoFocus?: boolean;
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  hint,
  optional,
  multiline,
  rows = 3,
  type = "text",
  className = "",
  autoFocus,
}: TextFieldProps) {
  return (
    <label className={`field ${className}`}>
      <span className="field-label">
        <span>{label}</span>
        {optional && <span className="opt">Optional</span>}
      </span>
      {multiline ? (
        <textarea
          className="control"
          value={value}
          rows={rows}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
          spellCheck
        />
      ) : (
        <input
          className="control"
          type={type}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          autoFocus={autoFocus}
        />
      )}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

/** Textarea bound to a string[] — one entry per line. Empty lines are kept while typing and dropped on export. */
export function LinesField({
  label,
  lines,
  onChange,
  placeholder,
  hint,
  rows = 4,
  className = "",
}: {
  label: string;
  lines: string[];
  onChange: (lines: string[]) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  className?: string;
}) {
  return (
    <TextField
      className={className}
      label={label}
      multiline
      rows={rows}
      value={lines.join("\n")}
      onChange={(v) => onChange(v.split(/\r?\n/))}
      placeholder={placeholder}
      hint={hint}
    />
  );
}

export function EmptyState({ icon, title, text, action }: { icon: ReactNode; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="empty">
      {icon}
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}
