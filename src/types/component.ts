import type { Dispatch, SetStateAction } from "react";

// Reusable types for Button
type ButtonType =
  | "btn-primary"
  | "btn-secondary"
  | "btn-tertiary"
  | "btn-primary-disabled"
  | "btn-secondary-disabled"
  | "btn-tertiary-disabled";

type ButtonSize = "btn-sm" | "btn-md" | "btn-lg";

export type HandleClick = (
  event: React.MouseEvent<HTMLButtonElement>,
  id: number
) => void;

export type ButtonProps = {
  handleClick: HandleClick;
  children?: React.ReactNode;
  type: ButtonType;
  size: ButtonSize;
};

// Reusable types for Modal
export type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  bgColor: string;
  children?: React.ReactNode;
};
