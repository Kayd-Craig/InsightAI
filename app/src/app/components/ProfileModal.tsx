'use client'

import { useState, useRef, useEffect } from 'react'
import { IconAlertCircle, IconUpload, IconPhoto } from '@tabler/icons-react'
import { useAppStore } from '@/stores/store'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProfileModal({
  open,
  onOpenChange,
}: ProfileModalProps) {
  // Get user data and actions from the store
  const { user, updateUserWithAvatar } = useAppStore()
  
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sync form state with user data when modal opens or user changes
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setPhone(user.phone || '')
      setAvatarPreview(user.avatar_url || null)
    }
  }, [user, open])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be less than 5MB')
      return
    }

    setAvatarFile(file)
    setError('')

    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async () => {
    if (!user) return
    
    setSaving(true)
    setError('')

    try {
      // Set uploading state if we have a file
      if (avatarFile) {
        setUploading(true)
      }

      // Call the store action to update user (with or without avatar)
      await updateUserWithAvatar(
        {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          avatar: avatarPreview || undefined,
        },
        avatarFile || undefined
      )

      // Close modal on success
      onOpenChange(false)
      
      // Reset file input
      setAvatarFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error: unknown) {
      console.error('Save error:', error)
      const errorMessage =
        error instanceof Error ? error.message : String(error)
      setError(errorMessage)
    } finally {
      setSaving(false)
      setUploading(false)
    }
  }

  const handleRemoveAvatar = () => {
    setAvatarFile(null)
    setAvatarPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleCancel = () => {
    // Reset form to current user data
    if (user) {
      setFirstName(user.first_name || '')
      setLastName(user.last_name || '')
      setPhone(user.phone || '')
      setAvatarPreview(user.avatar_url || null)
    }
    setAvatarFile(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onOpenChange(false)
  }

  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md p-0 gap-0 overflow-hidden rounded-2xl'>
        <DialogHeader className='p-8 pb-6 text-left'>
          <DialogTitle className='text-3xl font-bold'>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className='px-8 pb-8 space-y-6'>
          {error && (
            <div className='p-3 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2'>
              <IconAlertCircle className='w-5 h-5 text-red-800 dark:text-red-200 flex-shrink-0' />
              <span className='text-sm text-red-800 dark:text-red-200'>
                {error}
              </span>
            </div>
          )}

          <div>
            <label className='block text-sm font-medium mb-3'>
              Profile Picture
            </label>
            <div className='flex items-center gap-4'>
              <div className='relative'>
                {avatarPreview ? (
                  <Image
                    src={avatarPreview}
                    alt='Avatar preview'
                    width={80}
                    height={80}
                    className='w-20 h-20 rounded-full object-cover border-2 border-gray-300 dark:border-gray-600'
                  />
                ) : (
                  <div className='w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-300 dark:border-gray-600'>
                    <IconPhoto className='w-8 h-8 text-gray-400' />
                  </div>
                )}
              </div>

              <div className='flex-1 space-y-2'>
                <input
                  ref={fileInputRef}
                  type='file'
                  accept='image/*'
                  onChange={handleFileSelect}
                  className='hidden'
                  id='avatar-upload'
                />
                <label
                  htmlFor='avatar-upload'
                  className='flex items-center justify-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-700 cursor-pointer transition border border-gray-700 hover:border-black'
                >
                  <IconUpload className='w-4 h-4' />
                  <span className='text-sm'>Upload Image</span>
                </label>
                {avatarPreview && (
                  <Button
                    type='button'
                    onClick={handleRemoveAvatar}
                    variant='ghost'
                    className='w-full text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
                  >
                    Remove
                  </Button>
                )}
                <p className='text-xs text-gray-500'>Max size: 5MB</p>
              </div>
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Email</label>
            <Input
              type='email'
              value={user.email || ''}
              disabled
              className='bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
            />
            <p className='text-xs text-gray-500 mt-1'>
              Email cannot be changed
            </p>
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Phone</label>
            <Input
              type='tel'
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder='555-555-5555'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>First Name</label>
            <Input
              type='text'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder='John'
            />
          </div>

          <div>
            <label className='block text-sm font-medium mb-2'>Last Name</label>
            <Input
              type='text'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder='Doe'
            />
          </div>

          <div className='flex items-center justify-end gap-3 pt-4'>
            <Button
              onClick={handleCancel}
              disabled={saving}
              variant='outline'
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving || uploading}
              className='bg-black text-white hover:bg-gray-700 border border-gray-700 hover:border-black'
            >
              {uploading
                ? 'Uploading...'
                : saving
                ? 'Saving...'
                : 'Save Changes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}