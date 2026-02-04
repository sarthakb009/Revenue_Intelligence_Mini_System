import { Card, CardContent, Typography } from "@mui/material";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  sx?: object;
}

export function SectionCard({ title, children, sx }: SectionCardProps) {
  return (
    <Card variant="outlined" sx={{ height: "100%", ...sx }}>
      <CardContent>
        <Typography
          variant="h2"
          sx={{ fontSize: "1.125rem", mb: 1.5, color: "text.secondary" }}
        >
          {title}
        </Typography>
        {children}
      </CardContent>
    </Card>
  );
}
