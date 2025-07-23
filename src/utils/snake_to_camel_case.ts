// AI generated

/**
 * Converts a snake_case string to camelCase
 */
export function snakeToCamel(str: string): string {
    return str
        .toLowerCase()
        .replace(/([-_][a-z])/g, (group) =>
            group.toUpperCase().replace("-", "").replace("_", "")
        )
}

/**
 * Converts a camelCase string to snake_case
 */
export function camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
}

/**
 * Converts all keys in an object from snake_case to camelCase
 * Handles nested objects and arrays recursively
 */
export function convertKeysToCamel<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToCamel(item)) as T
    }

    if (typeof obj === "object" && obj.constructor === Object) {
        const converted: any = {}

        for (const [key, value] of Object.entries(obj)) {
            const camelKey = snakeToCamel(key)
            converted[camelKey] = convertKeysToCamel(value)
        }

        return converted as T
    }

    return obj
}

/**
 * Converts all keys in an object from camelCase to snake_case
 * Handles nested objects and arrays recursively
 */
export function convertKeysToSnake<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => convertKeysToSnake(item)) as T
    }

    if (typeof obj === "object" && obj.constructor === Object) {
        const converted: any = {}

        for (const [key, value] of Object.entries(obj)) {
            const snakeKey = camelToSnake(key)
            converted[snakeKey] = convertKeysToSnake(value)
        }

        return converted as T
    }

    return obj
}

/**
 * Enhanced version that handles date strings and special transformations
 * Perfect for Supabase real-time payloads
 */
export function supabaseToTypescript<T = any>(obj: any): T {
    if (obj === null || obj === undefined) {
        return obj
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => supabaseToTypescript(item)) as T
    }

    if (typeof obj === "object" && obj.constructor === Object) {
        const converted: any = {}

        for (const [key, value] of Object.entries(obj)) {
            const camelKey = snakeToCamel(key)

            // Handle date strings (common in Supabase)
            if (typeof value === "string" && isDateString(value)) {
                converted[camelKey] = new Date(value).getTime()
            } else if (value instanceof Date) {
                converted[camelKey] = value.getTime()
            } else {
                converted[camelKey] = supabaseToTypescript(value)
            }
        }

        return converted as T
    }

    return obj
}

/**
 * Helper function to detect ISO date strings
 */
function isDateString(str: string): boolean {
    // Matches ISO 8601 format: YYYY-MM-DDTHH:mm:ss.sssZ or YYYY-MM-DD HH:mm:ss
    const dateRegex =
        /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?|T\d{2}:\d{2}:\d{2}(\.\d{3})?[+-]\d{2}:\d{2}|\s\d{2}:\d{2}:\d{2})$/
    return dateRegex.test(str) && !isNaN(Date.parse(str))
}

// Type-safe versions for specific use cases
export function convertSupabaseGame<T extends Record<string, any>>(
    supabaseRow: Record<string, any>
): T {
    return supabaseToTypescript<T>(supabaseRow)
}

// Utility for batch conversions
export function convertArray<T>(arr: Record<string, any>[]): T[] {
    return arr.map((item) => convertKeysToCamel<T>(item))
}

// Example usage and tests (remove in production)
export function testConversions() {
    console.log("=== Testing Case Conversions ===")

    // String conversion
    console.log(snakeToCamel("user_name")) // userName
    console.log(camelToSnake("userName")) // user_name

    // Object conversion
    const snakeObj = {
        user_id: "123",
        first_name: "John",
        last_name: "Doe",
        created_at: "2024-01-01T10:00:00Z",
        user_profile: {
            profile_picture: "url",
            phone_number: "123-456-7890",
        },
        game_history: [
            { game_id: 1, played_at: "2024-01-01" },
            { game_id: 2, played_at: "2024-01-02" },
        ],
    }

    const camelObj = convertKeysToCamel(snakeObj)
    console.log("Converted object:", camelObj)

    const supabaseConverted = supabaseToTypescript(snakeObj)
    console.log("Supabase converted (with dates):", supabaseConverted)
}
