import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Tabs,
  Tab,
  Skeleton,
} from "@mui/material";
import { useState } from "react";
import { SectionCard, EmptyState } from "../components/ui";
import { formatCurrency } from "../utils/format";
import type { RiskFactors } from "../types";

interface RiskSectionProps {
  risk: RiskFactors | null;
  loading: boolean;
}

const LIST_ITEM_PROPS = {
  primaryTypographyProps: { fontSize: "0.875rem" },
  secondaryTypographyProps: { fontSize: "0.75rem" },
} as const;

export function RiskSection({ risk, loading }: RiskSectionProps) {
  const [tab, setTab] = useState(0);

  if (loading && !risk) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Skeleton height={32} width="40%" sx={{ mb: 1 }} />
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} height={24} sx={{ mb: 0.5 }} />
          ))}
        </CardContent>
      </Card>
    );
  }
  if (!risk) return null;

  return (
    <SectionCard title="Risk factors">
      <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ minHeight: 36, mb: 1 }}>
        <Tab label="Stale deals" sx={{ minHeight: 36, py: 0.5, textTransform: "none" }} />
        <Tab label="Reps" sx={{ minHeight: 36, py: 0.5, textTransform: "none" }} />
        <Tab label="Low activity" sx={{ minHeight: 36, py: 0.5, textTransform: "none" }} />
      </Tabs>

      {tab === 0 && (
        <List dense disablePadding>
          {risk.stale_deals.length === 0 ? (
            <EmptyState primary="No stale deals" secondary="Deals with 30+ days inactive" />
          ) : (
            risk.stale_deals.slice(0, 8).map((d) => (
              <ListItem key={d.deal_id} disableGutters sx={{ py: 0.25 }}>
                <ListItemText
                  primary={d.account_name ?? d.account_id}
                  secondary={`${d.rep_name} · ${d.days_inactive}d inactive · ${formatCurrency(d.amount)}`}
                  {...LIST_ITEM_PROPS}
                />
              </ListItem>
            ))
          )}
        </List>
      )}

      {tab === 1 && (
        <List dense disablePadding>
          {risk.underperforming_reps.length === 0 ? (
            <EmptyState primary="No underperforming reps" secondary="Win rate vs team" />
          ) : (
            risk.underperforming_reps.slice(0, 8).map((r) => (
              <ListItem key={r.rep_id} disableGutters sx={{ py: 0.25 }}>
                <ListItemText
                  primary={r.name}
                  secondary={`Win rate ${r.win_rate_percent}% · ${r.deals_closed} closed`}
                  {...LIST_ITEM_PROPS}
                />
              </ListItem>
            ))
          )}
        </List>
      )}

      {tab === 2 && (
        <List dense disablePadding>
          {risk.low_activity_accounts.length === 0 ? (
            <EmptyState primary="No low-activity accounts" secondary="Open deals, few touches" />
          ) : (
            risk.low_activity_accounts.slice(0, 8).map((a) => (
              <ListItem key={a.account_id} disableGutters sx={{ py: 0.25 }}>
                <ListItemText
                  primary={a.name}
                  secondary={`${a.segment} · ${a.open_deals} deal(s) · ${a.activity_count} activities`}
                  {...LIST_ITEM_PROPS}
                />
              </ListItem>
            ))
          )}
        </List>
      )}
    </SectionCard>
  );
}
