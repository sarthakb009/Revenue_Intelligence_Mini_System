import { Box, Container, Grid, Paper, Typography } from "@mui/material";
import { useFetch } from "./hooks/useFetch";
import { SectionSkeleton } from "./components/ui";
import {
  SummarySection,
  DriversSection,
  RiskSection,
  RecommendationsSection,
} from "./sections";
import type { Summary, Drivers, RiskFactors, Recommendations } from "./types";

const API_PATHS = {
  summary: "/summary",
  drivers: "/drivers",
  riskFactors: "/risk-factors",
  recommendations: "/recommendations",
} as const;

function App() {
  const summary = useFetch<Summary>(API_PATHS.summary);
  const drivers = useFetch<Drivers>(API_PATHS.drivers);
  const risk = useFetch<RiskFactors>(API_PATHS.riskFactors);
  const recs = useFetch<Recommendations>(API_PATHS.recommendations);

  const anyError = summary.error ?? drivers.error ?? risk.error ?? recs.error;
  const initialLoading =
    (summary.loading || drivers.loading || risk.loading || recs.loading) && !summary.data;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 3 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 3 }}>
          <Typography variant="h1" sx={{ fontSize: "1.75rem", color: "text.primary" }}>
            Revenue Intelligence
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Why we're behind or ahead this quarter, and what to do next.
          </Typography>
        </Box>

        {anyError && (
          <Paper
            sx={{
              p: 2,
              mb: 2,
              bgcolor: "error.light",
              color: "error.contrastText",
            }}
          >
            {anyError}
          </Paper>
        )}

        {initialLoading ? (
          <SectionSkeleton />
        ) : (
          <>
            <SummarySection summary={summary.data} loading={summary.loading} />
            <DriversSection drivers={drivers.data} loading={drivers.loading} />
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12} md={6}>
                <RiskSection risk={risk.data} loading={risk.loading} />
              </Grid>
              <Grid item xs={12} md={6}>
                <RecommendationsSection recs={recs.data} loading={recs.loading} />
              </Grid>
            </Grid>
          </>
        )}
      </Container>
    </Box>
  );
}

export default App;
