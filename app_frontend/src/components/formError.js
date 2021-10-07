import { FormFeedback } from 'reactstrap';

const FormError = ({message}) => {
    return (
        <FormFeedback>
            {message}
        </FormFeedback>
    )
}

export default FormError;