import type { Dispatch, SetStateAction } from "react";

// Reusable types for Button
type ButtonColorType =
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
  colorType: ButtonColorType;
  size: ButtonSize;
  type: "button" | "submit" | "reset";
};

// Reusable types for Modal
export type ModalProps = {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  bgColor?: string;
  titleColor?: string;
  descColor?: string;
  children?: React.ReactNode;
};
