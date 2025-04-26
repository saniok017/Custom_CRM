import React, { useState } from "react";
import { useMsal } from "@azure/msal-react";
import { 
    Button, 
    Menu, 
    MenuItem, 
    ListItemIcon, 
    ListItemText 
} from "@mui/material";
import LogoutIcon from '@mui/icons-material/Logout';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WebIcon from '@mui/icons-material/Web';

/**
 * Renders a dropdown button which, when selected, will show logout options
 */
export const SignOutButtonMUI = () => {
    const { instance } = useMsal();
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
        handleClose();
    }

    return (
        <>
            <Button
                variant="outlined"
                color="inherit"
                onClick={handleClick}
                endIcon={<ArrowDropDownIcon />}
                startIcon={<LogoutIcon />}
                aria-controls={open ? 'sign-out-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
            >
                Sign out
            </Button>
            <Menu
                id="sign-out-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'sign-out-button',
                }}
            >
                <MenuItem onClick={() => handleLogout("popup")}>
                    <ListItemIcon>
                        <WebIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign out using Popup</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleLogout("redirect")}>
                    <ListItemIcon>
                        <OpenInNewIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Sign out using Redirect</ListItemText>
                </MenuItem>
            </Menu>
        </>
    );
}