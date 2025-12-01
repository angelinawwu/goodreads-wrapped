"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

// Chart container component
export function ChartContainer({
  className,
  children,
  config,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  config: Record<string, { label?: string; color?: string }>
}) {
  return (
    <div
      className={cn("w-full", className)}
      style={
        {
          "--color-mobile": "hsl(var(--chart-1))",
          "--color-desktop": "hsl(var(--chart-2))",
          ...Object.entries(config).reduce((acc, [key, value]) => {
            acc[`--color-${key}`] = value.color || `hsl(var(--chart-${key}))`
            return acc
          }, {} as Record<string, string>),
        } as React.CSSProperties
      }
      {...props}
    >
      {children}
    </div>
  )
}

// Chart tooltip component
export function ChartTooltip({
  active,
  payload,
  label,
  indicator = "dot",
  content,
  ...props
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    color?: string
    dataKey?: string
  }>
  label?: string
  indicator?: "line" | "dot" | "dashed"
  content?: React.ReactNode
} & React.HTMLAttributes<HTMLDivElement>) {
  if (!active || !payload?.length) return null

  if (content) {
    return <>{content}</>
  }

  return (
    <div
      className={cn(
        "rounded-lg border p-2 shadow-md",
        "bg-white border-black/10",
        props.className
      )}
      {...props}
    >
      <div className="grid gap-2">
        {label && (
          <div className="font-medium text-black">{label}</div>
        )}
        <div className="grid gap-1.5">
          {payload.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-2"
            >
              {indicator === "dot" && (
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {indicator === "line" && (
                <div
                  className="h-0.5 w-4"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {indicator === "dashed" && (
                <div
                  className="h-0.5 w-4 border-t-2 border-dashed"
                  style={{ borderColor: item.color }}
                />
              )}
              <span className="text-sm text-black/70">
                {item.name}: {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Chart tooltip content component
export function ChartTooltipContent({
  active,
  payload,
  label,
  indicator = "dot",
  ...props
}: {
  active?: boolean
  payload?: Array<{
    name?: string
    value?: number
    color?: string
    dataKey?: string
  }>
  label?: string
  indicator?: "line" | "dot" | "dashed"
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ChartTooltip
      active={active}
      payload={payload}
      label={label}
      indicator={indicator}
      {...props}
    />
  )
}

// Chart legend component
export function ChartLegend({
  payload,
  config,
  ...props
}: {
  payload?: Array<{
    value?: string
    type?: string
    id?: string
    color?: string
  }>
  config?: Record<string, { label?: string; color?: string }>
} & React.HTMLAttributes<HTMLDivElement>) {
  if (!payload?.length) return null

  return (
    <div
      className={cn(
        "flex flex-wrap justify-center gap-4",
        props.className
      )}
      {...props}
    >
      {payload.map((item, index) => {
        const key = item.value || item.id || `item-${index}`
        const configItem = config?.[key]
        const label = configItem?.label || item.value
        const color = configItem?.color || item.color || `var(--color-${key})`

        return (
          <div
            key={key}
            className="flex items-center gap-2"
          >
            <div
              className="h-4 w-4 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-black/70">{label}</span>
          </div>
        )
      })}
    </div>
  )
}

// Chart legend content component
export function ChartLegendContent({
  payload,
  config,
  ...props
}: {
  payload?: Array<{
    value?: string
    type?: string
    id?: string
    color?: string
  }>
  config?: Record<string, { label?: string; color?: string }>
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <ChartLegend
      payload={payload}
      config={config}
      {...props}
    />
  )
}

// Re-export chart config type
export type ChartConfig = Record<string, { label?: string; color?: string }>

