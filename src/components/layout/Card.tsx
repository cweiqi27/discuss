import { motion } from "framer-motion";

type CardProps = {
  children: React.ReactNode;
  isFlexRow?: boolean;
  addStyles?: string;
};

const cardStyles = "flex rounded-md p-4";

const Card = (props: CardProps) => {
  return (
    <>
      <motion.div
        className={`${cardStyles} ${
          props.isFlexRow ? "flex-row" : "flex-col"
        } ${props.addStyles}`}
      >
        {props.children}
      </motion.div>
    </>
  );
};

export default Card;
