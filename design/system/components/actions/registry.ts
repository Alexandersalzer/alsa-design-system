import Button from './Button/Button'
import { TextLink } from './TextLink/TextLink';

export const actionComponents: Record<string, React.ComponentType<any>> = {
  button: Button,
  link: TextLink,
};