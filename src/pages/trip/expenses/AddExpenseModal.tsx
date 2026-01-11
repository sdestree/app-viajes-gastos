type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function AddExpenseModal({
  isOpen,
  onClose,
  children,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}
