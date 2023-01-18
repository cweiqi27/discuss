import SolidButton from "components/button/SolidButton";
import type { ButtonProps, HandleClick, ModalProps } from "types/component";
import { useModalStore } from "store/postStore";
import Modal from "./Modal";

type ModalPropsWithoutColor = Pick<ModalProps, "title" | "description">;

type ModalGenericProps = ModalPropsWithoutColor &
  ButtonProps & {
    buttonYes: string;
    buttonNo: string;
    handleClickNo: HandleClick;
  };

const ModalGeneric = (props: ModalGenericProps) => {
  return (
    <Modal
      title={props.title}
      description={props.description}
      bgColor="bg-gradient-to-br from-zinc-600/80 to-zinc-600/50"
      titleColor="text-zinc-100"
      descColor="text-zinc-300"
    >
      <SolidButton
        colorType={props.colorType}
        size={props.size}
        handleClick={props.handleClick}
        type={props.type}
      >
        {props.buttonYes}
      </SolidButton>
      <SolidButton
        colorType="btn-primary"
        size={props.size}
        handleClick={props.handleClickNo}
        type={props.type}
      >
        {props.buttonNo}
      </SolidButton>
    </Modal>
  );
};

export default ModalGeneric;
