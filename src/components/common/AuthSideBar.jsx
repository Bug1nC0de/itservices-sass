import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Box, Divider, IconButton, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { tokens } from '../../theme';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  HomeOutlined,
  MenuOutlined,
  DomainOutlined,
  LiveHelpOutlined,
  Groups2Outlined,
  ReceiptLongOutlined,
  Diversity2Outlined,
  FormatListNumberedOutlined,
  ListAltOutlined,
} from '@mui/icons-material';

const Item = ({ title, icon, to, selected, setSelected }) => {
  const navigate = useNavigate();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const navToScreen = () => {
    setSelected(title);

    navigate(`${to}`);
  };

  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={navToScreen}
      icon={icon}
    >
      <Typography variant="h6">{title}</Typography>
    </MenuItem>
  );
};

const AuthSideBar = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const location = useLocation();

  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selected, setSelected] = useState('');

  if (location.pathname === '/') return null;

  if (!userInfo) return null;

  if (userInfo.profileType === 'itservices') {
    return (
      <Box
        sx={{
          height: '100vh',
          '& .pro-sidebar-root': {
            background: `${colors.primary[400]} !important`,
          },
          '& .pro-icon-wrapper': {
            backgroundColor: 'transparent !important',
          },
          '& .pro-inner-item': {
            padding: '5px 35px 5px 20px !important',
          },
          '& .pro-inner-item:hover': {
            color: '#868dfb !important',
          },
          '& .pro-menu-item.active': {
            color: '#6870fa !important',
          },
        }}
      >
        <Sidebar className="sidebar" collapsed={isCollapsed}>
          <Menu>
            <Divider
              variant="middle"
              sx={{ marginBottom: '5px', marginTop: '5px' }}
            />
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlined /> : undefined}
              style={{
                margin: '10px 0 20px 0',
                color: colors.primary[500],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={colors.grey[100]}
                  >
                    {userInfo && userInfo.name}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlined />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
            <Item
              title="Dashboard"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/dashboard"
            />
            <Item
              title="Helpdesk"
              icon={<LiveHelpOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/helpdesk"
            />
            <Item
              title="Sales"
              icon={<ReceiptLongOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/sales"
            />
            <Item
              title="Projects"
              icon={<ListAltOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/projects"
            />
            <Item
              title="TODOS"
              icon={<FormatListNumberedOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/todos"
            />
            <Item
              title="Clients"
              icon={<Groups2Outlined />}
              selected={selected}
              setSelected={setSelected}
              to="/clients"
            />
            <Item
              title="Management"
              icon={<Diversity2Outlined />}
              selected={selected}
              setSelected={setSelected}
              to="/management"
            />
          </Menu>
        </Sidebar>
      </Box>
    );
  } else if (userInfo.profileType === 'user') {
    return (
      <Box
        sx={{
          height: '100vh',
          '& .pro-sidebar-inner': {
            background: `${colors.primary[400]} !important`,
          },
          '& .pro-icon-wrapper': {
            backgroundColor: 'transparent !important',
          },
          '& .pro-inner-item': {
            padding: '5px 35px 5px 20px !important',
          },
          '& .pro-inner-item:hover': {
            color: '#868dfb !important',
          },
          '& .pro-menu-item.active': {
            color: '#6870fa !important',
          },
        }}
      >
        <Sidebar className="sidebar" collapsed={isCollapsed}>
          <Menu>
            <Divider
              variant="middle"
              sx={{ marginBottom: '5px', marginTop: '5px' }}
            />
            <MenuItem
              onClick={() => setIsCollapsed(!isCollapsed)}
              icon={isCollapsed ? <MenuOutlined /> : undefined}
              style={{
                margin: '10px 0 20px 0',
                color: colors.primary[500],
              }}
            >
              {!isCollapsed && (
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  ml="15px"
                >
                  <Typography
                    variant="h5"
                    fontWeight="bold"
                    color={colors.grey[100]}
                  >
                    {userInfo && userInfo.name}
                  </Typography>
                  <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                    <MenuOutlined />
                  </IconButton>
                </Box>
              )}
            </MenuItem>
            <Item
              title="Dashboard"
              icon={<HomeOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/dashboard"
            />
            <Item
              title="Helpdesk"
              icon={<LiveHelpOutlined />}
              selected={selected}
              setSelected={setSelected}
              to="/helpdesk"
            />
            <Item
              title="Sales"
              icon={<ReceiptLongOutlined />}
              selected={selected}
              setSelected={setSelected}
              to={`/sales`}
            />
            <Item
              title="Suppliers"
              icon={<ListAltOutlined />}
              selected={selected}
              setSelected={setSelected}
              to={`/suppliers`}
            />
            <Item
              title="Todos"
              icon={<FormatListNumberedOutlined />}
              selected={selected}
              setSelected={setSelected}
              to={`/todos`}
            />
            <Item
              title="Clients"
              icon={<Groups2Outlined />}
              selected={selected}
              setSelected={setSelected}
              to="/clients"
            />
            <Item
              title="Management"
              icon={<Diversity2Outlined />}
              selected={selected}
              setSelected={setSelected}
              to={`/management`}
            />
            <Item
              title="Call IT Services"
              icon={<DomainOutlined />}
              selected={selected}
              setSelected={setSelected}
              to={`/callitservices`}
            />
          </Menu>
        </Sidebar>
      </Box>
    );
  } else {
    return '';
  }
};

export default AuthSideBar;
