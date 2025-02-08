
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

export default function LaunchMemeCoin() {
  const [formData, setFormData] = useState({
    tokenName: '',
    tokenSymbol: '',
    totalSupply: '',
    description: '',
    logoUrl: '',
    websiteUrl: '',
    telegramUrl: '',
    twitterUrl: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement launch logic
    console.log('Launching memecoin with data:', formData)
  }

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <h1 className="text-3xl font-bold mb-6">Launch Your Memecoin</h1>
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL</Label>
          <Input
            id="logoUrl"
            name="logoUrl"
            type="url"
            value={formData.logoUrl}
            onChange={handleInputChange}
            placeholder="https://..."
            required
          />
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="telegramUrl">Telegram URL</Label>
          <Input
            id="telegramUrl"
            name="telegramUrl"
            type="url"
            value={formData.telegramUrl}
            onChange={handleInputChange}
            placeholder="https://t.me/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="twitterUrl">Twitter URL</Label>
          <Input
            id="twitterUrl"
            name="twitterUrl"
            type="url"
            value={formData.twitterUrl}
            onChange={handleInputChange}
            placeholder="https://twitter.com/..."
          />
        </div>

        <Button type="submit" className="w-full">
          Launch Memecoin
        </Button>
      </form>
    </div>
  )
}
