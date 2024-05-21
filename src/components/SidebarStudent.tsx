import React, { useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import CssBaseline from "@mui/material/CssBaseline";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import AssessmentIcon from "@mui/icons-material/Assessment";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import ListItemText from "@mui/material/ListItemText";
import LogoutIcon from "@mui/icons-material/Logout";
import CreditScoreIcon from "@mui/icons-material/CreditScore";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import AddIcon from "@mui/icons-material/Add";
import BackHandIcon from "@mui/icons-material/BackHand";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import { Box } from "@mui/material";
const drawerWidth = 240;

interface Props {
  window?: () => Window;
}

interface Notification {
  id: number;
  message: string;
  isRead: boolean;
}

export default function ResponsiveDrawerStudent(props: Props) {
  const auth = localStorage.getItem("auth");
  const { window } = props;
  const [openItems, setOpenItems] = React.useState<{ [key: string]: boolean }>(
    {}
  );
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [notifications, setNotifications] = React.useState<Notification[]>([]);
  const [openNotifications, setOpenNotifications] = React.useState(false);

  const username = localStorage.getItem("username");

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/v1/notifications/${id}/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
      });
      if (!response.ok) {
        throw new Error("Error al eliminar la notificacion");
      }
      const data = await response.json();
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error("Error al eliminar notificacion:", error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      const response = await fetch(
        `http://localhost:8080/api/v1/notifications/${username}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + auth,
          },
        }
      );
      const data = await response.json();
      if (data.data.length > 0) {
        setNotifications(data.data);
      } else {
        setNotifications([]);
      }
    };

    fetchNotifications();
  }, [username]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleItemClick = (text: any) => {
    setOpenItems((prevOpenItems) => ({
      ...prevOpenItems,
      [text]: !prevOpenItems[text],
    }));
  };

  const handleNotificationsClick = () => {
    setOpenNotifications(true);
  };

  const handleCloseNotifications = () => {
    setOpenNotifications(false);
  };

  const drawer = (
    <div>
      <Toolbar />
      <List>
        {[
          {
            text: "Home",
            icon: <HomeIcon />,
            children: [],
            to: "/dashboard-student",
          },
          {
            text: "Loans",
            icon: <CreditScoreIcon />,
            children: [
              {
                text: "Current Loans",
                icon: <AddIcon />,
                children: [],
                to: "/student-loans",
              },
              {
                text: "Loan History",
                icon: <BackHandIcon />,
                children: [],
                to: "/history-loans",
              },
            ],
            to: "",
          },
          {
            text: "Reservations",
            icon: <AssessmentIcon />,
            children: [],
            to: "/reservations",
          },
          {
            text: "LogOut",
            icon: <LogoutIcon />,
            children: [],
            to: "/",
          },
        ].map((item) => (
          <React.Fragment key={item.text}>
            <ListItem disablePadding>
              {item.children.length > 0 ? (
                <ListItemButton onClick={() => handleItemClick(item.text)}>
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: "white" }} />
                </ListItemButton>
              ) : (
                <ListItemButton component={Link} to={item.to}>
                  <ListItemIcon sx={{ color: "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} sx={{ color: "white" }} />
                </ListItemButton>
              )}
            </ListItem>
            {openItems[item.text] && (
              <List sx={{ paddingLeft: 2 }}>
                {item.children.map((child) => (
                  <ListItem key={child.text} disablePadding>
                    <ListItemButton component={Link} to={child.to}>
                      <ListItemIcon sx={{ color: "white" }}>
                        {child.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={child.text}
                        sx={{ color: "white" }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  );

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
          bgcolor: "#121212",
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
          <IconButton
            color="inherit"
            onClick={handleNotificationsClick}
            sx={{ ml: "auto" }}
          >
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
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
              color: "white",
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
      <Modal
        open={openNotifications}
        onClose={handleCloseNotifications}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Notifications
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <ul>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <li>{notification.message}</li>
                    <IconButton
                      sx={{
                        height: "100%",
                        bgcolor: "red",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "white",
                          color: "black",
                        },
                      }}
                      onClick={() => handleDelete(notification.id)} // Update here
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                ))}
              </ul>
            </div>
          </Typography>
        </Box>
      </Modal>
    </Box>
  );
}
