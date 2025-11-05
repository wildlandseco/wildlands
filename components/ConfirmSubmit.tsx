// components/ConfirmSubmit.tsx
"use client";

type Props = {
  children: React.ReactNode;
  confirmText?: string;
  className?: string;
};

export default function ConfirmSubmit({
  children,
  confirmText = "Apply the default Habitat Stewardship playbook to this project? This will add predefined tasks and practices.",
  className = "",
}: Props) {
  return (
    <button
      type="submit"
      onClick={(e) => {
        const ok = window.confirm(confirmText);
        if (!ok) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      className={className}
    >
      {children}
    </button>
  );
}
