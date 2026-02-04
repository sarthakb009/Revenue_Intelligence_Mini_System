import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { MetricCard } from "../components/ui";
import { DriversBarChart } from "../components/charts";
import { formatCurrency } from "../utils/format";
import type { Drivers } from "../types";

interface DriversSectionProps {
  drivers: Drivers | null;
  loading: boolean;
}

export function DriversSection({ drivers, loading }: DriversSectionProps) {
  if (loading && !drivers) return null;
  if (!drivers) return null;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h2"
        sx={{ fontSize: "1.125rem", mb: 1.5, color: "text.secondary" }}
      >
        Revenue drivers
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Pipeline size"
            value={formatCurrency(drivers.pipeline_size)}
            secondary={`${drivers.pipeline_deal_count} open deals`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Win rate"
            value={`${drivers.win_rate_percent}%`}
            secondary={`${drivers.closed_won_count} won / ${drivers.closed_lost_count} lost`}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Avg deal size"
            value={formatCurrency(drivers.average_deal_size)}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Sales cycle"
            value={`${drivers.average_sales_cycle_days} days`}
          />
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <DriversBarChart drivers={drivers} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
