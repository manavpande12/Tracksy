"use client";
import { useTheme } from "next-themes"
import { ClerkProvider } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

export function ClerkThemeProvider({ children }) {
    const { theme } = useTheme()

    return (
        <ClerkProvider
            appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
            }}
        >
            {children}
        </ClerkProvider>
    )
}
