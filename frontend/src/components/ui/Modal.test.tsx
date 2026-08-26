import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Modal, { type ModalProps } from "./Modal";
import userEvent from "@testing-library/user-event";

// Make the stubs behave like the real browser: showModal opens, close closes.
// This gives the <dialog> an `open` attribute so it's visible to getByRole.
beforeEach(() => {
  HTMLDialogElement.prototype.showModal = vi.fn(function (
    this: HTMLDialogElement,
  ) {
    this.open = true;
  });
  HTMLDialogElement.prototype.close = vi.fn(function (this: HTMLDialogElement) {
    this.open = false;
  });
  vi.clearAllMocks(); // reset call counts so assertions don't leak across tests
});

function renderModal(overrides: Partial<ModalProps> = {}): ModalProps {
  const props = {
    children: <div>child content</div>,
    isModalOpen: true,
    onClose: vi.fn(),
    heading: "New Category",
    ...overrides,
  };

  render(<Modal {...props} />);
  return props;
}

describe("Modal", () => {
  it("renders the heading and children", () => {
    renderModal();
    expect(screen.getByText("New Category")).toBeInTheDocument();
    expect(screen.getByText("child content")).toBeInTheDocument();
  });

  it("calls showModal when isModalOpen is true", () => {
    renderModal({ isModalOpen: true });
    expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
  });

  it("does not call showModal when isModalOpen is false", () => {
    renderModal({ isModalOpen: false });
    expect(HTMLDialogElement.prototype.showModal).not.toHaveBeenCalled();
  });

  it("calls onClose when the X button is clicked", async () => {
    const user = userEvent.setup();
    const props = renderModal();
    await user.click(screen.getByRole("button", { name: "Close" }));
    expect(props.onClose).toHaveBeenCalled();
  });

  it("calls onClose on Escape", () => {
    const props = renderModal();
    const dialog = screen.getByRole("dialog");
    fireEvent(dialog, new Event("cancel", { cancelable: true }));
    expect(props.onClose).toHaveBeenCalled();
  });
});
