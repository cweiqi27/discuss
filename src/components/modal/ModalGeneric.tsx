import SolidButton from "components/button/SolidButton";
import type { ButtonProps, HandleClick, ModalProps } from "types/component";
import Modal from "./Modal";

type ModalGenericProps = ModalProps &
  ButtonProps & {
    buttonYes: string;
    buttonNo: string;
    handleClickNo: HandleClick;
  };

const ModalGeneric = (props: ModalGenericProps) => {
  return (
    <Modal
      isOpen={props.isOpen}
      setIsOpen={props.setIsOpen}
      title={props.title}
      description={props.description}
      bgColor="bg-gradient-to-r from-zinc-600/60 to-zinc-600/80"
      titleColor="text-zinc-100"
      descColor="text-zinc-300"
    >
      <SolidButton
        type={props.type}
        size={props.size}
        handleClick={props.handleClick}
      >
        {props.buttonYes}
      </SolidButton>
      <SolidButton
        type="btn-primary"
        size={props.size}
        handleClick={props.handleClickNo}
      >
        {props.buttonNo}
      </SolidButton>
    </Modal>
  );
};

export default ModalGeneric;
