import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import TariLogo from "./content/tari-logo.svg";
import MetamaskLogo from "./content/metamask-logo.svg";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { TariWalletDaemonConnectDialog } from "./TariWalletDaemonConnectDialog";
import {
  MetamaskTariProvider,
  TariPermissions,
  TariProvider,
  TariUniverseProvider,
  TariUniverseProviderParameters,
  WalletConnectTariProvider,
} from "@tari-project/tarijs";
import {
  TariPermissionKeyList,
  TariPermissionAccountInfo,
  TariPermissionTransactionsGet,
  TariPermissionSubstatesRead,
  TariPermissionTemplatesRead,
  TariPermissionTransactionSend,
} from "@tari-project/tarijs/dist/providers/wallet_daemon";
import WalletConnectLogo from "./content/walletconnect-logo.svg";

const SIGNALING_SERVER_URL = import.meta.env.VITE_SIGNALING_SERVER_ADDRESS || "http://localhost:9100";
const SNAP_ID = import.meta.env.VITE_SNAP_ORIGIN || "local:http://localhost:8080";
const WALLET_CONNECT_PROJECT_ID = import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || null;

// Minimal permissions for the example site
// But each application will have different permission needs
const walletDaemonPermissions = new TariPermissions();
walletDaemonPermissions
  // Required for createFreeTestCoins
  .addPermission("Admin")
  .addPermission(new TariPermissionKeyList())
  .addPermission(new TariPermissionAccountInfo())
  .addPermission(new TariPermissionTransactionsGet())
  .addPermission(new TariPermissionSubstatesRead())
  .addPermission(new TariPermissionTemplatesRead())
  .addPermission(new TariPermissionTransactionSend());
const walletDaemonOptionalPermissions = new TariPermissions();

export interface WalletSelectionProps {
  open: boolean;
  onConnected: (provider: TariProvider) => void;
  onClose: () => void;
}

export function TariWalletSelectionDialog(props: WalletSelectionProps) {
  const { onClose, open, onConnected } = props;

  const [walletDaemonOpen, setWalletDaemonOpen] = React.useState(false);
  const handleClose = () => {
    setWalletDaemonOpen(false);
    onClose();
  };

  const onWalletDaemonClick = () => {
    setWalletDaemonOpen(true);
  };

  const onTariUniverseClick = async () => {
    const params: TariUniverseProviderParameters = {
      permissions: walletDaemonPermissions,
      optionalPermissions: walletDaemonOptionalPermissions,
    };
    const provider = new TariUniverseProvider(params);
    onConnected(provider);
    handleClose();
  };

  const onMetamaskClick = async () => {
    const metamaskProvider = new MetamaskTariProvider(SNAP_ID, window.ethereum);
    await metamaskProvider.connect();
    onConnected(metamaskProvider);
    handleClose();
  };

  const onWalletConnectClick = async () => {
    const projectId = WALLET_CONNECT_PROJECT_ID;
    const walletConnectProvider = new WalletConnectTariProvider(projectId);
    handleClose();
    await walletConnectProvider.connect();
    onConnected(walletConnectProvider);
  };

  return (
    <Dialog fullWidth={true} onClose={handleClose} open={open}>
      <Box sx={{ padding: 4, borderRadius: 4 }}>
        <Stack direction="row" justifyContent="space-between" spacing={2}>
          <Typography style={{ fontSize: 24 }}>Connect a wallet</Typography>
          <IconButton aria-label="copy" onClick={handleClose}>
            <CloseIcon style={{ fontSize: 24 }} />
          </IconButton>
        </Stack>
        <Divider sx={{ mt: 3, mb: 3 }} variant="middle" />
        <Grid container spacing={2} justifyContent="center">
          <Grid item xs={4}>
            <WalletConnectionMethodCard
              img={TariLogo}
              text="Tari Universe"
              callback={onTariUniverseClick}
            ></WalletConnectionMethodCard>
          </Grid>
          <Grid item xs={4}>
            <WalletConnectionMethodCard
              img={TariLogo}
              text="Tari Wallet Daemon"
              callback={onWalletDaemonClick}
            ></WalletConnectionMethodCard>
            <TariWalletDaemonConnectDialog
              open={walletDaemonOpen}
              onClose={handleClose}
              onConnected={onConnected}
              signalingServerUrl={SIGNALING_SERVER_URL}
              permissions={walletDaemonPermissions}
              optionalPermissions={walletDaemonOptionalPermissions}
            ></TariWalletDaemonConnectDialog>
          </Grid>
          <Grid item xs={4}>
            <WalletConnectionMethodCard
              img={MetamaskLogo}
              text="MetaMask"
              callback={onMetamaskClick}
            ></WalletConnectionMethodCard>
          </Grid>
          <Grid item xs={4}>
            <WalletConnectionMethodCard
              img={WalletConnectLogo}
              text="WalletConnect"
              callback={onWalletConnectClick}
            ></WalletConnectionMethodCard>
          </Grid>
        </Grid>
      </Box>
    </Dialog>
  );
}

function WalletConnectionMethodCard({ img, text, callback }: any) {
  return (
    <Card
      variant="outlined"
      elevation={0}
      sx={{
        mty: 4,
        padding: 4,
        borderRadius: 4,
        width: "175px",
        height: "175px",
        cursor: "pointer",
      }}
    >
      <CardContent
        onClick={async () => {
          await callback();
        }}
      >
        <Stack direction="column" spacing={2} alignItems="center">
          <Box sx={{ textAlign: "center", width: "100%" }}>
            <img style={{ borderRadius: 8, width: "50px", height: "50px" }} src={img} />
          </Box>
          <Typography textAlign="center">{text}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
