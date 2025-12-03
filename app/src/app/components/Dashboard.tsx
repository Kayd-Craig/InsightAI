// 'use client'
// import React, { useEffect, useState } from 'react'
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
// } from 'recharts'
// import {
//   Users,
//   Heart,
//   BarChart2,
//   Video,
//   Link2,
//   ChevronRight,
// } from 'lucide-react'
// import Navbar from './Navbar'
// import { supabase } from '@/lib/supabase/client'
// import { GridLoader } from 'react-spinners'
// import AccountSignInPrompt from './AccountSignIn'
// import SocialMediaDropdown from './SocialMediaDropdown'
// import { ChartLineInteractive } from './LineChart'
// import { ChartBarDefault } from './BarChart'
// import {
//   Card,
//   CardAction,
//   CardDescription,
//   CardFooter,
//   CardHeader,
//   CardTitle,
//   CardContent
// } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"

// const timeData = [
//   { time: '6am', engagement: 2.1 },
//   { time: '9am', engagement: 3.8 },
//   { time: '12pm', engagement: 4.2 },
//   { time: '3pm', engagement: 4.8 },
//   { time: '6pm', engagement: 5.6 },
//   { time: '9pm', engagement: 3.2 },
// ]

// export default function AnalyticsDashboard() {
//   const [activeTab, setActiveTab] = useState('instagram')
//   const [loading, setLoading] = useState(true)
//   const [mounted, setMounted] = useState(false)
//   const accounts = false

//   useEffect(() => {
//     setMounted(true)
//     setLoading(true)
//     const getUser = async () => {
//       const {
//         data: { user },
//         error,
//       } = await supabase.auth.getUser()

//       if (error) {
//         throw error
//       } else {
//         console.log('data ', user)
//         const { data: socials, error } = await supabase
//           .from('social accounts')
//           .select()
//           .eq('user_id', user?.id)

//         if (error) {
//           throw error
//         } else {
//           console.log('socials ', socials)
//         }
//       }
//     }

//     getUser()
//     setLoading(false)
//   }, [])

//   const handleSignIn = (platform: string) => {
//     console.log(`Sign in with ${platform}`)
//   }

//   if (!mounted) {
//     return null
//   }

//   if (loading) {
//     return (
//       <div className='flex justify-center items-center h-screen'>
//         <GridLoader />
//       </div>
//     )
//   }

//   if (accounts) {
//     return <AccountSignInPrompt onSignIn={handleSignIn} />
//   }

//   return (
//     <div className='flex flex-col lg:flex-row h-screen min-w-screen'>
//       <Navbar />
//       <div className='w-full flex-1 overflow-auto border-none bg-neutral-950 rounded-4xl m-2'>
//         <div className='p-3 sm:p-4 lg:p-6 border-none'>
//           <div className='flex flex-col sm:flex-row w-full mb-4 sm:mb-6'>
//             <div className='sm:ml-auto'>
//               <SocialMediaDropdown
//                 activeTab={activeTab}
//                 setActiveTab={setActiveTab}
//               />
//             </div>
//           </div>

//           <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-white'>
//             <Card>
//               <Card className="@container/card">
//         <CardHeader>
//           <CardDescription>Total Revenue</CardDescription>
//           <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
//             $1,250.00
//           </CardTitle>
//           <CardAction>
//             <Badge variant="outline">
//               <IconTrendingUp />
//               +12.5%
//             </Badge>
//           </CardAction>
//         </CardHeader>
//         <CardFooter className="flex-col items-start gap-1.5 text-sm">
//           <div className="line-clamp-1 flex gap-2 font-medium">
//             Trending up this month <IconTrendingUp className="size-4" />
//           </div>
//           <div className="text-muted-foreground">
//             Visitors for the last 6 months
//           </div>
//         </CardFooter>
//       </Card>
//             <Card>
//               <CardContent className='p-3 sm:p-4'>
//                 <div className='flex justify-between items-center mb-2'>
//                   <span className='text-xs sm:text-sm'>Engagement Rate</span>
//                   <BarChart2 size={16} className='sm:w-[18px] sm:h-[18px]' />
//                 </div>
//                 <div className='text-xl sm:text-2xl font-bold'>8.2%</div>
//                 <div className='text-xs text-green-500 mt-1'>
//                   +2.1% from last month
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className='p-3 sm:p-4'>
//                 <div className='flex justify-between items-center mb-2'>
//                   <span className='text-xs sm:text-sm'>New Followers</span>
//                   <Users size={16} className='sm:w-[18px] sm:h-[18px]' />
//                 </div>
//                 <div className='text-xl sm:text-2xl font-bold'>1,200</div>
//                 <div className='text-xs text-green-500 mt-1'>
//                   +300 from last month
//                 </div>
//               </CardContent>
//             </Card>
//             <Card>
//               <CardContent className='p-3 sm:p-4'>
//                 <div className='flex justify-between items-center mb-2'>
//                   <span className='text-xs sm:text-sm'>Posts</span>
//                   <Heart size={16} className='sm:w-[18px] sm:h-[18px]' />
//                 </div>
//                 <div className='text-xl sm:text-2xl font-bold'>87</div>
//                 <div className='text-xs text-green-500 mt-1'>
//                   +5 from last month
//                 </div>
//               </CardContent>
//             </Card>
//           </div>

//           <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 text-white'>
//             <div className='min-h-[250px] sm:min-h-[300px]'>
//               <ChartLineInteractive />
//             </div>
//             <div className='min-h-[250px] sm:min-h-[300px]'>
//               <ChartBarDefault />
//             </div>
//           </div>

//           {/* Content Performance and Posting Times - Stack on Mobile */}
//           <div className='grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 mt-4 sm:mt-6 text-white'>
//             <div className='p-3 sm:p-4 rounded-md shadow-sm border border-white'>
//               <h2 className='font-medium mb-3 sm:mb-4 text-white text-sm sm:text-base'>
//                 Content Performance
//               </h2>

//               <div className='space-y-3 sm:space-y-4'>
//                 <div className='flex justify-between items-center'>
//                   <div className='flex items-center'>
//                     <div className='p-2 bg-gray-100 rounded-md mr-3 flex-shrink-0'></div>
//                     <span className='text-xs sm:text-sm'>Image Posts</span>
//                   </div>
//                   <span className='font-medium text-sm sm:text-base'>64%</span>
//                 </div>

//                 <div className='flex justify-between items-center'>
//                   <div className='flex items-center'>
//                     <div className='p-2 bg-gray-100 rounded-md mr-3 flex-shrink-0'>
//                       <Video size={14} className='sm:w-4 sm:h-4 text-black' />
//                     </div>
//                     <span className='text-xs sm:text-sm'>Video Posts</span>
//                   </div>
//                   <span className='font-medium text-sm sm:text-base'>28%</span>
//                 </div>

//                 <div className='flex justify-between items-center'>
//                   <div className='flex items-center'>
//                     <div className='p-2 bg-gray-100 rounded-md mr-3 flex-shrink-0'>
//                       <Link2 size={14} className='sm:w-4 sm:h-4 text-black' />
//                     </div>
//                     <span className='text-xs sm:text-sm'>Link Posts</span>
//                   </div>
//                   <span className='font-medium text-sm sm:text-base'>8%</span>
//                 </div>
//               </div>
//             </div>

//             <div className='p-3 sm:p-4 rounded-md shadow-sm border border-white'>
//               <h2 className='font-medium text-white mb-3 sm:mb-4 text-sm sm:text-base'>
//                 Optimal Posting Times
//               </h2>
//               <div className='h-48 sm:h-64'>
//                 <ResponsiveContainer width='100%' height='100%'>
//                   <LineChart data={timeData}>
//                     <CartesianGrid strokeDasharray='3 3' stroke='#f0f0f0' />
//                     <XAxis
//                       dataKey='time'
//                       tick={{ fontSize: 12 }}
//                       className='text-xs'
//                     />
//                     <YAxis tick={{ fontSize: 12 }} className='text-xs' />
//                     <Tooltip />
//                     <Line
//                       type='monotone'
//                       dataKey='engagement'
//                       stroke='#ffffff'
//                       strokeWidth={2}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>
//             </div>
//           </div>

//           {/* Recent Posts Performance */}
//           <div className='rounded-md shadow-sm mt-4 sm:mt-6 border border-white'>
//             <div className='p-3 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center border-b'>
//               <h2 className='font-medium text-white text-sm sm:text-base mb-2 sm:mb-0'>
//                 Recent Posts Performance
//               </h2>
//               <button className='text-xs sm:text-sm text-gray-400 flex items-center self-start sm:self-auto'>
//                 View All
//                 <ChevronRight size={14} className='sm:w-4 sm:h-4 ml-1' />
//               </button>
//             </div>

//             <div className='p-3 sm:p-4 border-b text-white'>
//               <div className='flex flex-col sm:flex-row sm:items-center'>
//                 <div className='flex items-center mb-3 sm:mb-0 sm:flex-1'>
//                   <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0'></div>
//                   <div className='flex-1 min-w-0'>
//                     <div className='font-medium text-sm sm:text-base truncate'>
//                       Product Launch Post
//                     </div>
//                     <div className='text-xs text-gray-500'>
//                       Posted on Apr 21, 2025
//                     </div>
//                   </div>
//                 </div>
//                 <div className='flex justify-between sm:justify-normal sm:space-x-4 lg:space-x-6 ml-13 sm:ml-0'>
//                   <div className='text-center'>
//                     <div className='font-medium text-sm sm:text-base'>1.2K</div>
//                     <div className='text-xs text-gray-500'>Likes</div>
//                   </div>
//                   <div className='text-center'>
//                     <div className='font-medium text-sm sm:text-base'>342</div>
//                     <div className='text-xs text-gray-500'>Comments</div>
//                   </div>
//                   <div className='text-center'>
//                     <div className='font-medium text-sm sm:text-base'>5.6K</div>
//                     <div className='text-xs text-gray-500'>Reach</div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className='p-3 sm:p-4 text-white'>
//               <div className='flex flex-col sm:flex-row sm:items-center'>
//                 <div className='flex items-center mb-3 sm:mb-0 sm:flex-1'>
//                   <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-md flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0'>
//                     <Video size={18} className='sm:w-5 sm:h-5 text-black' />
//                   </div>
//                   <div className='flex-1 min-w-0'>
//                     <div className='font-medium text-sm sm:text-base truncate'>
//                       Behind the Scenes Video
//                     </div>
//                     <div className='text-xs text-gray-500'>
//                       Posted on Apr 19, 2025
//                     </div>
//                   </div>
//                 </div>
//                 <div className='flex justify-between sm:justify-normal sm:space-x-4 lg:space-x-6 ml-13 sm:ml-0'>
//                   <div className='text-center'>
//                     <div className='font-medium text-sm sm:text-base'>856</div>
//                     <div className='text-xs text-gray-500'>Likes</div>
//                   </div>
//                   <div className='text-center'>
//                     <div className='font-medium text-sm sm:text-base'>234</div>
//                     <div className='text-xs text-gray-500'>Comments</div>
//                   </div>
//                   <div className='text-center'>
//                     <div className='font-medium text-sm sm:text-base'>3.2K</div>
//                     <div className='text-xs text-gray-500'>Reach</div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
