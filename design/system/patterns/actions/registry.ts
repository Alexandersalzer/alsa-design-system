import { FormPattern, GridForm } from './form';
import { ButtonGroup } from './ButtonGroup'
import { InputGroup } from './InputGroup'

export const actionsRegistry: Record<string, React.ComponentType<any>> = {
    form: FormPattern,
    gridForm: GridForm,
    buttonGroup: ButtonGroup,
    inputGroup: InputGroup,
};