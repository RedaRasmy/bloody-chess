'use client'
import { 
  Settings as SettingsIcon, 
} from "lucide-react"
import { useState } from "react"
import DisplaySettings from "@/features/settings/components/display-settings"
import AudioSettings from "@/features/settings/components/audio-settings"

export default function Settings() {

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
          <SettingsIcon className="w-6 h-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Customize your chess experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Game Settings */}
        <div className="space-y-6">
          

          <DisplaySettings/>
        </div>

        <div className="space-y-6">
          <AudioSettings/>
        </div>
      </div>

      {/* Save Settings */}
      {/* <div className="flex justify-end">
        <Button size="lg" className="min-w-32">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div> */}
    </div>
  )
}