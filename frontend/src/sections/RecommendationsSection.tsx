import { Box, Card, CardContent, List, ListItem, ListItemText, Skeleton, Typography } from "@mui/material";
import { SectionCard } from "../components/ui";
import type { Recommendations } from "../types";

interface RecommendationsSectionProps {
  recs: Recommendations | null;
  loading: boolean;
}

export function RecommendationsSection({ recs, loading }: RecommendationsSectionProps) {
  if (loading && !recs) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Skeleton height={28} width="60%" sx={{ mb: 1 }} />
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={20} sx={{ mb: 0.5 }} />
          ))}
        </CardContent>
      </Card>
    );
  }
  if (!recs?.recommendations?.length) {
    return (
      <SectionCard title="Recommendations">
        <Typography variant="body2" color="text.secondary">
          No recommendations right now.
        </Typography>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="What to do next">
      <List dense disablePadding>
        {recs.recommendations.map((text, i) => (
          <ListItem key={i} alignItems="flex-start" sx={{ py: 0.5, px: 0 }}>
            <Box
              sx={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                bgcolor: "primary.main",
                mt: 1,
                mr: 1.5,
                flexShrink: 0,
              }}
            />
            <ListItemText
              primary={text}
              primaryTypographyProps={{ fontSize: "0.875rem", sx: { lineHeight: 1.4 } }}
            />
          </ListItem>
        ))}
      </List>
    </SectionCard>
  );
}
