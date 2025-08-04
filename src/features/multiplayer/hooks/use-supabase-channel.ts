import { useEffect, useRef, useCallback, useState, useMemo } from "react"
import {
    RealtimeChannel,
    RealtimePostgresChangesPayload,
} from "@supabase/supabase-js"
import { supabase } from "@/utils/supabase/client"

interface PostgresChangesConfig {
    event: "INSERT" | "UPDATE" | "DELETE" | "*"
    schema: string
    table: string
    filter?: string
}

interface BroadcastConfig {
    event: string
}

type SubscriptionConfig =
    | {
          type: "postgres_changes"
          config: PostgresChangesConfig
          callback: (payload: RealtimePostgresChangesPayload<any>) => void
      }
    | {
          type: "broadcast"
          config: BroadcastConfig
          callback: (payload: any) => void
      }

interface UseSupabaseChannelOptions {
    channelName: string
    subscriptions: SubscriptionConfig[]
    onStatusChange?: (status: string, error?: any) => void
    retryOnError?: boolean
    maxRetries?: number
    retryDelays?: number[]
    subscriptionTimeout?: number
}

const DEFAULT_RETRY_DELAYS = [1000, 2000, 4000]
const DEFAULT_MAX_RETRIES = 3
const DEFAULT_SUBSCRIPTION_TIMEOUT = 10000

// Helper to create stable subscription key for comparison
function createSubscriptionKey(subscriptions: SubscriptionConfig[]): string {
    return JSON.stringify(
        subscriptions.map(sub => ({
            type: sub.type,
            config: sub.config
        }))
    )
}

export function useSupabaseChannel({
    channelName,
    subscriptions,
    onStatusChange,
    retryOnError = false,
    maxRetries = DEFAULT_MAX_RETRIES,
    retryDelays = DEFAULT_RETRY_DELAYS,
    subscriptionTimeout = DEFAULT_SUBSCRIPTION_TIMEOUT,
}: UseSupabaseChannelOptions) {
    const channelRef = useRef<RealtimeChannel | null>(null)
    const retryCountRef = useRef(0)
    const isActiveRef = useRef(true)
    const subscriptionsRef = useRef<SubscriptionConfig[]>(subscriptions)
    const onStatusChangeRef = useRef(onStatusChange)
    
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [connectionStatus, setConnectionStatus] = useState<string>("IDLE")

    // Update refs when values change
    useEffect(() => {
        subscriptionsRef.current = subscriptions
    }, [subscriptions])

    useEffect(() => {
        onStatusChangeRef.current = onStatusChange
    }, [onStatusChange])

    // Create stable subscription key to detect real changes
    const subscriptionKey = useMemo(() => 
        createSubscriptionKey(subscriptions), 
        [subscriptions]
    )

    const cleanup = useCallback(() => {
        if (channelRef.current) {
            console.log(`Unsubscribing from channel: ${channelName}`)
            try {
                supabase.removeChannel(channelRef.current)
            } catch (error) {
                console.error('Error removing channel:', error)
            }
            channelRef.current = null
        }
        setIsSubscribed(false)
        setConnectionStatus("DISCONNECTED")
    }, [channelName])

    const setupChannel = useCallback((): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!isActiveRef.current) {
                reject(new Error("Component unmounted"))
                return
            }

            // Clean up existing channel first
            cleanup()

            console.log(`Setting up channel subscription: ${channelName}`)

            const timeoutId = setTimeout(() => {
                cleanup()
                reject(new Error(`Channel subscription timed out for: ${channelName}`))
            }, subscriptionTimeout)

            try {
                let channel = supabase.channel(channelName)

                // Add all subscriptions to the channel using current subscriptions
                subscriptionsRef.current.forEach((subscription) => {
                    if (subscription.type === "postgres_changes") {
                        channel = channel.on(
                            "postgres_changes" as any,
                            subscription.config,
                            subscription.callback
                        )
                    } else if (subscription.type === "broadcast") {
                        channel = channel.on(
                            "broadcast",
                            { event: subscription.config.event },
                            subscription.callback
                        )
                    }
                })

                // Subscribe to the channel
                channel.subscribe((status, err) => {
                    console.log(`Channel subscription status for ${channelName}:`, status)
                    clearTimeout(timeoutId)

                    // Only update state if component is still active
                    if (!isActiveRef.current) return

                    setConnectionStatus(status)
                    onStatusChangeRef.current?.(status, err)

                    if (status === "SUBSCRIBED") {
                        console.log(`Channel subscription active: ${channelName}`)
                        setIsSubscribed(true)
                        resolve()
                    } else if (status === "CHANNEL_ERROR") {
                        console.error(`Channel subscription error for ${channelName}:`, err)
                        setIsSubscribed(false)
                        reject(new Error(`Channel subscription failed: ${err?.message || "Unknown error"}`))
                    } else if (status === "TIMED_OUT") {
                        console.error(`Channel subscription timed out for: ${channelName}`)
                        setIsSubscribed(false)
                        reject(new Error("Channel subscription timed out"))
                    }
                    // Note: We don't handle other statuses like "JOINING" to avoid premature state changes
                })

                channelRef.current = channel
            } catch (error) {
                clearTimeout(timeoutId)
                cleanup()
                reject(error)
            }
        })
    }, [channelName, cleanup, subscriptionTimeout])

    const setupChannelWithRetry = useCallback(async (): Promise<void> => {
        if (!isActiveRef.current) return

        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                console.log(
                    `Channel subscription attempt ${attempt + 1}/${maxRetries + 1} for: ${channelName}`
                )
                await setupChannel()
                retryCountRef.current = 0 // Reset on success
                return // Success!
            } catch (error) {
                console.error(`Channel subscription attempt ${attempt + 1} failed:`, error)

                if (attempt === maxRetries) {
                    console.log(`All subscription attempts failed for channel: ${channelName}`)
                    onStatusChangeRef.current?.("FAILED", error)
                    throw error
                }

                if (!retryOnError || !isActiveRef.current) {
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
    }, [channelName, setupChannel, retryOnError, maxRetries, retryDelays])

    const reconnect = useCallback(() => {
        if (!isActiveRef.current) return
        
        if (retryOnError) {
            setupChannelWithRetry().catch(console.error)
        } else {
            setupChannel().catch(console.error)
        }
    }, [setupChannelWithRetry, setupChannel, retryOnError])

    // Helper function to send broadcast messages
    const broadcast = useCallback(
        (event: string, payload: any) => {
            if (channelRef.current && isSubscribed) {
                try {
                    channelRef.current.send({
                        type: "broadcast",
                        event,
                        payload,
                    })
                } catch (error) {
                    console.error('Error sending broadcast:', error)
                }
            } else {
                console.warn(`Cannot send broadcast: channel not subscribed`)
            }
        },
        [isSubscribed]
    )

    // Setup channel on mount and when channel name or subscription config changes
    useEffect(() => {
        console.log(`Channel effect triggered for: ${channelName}`)
        isActiveRef.current = true
        setIsSubscribed(false)
        setConnectionStatus("CONNECTING")

        if (retryOnError) {
            setupChannelWithRetry().catch((error) => {
                console.error('Failed to setup channel with retry:', error)
            })
        } else {
            setupChannel().catch((error) => {
                console.error('Failed to setup channel:', error)
            })
        }

        return () => {
            console.log(`Cleaning up channel effect for: ${channelName}`)
            isActiveRef.current = false
            cleanup()
        }
    }, [channelName, subscriptionKey, setupChannelWithRetry, setupChannel, cleanup, retryOnError])

    return {
        channel: channelRef.current,
        retryCount: retryCountRef.current,
        isSubscribed,
        connectionStatus,
        reconnect,
        cleanup,
        broadcast,
    }
}