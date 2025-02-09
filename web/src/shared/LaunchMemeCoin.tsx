'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import EmojiPicker from 'emoji-picker-react'
// import { useToast } from '@/hooks/use-toast'
// import { Rocket, Check } from 'lucide-react'
// import { useRouter } from 'next/navigation'

export interface TokenDetails {
  tokenName: string
  tokenSymbol: string
  totalSupply: string
  description: string
  websiteUrl: string
  emoji: string
}

export default function LaunchMemeCoin({ onLaunch }: { onLaunch?: (tokenDetails: TokenDetails) => void }) {
  // const router = useRouter()
  // const { toast } = useToast()
  const [formData, setFormData] = useState<TokenDetails>({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    description: '',
    emoji: '',
    websiteUrl: '',
  })

  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  // const [isLaunching, setIsLaunching] = useState(false)
  // const [isSuccess, setIsSuccess] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEmojiClick = (emojiData: any) => {
    setFormData(prev => ({
      ...prev,
      emoji: emojiData.emoji
    }))
    setShowEmojiPicker(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // setIsLaunching(true)
    // toast({
    //   title: "Minting in Progress",
    //   description: `Token ${formData.tokenName} (${formData.tokenSymbol}) with supply of ${formData.totalSupply} is being minted on the memechain...`,
    // })
    
    // if (onLaunch) {
    //   onLaunch(formData)
    // }
    
    // setTimeout(() => {
    //   toast({
    //     title: "Success!",
    //     description: "Your memecoin has been minted!",
    //   })
    //   setIsSuccess(true)
    //   setTimeout(() => {
    //     setDialogOpen(false)
    //     router.push('/arena')
    //   }, 1000)
    // }, 5000)
    
    // console.log('Launching memecoin with data:', formData)
    if (onLaunch) {
      onLaunch(formData);
    }
    setDialogOpen(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setDialogOpen(true)}>Launch Memecoin </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Visit the Arena</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="tokenName">Token Name</Label>
            <Input
              id="tokenName"
              name="tokenName"
              value={formData.tokenName}
              onChange={handleInputChange}
              placeholder="e.g., Doge Coin"
              required
              // disabled={isLaunching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tokenSymbol">Token Symbol</Label>
            <Input
              id="tokenSymbol"
              name="tokenSymbol"
              value={formData.tokenSymbol}
              onChange={handleInputChange}
              placeholder="e.g., DOGE"
              required
              // disabled={isLaunching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalSupply">Total Supply</Label>
            <Input
              id="totalSupply"
              name="totalSupply"
              type="number"
              value={formData.totalSupply}
              onChange={handleInputChange}
              placeholder="e.g., 1000000000"
              required
              // disabled={isLaunching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Describe your memecoin..."
              required
              // disabled={isLaunching}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logoUrl">Logo (Emoji)</Label>
            <div className="relative">
              <Button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full text-left"
                // disabled={isLaunching}
              >
                {formData.emoji || 'Select an emoji...'}
              </Button>
              {showEmojiPicker && (
                <div className="absolute z-10 mt-1">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="websiteUrl">Website URL</Label>
            <Input
              id="websiteUrl"
              name="websiteUrl"
              type="url"
              value={formData.websiteUrl}
              onChange={handleInputChange}
              placeholder="https://..."
              // disabled={isLaunching}
            />
          </div>

          <Button type="submit" className="w-full">
            Launch Memecoin
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
