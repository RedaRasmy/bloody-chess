import { useEffect, useRef, useCallback, useState } from 'react'
import { RealtimeChannel, RealtimePostgresChangesPayload } from '@supabase/supabase-js'
import { supabase } from '@/utils/supabase/client'

interface PostgresChangesConfig {
  event: 'INSERT' | 'UPDATE' | 'DELETE' | '*'
  schema: string
  table: string
  filter?: string
}


interface UseSupabaseChannelOptions {
  channelName: string
  subscriptions: Array<{
    config: PostgresChangesConfig
    callback: (payload: RealtimePostgresChangesPayload<any>) => void
  }>
  onStatusChange?: (status: string, error?: any) => void
  retryOnError?: boolean
  maxRetries?: number
  retryDelays?: number[]
  subscriptionTimeout?: number
}

const DEFAULT_RETRY_DELAYS = [1000, 2000, 4000]
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_SUBSCRIPTION_TIMEOUT = 10000

export function useSupabaseChannel({
  channelName,
  subscriptions,
  onStatusChange,
  retryOnError = false,
  maxRetries = DEFAULT_MAX_RETRIES,
  retryDelays = DEFAULT_RETRY_DELAYS,
  subscriptionTimeout = DEFAULT_SUBSCRIPTION_TIMEOUT
}: UseSupabaseChannelOptions) {
  const channelRef = useRef<RealtimeChannel | null>(null)
  const retryCountRef = useRef(0)
  const isActiveRef = useRef(true)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<string>('IDLE')

  const cleanup = useCallback(() => {
    if (channelRef.current) {
      console.log(`Unsubscribing from channel: ${channelName}`)
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
    setIsSubscribed(false)
    setConnectionStatus('DISCONNECTED')
  }, [channelName])

  const setupChannelWithRetry = useCallback(async (): Promise<void> => {
    if (!isActiveRef.current) return

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Channel subscription attempt ${attempt + 1}/${maxRetries + 1} for: ${channelName}`)
        await setupChannel()
        retryCountRef.current = 0 // Reset on success
        return // Success!
      } catch (error) {
        console.error(`Channel subscription attempt ${attempt + 1} failed:`, error)

        if (attempt === maxRetries) {
          console.log(`All subscription attempts failed for channel: ${channelName}`)
          onStatusChange?.('FAILED', error)
          throw error
        }

        if (!retryOnError) {
          throw error
        }

        // Update retry count before waiting
        retryCountRef.current = attempt + 1

        // Wait before retrying
        const delay = retryDelays[attempt] || retryDelays[retryDelays.length - 1]
        console.log(`Retrying channel subscription in ${delay}ms...`)
        await new Promise((resolve) => setTimeout(resolve, delay))

        if (!isActiveRef.current) return // Exit if component unmounted during delay
      }
    }
  }, [channelName, subscriptions, onStatusChange, retryOnError, maxRetries, retryDelays])

  const setupChannel = useCallback((): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (!isActiveRef.current) {
        reject(new Error('Component unmounted'))
        return
      }

      cleanup()

      console.log(`Setting up channel subscription: ${channelName}`)

      const timeoutId = setTimeout(() => {
        reject(new Error(`Channel subscription timed out for: ${channelName}`))
      }, subscriptionTimeout)

      let channel = supabase.channel(channelName)

      // Add all subscriptions to the channel using the exact method signature from your working code
      subscriptions.forEach(({ config, callback }) => {
        channel = channel.on(
          'postgres_changes' as any,
          config,
          callback
        )
      })

      // Subscribe to the channel
      channel.subscribe((status, err) => {
        console.log(`Channel subscription status for ${channelName}:`, status)
        clearTimeout(timeoutId)
        
        setConnectionStatus(status)
        onStatusChange?.(status, err)
        
        if (status === 'SUBSCRIBED') {
          console.log(`Channel subscription active: ${channelName}`)
          setIsSubscribed(true)
          resolve()
        } else if (status === 'CHANNEL_ERROR') {
          console.error(`Channel subscription error for ${channelName}:`, err)
          setIsSubscribed(false)
          reject(new Error(`Channel subscription failed: ${err?.message || 'Unknown error'}`))
        } else if (status === 'TIMED_OUT') {
          console.error(`Channel subscription timed out for: ${channelName}`)
          setIsSubscribed(false)
          reject(new Error('Channel subscription timed out'))
        }
      })

      channelRef.current = channel
    })
  }, [channelName, subscriptions, onStatusChange, cleanup, subscriptionTimeout])

  const reconnect = useCallback(() => {
    if (retryOnError) {
      setupChannelWithRetry().catch(console.error)
    } else {
      setupChannel().catch(console.error)
    }
  }, [setupChannelWithRetry, setupChannel, retryOnError])

  // Setup channel on mount and when dependencies change
  useEffect(() => {
    isActiveRef.current = true
    setIsSubscribed(false)
    setConnectionStatus('CONNECTING')
    
    if (retryOnError) {
      setupChannelWithRetry().catch(console.error)
    } else {
      setupChannel().catch(console.error)
    }

    return () => {
      isActiveRef.current = false
      cleanup()
    }
  }, [setupChannelWithRetry, setupChannel, cleanup, retryOnError])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isActiveRef.current = false
      cleanup()
    }
  }, [cleanup])

  return {
    channel: channelRef.current,
    retryCount: retryCountRef.current,
    isSubscribed,
    connectionStatus,
    reconnect,
    cleanup
  }
}