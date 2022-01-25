import {TextField} from "@mui/material";
import { styled } from '@mui/material/styles';



const CustomTextField = styled(TextField)({
	"& .MuiFormLabel-root": {
                        color: "hsla(147, 100%, 33%, 1)"
                    },

    "& .MuiInput-underline:before": {
                        borderBottomColor: "hsla(110, 9%, 50%, 1)"
          },

	'& .MuiOutlinedInput-root': {
	    '& fieldset': {
	      borderColor: "hsla(110, 9%, 50%, 1)",
	    }
	},
})



export default CustomTextField;