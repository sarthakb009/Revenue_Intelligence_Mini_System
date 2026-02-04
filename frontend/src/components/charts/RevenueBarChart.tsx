import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { useTheme } from "@mui/material/styles";
import { formatCurrency } from "../../utils/format";
import type { Summary } from "../../types";

interface RevenueBarChartProps {
  summary: Summary;
}

export function RevenueBarChart({ summary }: RevenueBarChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!summary || !svgRef.current) return;
    const el = svgRef.current;
    const w = el.clientWidth || 280;
    const h = 80;
    d3.select(el).selectAll("*").remove();

    const target = summary.target;
    const actual = summary.current_quarter_revenue;
    const max = Math.max(target, actual, 1);
    const scale = d3.scaleLinear().domain([0, max]).range([0, w - 60]);

    const g = d3
      .select(el)
      .attr("viewBox", `0 0 ${w} ${h}`)
      .append("g")
      .attr("transform", "translate(24, 16)");

    const barH = 20;
    const trackColor = theme.palette.divider || "#e8e4dc";
    const onTrackColor = theme.palette.success?.main ?? "#2d6a3e";
    const overTrackColor = theme.palette.secondary?.main ?? "#6b5a3b";

    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", scale(target))
      .attr("height", barH)
      .attr("fill", trackColor)
      .attr("rx", 3);
    g.append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", scale(Math.min(actual, target)))
      .attr("height", barH)
      .attr("fill", actual >= target ? onTrackColor : overTrackColor)
      .attr("rx", 3);
    if (actual > target) {
      g.append("rect")
        .attr("x", scale(target))
        .attr("y", 0)
        .attr("width", scale(actual - target))
        .attr("height", barH)
        .attr("fill", onTrackColor)
        .attr("rx", 3);
    }

    const textColor = theme.palette.text?.secondary ?? "#4a4842";
    const textPrimary = theme.palette.text?.primary ?? "#1a1915";
    g.append("text")
      .attr("x", 0)
      .attr("y", barH + 18)
      .attr("font-family", "IBM Plex Mono, monospace")
      .attr("font-size", "11px")
      .attr("fill", textColor)
      .text(`Target ${formatCurrency(target)}`);
    g.append("text")
      .attr("x", 0)
      .attr("y", barH + 34)
      .attr("font-family", "IBM Plex Mono, monospace")
      .attr("font-size", "11px")
      .attr("fill", textPrimary)
      .text(`Actual ${formatCurrency(actual)}`);
  }, [summary, theme]);

  return <svg ref={svgRef} width="100%" height={100} style={{ maxWidth: 320 }} />;
}
