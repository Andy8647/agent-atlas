import { useEffect, useRef } from 'react'
import * as d3 from 'd3'

interface AttentionCurveProps {
  height?: number
}

interface DataPoint {
  position: number
  recall: number
}

// Lost in the Middle U-curve data (synthetic from Liu et al. 2023)
const uCurveData: DataPoint[] = [
  { position: 0, recall: 0.82 },
  { position: 10, recall: 0.78 },
  { position: 20, recall: 0.71 },
  { position: 30, recall: 0.62 },
  { position: 40, recall: 0.55 },
  { position: 50, recall: 0.52 },
  { position: 60, recall: 0.54 },
  { position: 70, recall: 0.60 },
  { position: 80, recall: 0.68 },
  { position: 90, recall: 0.75 },
  { position: 100, recall: 0.80 },
]

export function AttentionCurve({ height = 300 }: AttentionCurveProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const width = svgRef.current.clientWidth
    const margin = { top: 30, right: 30, bottom: 50, left: 50 }
    const innerWidth = width - margin.left - margin.right
    const innerHeight = height - margin.top - margin.bottom

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleLinear()
      .domain([0, 100])
      .range([0, innerWidth])

    const y = d3
      .scaleLinear()
      .domain([0, 1])
      .range([innerHeight, 0])

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(5))
      .selectAll('text')
      .attr('fill', 'var(--color-text-muted)')
      .style('font-size', '11px')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format('.0%')))
      .selectAll('text')
      .attr('fill', 'var(--color-text-muted)')
      .style('font-size', '11px')

    // Axis labels
    g.append('text')
      .attr('x', innerWidth / 2)
      .attr('y', innerHeight + 40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-text-muted)')
      .style('font-size', '12px')
      .text('文档中的位置 (%)')

    g.append('text')
      .attr('x', -innerHeight / 2)
      .attr('y', -35)
      .attr('transform', 'rotate(-90)')
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--color-text-muted)')
      .style('font-size', '12px')
      .text('信息召回率')

    // U curve
    const line = d3
      .line<DataPoint>()
      .x((d) => x(d.position))
      .y((d) => y(d.recall))
      .curve(d3.curveMonotoneX)

    g.append('path')
      .datum(uCurveData)
      .attr('fill', 'none')
      .attr('stroke', 'var(--color-primary)')
      .attr('stroke-width', 2.5)
      .attr('d', line)

    // Dots
    g.selectAll('circle')
      .data(uCurveData)
      .enter()
      .append('circle')
      .attr('cx', (d) => x(d.position))
      .attr('cy', (d) => y(d.recall))
      .attr('r', 4)
      .attr('fill', 'var(--color-primary)')
      .attr('opacity', 0.7)

    // "Lost in the Middle" annotation
    g.append('text')
      .attr('x', x(50))
      .attr('y', y(0.52) - 15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ef4444')
      .style('font-size', '12px')
      .style('font-weight', 600)
      .text('Lost in the Middle')
  }, [height])

  return (
    <div className="my-6 overflow-hidden rounded-xl border" style={{ borderColor: 'var(--color-border)', background: 'var(--color-surface)' }}>
      <div className="border-b px-5 py-3" style={{ borderColor: 'var(--color-border)' }}>
        <span className="text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Lost in the Middle — U 形注意力曲线
        </span>
        <span className="ml-2 text-xs" style={{ color: 'var(--color-text-muted)' }}>
          Liu et al., TACL 2024
        </span>
      </div>
      <div className="p-2">
        <svg ref={svgRef} width="100%" height={height} />
      </div>
    </div>
  )
}
