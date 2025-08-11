import { useEffect } from "react"
import packageJson from "@/../package.json"

// this is basic for now
// u can clear some data if a specefic number in the version changed (x.y.z)

const APP_VERSION = packageJson.version
const VERSION_KEY = "app_version"

export const useStorageVersioning = () => {
    useEffect(() => {
        const storedVersion = localStorage.getItem(VERSION_KEY)

        // If no stored version, just set current version
        if (!storedVersion) {
            localStorage.setItem(VERSION_KEY, APP_VERSION)
            return
        }

        // If versions are exactly the same, do nothing
        if (storedVersion === APP_VERSION) {
            return
        }

        const { minor, major } = parseVersion(APP_VERSION)
        const { minor: storedMinor, major: storedMajor } =
            parseVersion(storedVersion)

        // Clear if major OR minor version changed
        if (storedMajor !== major || storedMinor !== minor) {
            console.log(
                `Minor version changed from ${storedVersion} to ${APP_VERSION}, clearing localStorage`
            )

            // Clear all localStorage except version
            const keysToPreserve = [VERSION_KEY]
            Object.keys(localStorage).forEach((key) => {
                if (!keysToPreserve.includes(key)) {
                    localStorage.removeItem(key)
                }
            })
        } else {
            console.log(
                `Patch version changed from ${storedVersion} to ${APP_VERSION}, keeping localStorage`
            )
        }

        // Always update to current version
        localStorage.setItem(VERSION_KEY, APP_VERSION)
    }, [])
}

const parseVersion = (version: string) => {
    const [major, minor, patch] = version.split(".").map(Number)
    return { major, minor, patch }
}
