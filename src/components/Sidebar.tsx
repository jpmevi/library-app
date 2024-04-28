import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import AssessmentIcon from "@mui/icons-material/Assessment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import ListItemText from "@mui/material/ListItemText";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import SchoolIcon from '@mui/icons-material/School';
import MenuBookSharpIcon from '@mui/icons-material/MenuBookSharp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import CreditScoreIcon from '@mui/icons-material/CreditScore';
import RunningWithErrorsIcon from '@mui/icons-material/RunningWithErrors';
import LogoutIcon from '@mui/icons-material/Logout';
const drawerWidth = 240;

interface Props {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window?: () => Window;
}

export default function ResponsiveDrawer(props: Props) {
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const username = localStorage.getItem("username");
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          { text: "Home", icon: <HomeIcon /> },
          { text: "Books", icon: <MenuBookSharpIcon /> },
          { text: "Users", icon: <PeopleAltIcon /> },
          { text: "Careers", icon: <SchoolIcon /> },
          { text: "Loans", icon: <CreditScoreIcon /> },
          { text: "Arrears", icon: <RunningWithErrorsIcon /> },
          { text: "LogOut", icon: <LogoutIcon /> },
          // Agrega más elementos según sea necesario
        ].map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton>
              <ListItemIcon sx={{color:"white"}}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} sx={{color:"white"}} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: "#BAF266",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              bgcolor: "#121212",
            },
          }}
          open
        >
          <div className="titulo-sidebar">
              <div className="bloque-amarillo-2"></div>
              <h1 className="titulo-sidebar">CUNOC LIBRARY</h1>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center", 
              marginTop: "10%",
              color: "white"
            }}
          >
            <img
              src="https://xsgames.co/randomusers/avatar.php?g=male"
              alt="Avatar"
              style={{
                width: "150px", 
                height: "150px", 
                borderRadius: "50%",
              }}
            />
            <h4>{username}</h4>
          </div>
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}