import { ListItem, ListItemText } from "@mui/material";

interface EmptyStateProps {
  primary: string;
  secondary?: string;
}

export function EmptyState({ primary, secondary }: EmptyStateProps) {
  return (
    <ListItem>
      <ListItemText primary={primary} secondary={secondary} />
    </ListItem>
  );
}
