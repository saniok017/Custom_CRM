import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../authConfig";
import { 
    Button, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText 
} from "@mui/material";
import LoginIcon from '@mui/icons-material/Login';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WebIcon from '@mui/icons-material/Web';

/**
 * Renders a dropdown button which, when selected, will show login options
 */
export const SignInButtonMUI = () => {
    const { instance } = useMsal();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(loginRequest).catch(e => {
                console.log(e);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(loginRequest).catch(e => {
                console.log(e);
            });
        }
        handleClose();
    }

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />}
                startIcon={<LoginIcon />}
                aria-controls={open ? 'sign-in-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                Sign in
            </Button>
            <Menu
                id="sign-in-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'sign-in-button',
                }}
            >
                <MenuItem onClick={() => handleLogin("popup")}>
                    <ListItemIcon>
                        <WebIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign in using Popup</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleLogin("redirect")}>
                    <ListItemIcon>
                        <OpenInNewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign in using Redirect</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}