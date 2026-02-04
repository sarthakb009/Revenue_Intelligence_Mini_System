import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import { MetricCard } from "../components/ui";
import { RevenueBarChart } from "../components/charts";
import { formatCurrency } from "../utils/format";
import type { Summary } from "../types";

interface SummarySectionProps {
  summary: Summary | null;
  loading: boolean;
}

export function SummarySection({ summary, loading }: SummarySectionProps) {
  if (loading && !summary) return null;
  if (!summary) return null;

  const gapPositive = summary.gap_percent >= 0;
  const qoqPositive = summary.qoq_change_percent >= 0;

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h2"
        sx={{ fontSize: "1.125rem", mb: 1.5, color: "text.secondary" }}
      >
        Quarter summary · {summary.quarter_label}
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Revenue (quarter)" value={formatCurrency(summary.current_quarter_revenue)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard label="Target" value={formatCurrency(summary.target)} />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="Gap"
            value={`${gapPositive ? "+" : ""}${summary.gap_percent}%`}
            valueColor={gapPositive ? "success" : "error"}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            label="QoQ change"
            value={`${qoqPositive ? "+" : ""}${summary.qoq_change_percent}%`}
            valueColor={qoqPositive ? "success" : "text"}
          />
        </Grid>
        <Grid item xs={12}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                Revenue vs target
              </Typography>
              <RevenueBarChart summary={summary} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
