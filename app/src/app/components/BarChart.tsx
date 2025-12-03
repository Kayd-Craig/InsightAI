'use client'

import { TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'

export const description = 'A bar chart'

const chartData = [
  { month: 'January', desktop: 186 },
  { month: 'February', desktop: 210 },
  { month: 'March', desktop: 237 },
  { month: 'April', desktop: 170 },
  { month: 'May', desktop: 260 },
  { month: 'June', desktop: 340 },
  { month: 'July', desktop: 309 },
  { month: 'August', desktop: 389 },
  { month: 'September', desktop: 400 },
  { month: 'October', desktop: 395 },
  { month: 'November', desktop: 431 },
  { month: 'December', desktop: 440 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig

export function ChartBarDefault() {
  return (
    <Card className='text-white w-full'>
      <CardHeader>
        <CardTitle>Profile views</CardTitle>
        <CardDescription>January - June 2024</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='month'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey='desktop' fill='white' radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className='flex-col items-start gap-2 text-sm'>
        <div className='flex gap-2 leading-none font-medium text-green-500'>
          Trending up by 45.2% this month{' '}
          <TrendingUp className='h-4 w-4 text-green-500' />
        </div>
        <div className='text-muted-foreground leading-none'>
          Showing total visitors for the last 6 months
        </div>
      </CardFooter>
    </Card>
  )
}
