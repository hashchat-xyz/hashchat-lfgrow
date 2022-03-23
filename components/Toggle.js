// Toggle.js
import React from 'react'
import { func, string } from 'prop-types';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import { lightTheme, darkTheme } from '../src/theme';



const Toggle = ({theme, toggleTheme}) => {
    // const [theme, setTheme] = React.useState(null)
    const isLight = theme === lightTheme

    return (
        <button onClick={toggleTheme} >
            <LightModeOutlinedIcon />
            <DarkModeOutlinedIcon />
        </button>
        );
    };

// Toggle.propTypes = {
//     theme: any,
//     toggleTheme: func.isRequired,
// }

export default Toggle;