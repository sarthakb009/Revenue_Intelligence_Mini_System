import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../../utils/format";
import type { Drivers } from "../../types";

interface DriversBarChartProps {
  drivers: Drivers;
}

const CHART_ITEMS = [
  { key: "pipeline_size", label: "Pipeline size", fmt: (v: number) => formatCurrency(v) },
  { key: "win_rate_percent", label: "Win rate", fmt: (v: number) => v + "%" },
  { key: "average_deal_size", label: "Avg deal size", fmt: (v: number) => formatCurrency(v) },
  { key: "average_sales_cycle_days", label: "Cycle (days)", fmt: (v: number) => v + "d" },
] as const;

export function DriversBarChart({ drivers }: DriversBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!drivers || !svgRef.current) return;
    const el = svgRef.current;
    const w = el.clientWidth || 400;
    const h = 180;
    d3.select(el).selectAll("*").remove();

    const data = CHART_ITEMS.map((d) => ({
      label: d.label,
      value: drivers[d.key] as number,
      fmt: d.fmt,
    }));
    const labelWidth = 120;
    const barStart = labelWidth + 8;
    const barWidth = w - labelWidth - 100;
    const maxVal = d3.max(data, (d) => d.value) ?? 1;
    const scale = d3.scaleLinear().domain([0, maxVal]).range([0, barWidth]);

    const g = d3
      .select(el)
      .attr("viewBox", `0 0 ${w} ${h}`)
      .append("g")
      .attr("transform", "translate(24, 12)");

    const barColor = theme.palette.primary?.main ?? "#0d5c2e";
    const textColor = theme.palette.text?.primary ?? "#1a1915";
    const secondaryColor = theme.palette.text?.secondary ?? "#4a4842";

    data.forEach((d, i) => {
      const y = 8 + i * 38;
      g.append("text")
        .attr("x", 0)
        .attr("y", y + 15)
        .attr("font-family", "IBM Plex Sans, sans-serif")
        .attr("font-size", "12px")
        .attr("fill", textColor)
        .text(d.label);
      g.append("rect")
        .attr("x", barStart)
        .attr("y", y)
        .attr("width", scale(d.value))
        .attr("height", 22)
        .attr("fill", barColor)
        .attr("opacity", 0.85)
        .attr("rx", 3);
      g.append("text")
        .attr("x", barStart + scale(d.value) + 8)
        .attr("y", y + 15)
        .attr("font-family", "IBM Plex Mono, monospace")
        .attr("font-size", "11px")
        .attr("fill", secondaryColor)
        .text(d.fmt(d.value));
    });
  }, [drivers, theme]);

  return <svg ref={svgRef} width="100%" height={200} style={{ maxWidth: 480 }} />;
}
