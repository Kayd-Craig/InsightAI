// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog'
// import {
//   InputOTP,
//   InputOTPGroup,
//   InputOTPSlot,
// } from '@/components/ui/input-otp'
// import { REGEXP_ONLY_DIGITS_AND_CHARS } from 'input-otp'
// import { usePhoneStore } from '../../../public/stores/store'

//test for github and typings

// export default function Modal({
//   isOpen,
//   onContinue,
//   otpValue,
//   setOtpValue,
// }: {
//   isOpen: boolean
//   onContinue: () => void
//   otpValue: string
//   setOtpValue: (value: string) => void
// }) {
//   const { phone } = usePhoneStore()
//   return (
//     <Dialog open={isOpen}>
//       <DialogContent
//         onInteractOutside={(e) => {
//           e.preventDefault()
//         }}
//       >
//         <DialogHeader>
//           <div className='flex flex-col space-y-2 text-center'>
//             <DialogTitle>Enter Verification Code</DialogTitle>
//             <div className='flex flex-col space-between space-y-6 text-sm items-center'>
//               <p className='text-sm text-gray-500'>
//                 enter the six digit code sent to {phone}.
//               </p>
//               <InputOTP
//                 maxLength={6}
//                 value={otpValue}
//                 onChange={(value) => setOtpValue(value)}
//                 pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
//               >
//                 <InputOTPGroup className='w-full'>
//                   <InputOTPSlot className='border-black' index={0} />
//                   <InputOTPSlot className='border-black' index={1} />
//                   <InputOTPSlot className='border-black' index={2} />
//                   <InputOTPSlot className='border-black' index={3} />
//                   <InputOTPSlot className='border-black' index={4} />
//                   <InputOTPSlot
//                     className='border-black'
//                     index={5}
//                     onChange={() => onContinue()}
//                   />
//                 </InputOTPGroup>
//               </InputOTP>
//             </div>
//           </div>
//         </DialogHeader>
//       </DialogContent>
//     </Dialog>
//   )
// }
