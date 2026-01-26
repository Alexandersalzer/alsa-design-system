import { Textarea } from './Textarea/Textarea';
import { Input } from './Input/Input';

export const formComponents: Record<string, React.ComponentType<any>> = {
  textarea: Textarea,
  input: Input,
};