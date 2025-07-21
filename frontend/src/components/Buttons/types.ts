export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>{
   name?: string;
   className?: string;
   id?: string;
   onClick?: () => void;
   disabled?: boolean;
   icon?: React.ReactNode;
   iconPosition?: 'left' | 'right';
}

