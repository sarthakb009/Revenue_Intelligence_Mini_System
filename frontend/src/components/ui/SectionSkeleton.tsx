import { Grid, Skeleton } from "@mui/material";

const CARD_COUNT = 4;

export function SectionSkeleton() {
  return (
    <Grid container spacing={2}>
      {Array.from({ length: CARD_COUNT }).map((_, i) => (
        <Grid item xs={12} sm={6} md={3} key={i}>
          <Skeleton variant="rounded" height={120} />
        </Grid>
      ))}
    </Grid>
  );
}
