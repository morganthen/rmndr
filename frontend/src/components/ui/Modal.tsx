import { useEffect, useRef, type ReactNode } from "react";

export interface ModalProps {
  children: ReactNode;
  isModalOpen: boolean;
  onClose: () => void;
  heading: string;
}

function Modal({ children, isModalOpen, onClose, heading }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isModalOpen && !dialog.open) {
      dialog.showModal();
    } else if (!isModalOpen && dialog.open) {
      dialog.close();
    }
  }, [isModalOpen]);

  const handleModalCancel = (e: React.SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <dialog
      ref={dialogRef}
      onCancel={handleModalCancel}
      onClose={onClose}
      className="relative m-auto open:flex min-h-64 w-full max-w-sm flex-col justify-center rounded-2xl border border-clay/50 bg-bone p-4 shadow-lg backdrop:bg-ink/50 backdrop:backdrop-blur-sm"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full p-1.5 text-clay transition-all  hover:bg-tan hover:text-ink"
      >
        x
      </button>
      <h2 className="mb-3 pr-6 text-sm font-semibold uppercase tracking-wide text-ink">
        {heading}
      </h2>
      {children}
    </dialog>
  );
}

export default Modal;
