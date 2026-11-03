import { ArrowDown, ArrowUp, ChevronDown, Copy, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import { IconButton } from "../ui";

interface ItemCardProps {
  title: string;
  placeholder: string;
  subtitle?: string;
  index: number;
  total: number;
  onMove: (dir: -1 | 1) => void;
  onRemove: () => void;
  onDuplicate?: () => void;
  defaultOpen?: boolean;
  children: ReactNode;
}

export function ItemCard({ title, placeholder, subtitle, index, total, onMove, onRemove, onDuplicate, defaultOpen = true, children }: ItemCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const hasTitle = title.trim().length > 0;

  return (
    <div className="item" data-open={open}>
      <div className="item-head">
        <button type="button" className="toggle" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
          <ChevronDown size={16} className="chev" />
          <div style={{ minWidth: 0 }}>
            <div className={`item-title ${hasTitle ? "" : "placeholder"}`}>{hasTitle ? title : placeholder}</div>
            {subtitle && <div className="item-sub">{subtitle}</div>}
          </div>
        </button>
        <div className="item-actions">
          <IconButton label="Move up" onClick={() => onMove(-1)} disabled={index === 0}>
            <ArrowUp size={15} />
          </IconButton>
          <IconButton label="Move down" onClick={() => onMove(1)} disabled={index === total - 1}>
            <ArrowDown size={15} />
          </IconButton>
          {onDuplicate && (
            <IconButton label="Duplicate" onClick={onDuplicate}>
              <Copy size={15} />
            </IconButton>
          )}
          <IconButton label="Delete" danger onClick={onRemove}>
            <Trash2 size={15} />
          </IconButton>
        </div>
      </div>
      {open && <div className="item-body">{children}</div>}
    </div>
  );
}
