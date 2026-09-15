import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Yagona tugma komponenti.
 * variant: primary | ghost | quiet
 * as: 'button' | 'a' | 'link'  (link = react-router Link)
 */
const MotionLink = motion(Link);
const ELEMENTS = { button: motion.button, a: motion.a, link: MotionLink };

export function Button({
  as = 'button',
  variant = 'primary',
  size,
  block,
  className = '',
  children,
  ...rest
}) {
  const Component = ELEMENTS[as] || ELEMENTS.button;
  const classes = [
    'btn',
    `btn--${variant}`,
    size === 'lg' ? 'btn--lg' : '',
    block ? 'btn--block' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} whileTap={{ scale: 0.97 }} {...rest}>
      {children}
    </Component>
  );
}
