import { Card, CardContent, Typography } from "@mui/material";

interface MetricCardProps {
  label: string;
  value: React.ReactNode;
  secondary?: React.ReactNode;
  valueColor?: "primary" | "success" | "error" | "text";
  sx?: object;
}

export function MetricCard({
  label,
  value,
  secondary,
  valueColor = "text",
  sx,
}: MetricCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%", ...sx }}>
      <CardContent>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography
          variant="h3"
          sx={{
            fontSize: "1.25rem",
            ...(valueColor !== "text" && { color: `${valueColor}.main` }),
          }}
        >
          {value}
        </Typography>
        {secondary != null && (
          <Typography variant="body2" color="text.secondary">
            {secondary}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
