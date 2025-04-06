// app/layout.tsx
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/ui/app-sidebar"
import { cookies } from "next/headers"
import { getUserClasses } from "@/actions/users"
import { getUserSession } from "@/actions/auth"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}


export default async function DashboardLayout({
    children,
  }: Readonly<{
    children: React.ReactNode
  }>) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar:state")?.value === "true"
    const user = await getUserSession()
    const { data: userClasses } = await getUserClasses(user?.user?.id || '')
  
    const classItems =
      userClasses?.map((uc) => ({
        id: uc.class_id,
        title: uc.classes.name,
        url: `/classes/${uc.class_id}`, 
      })) || []
  
    return (
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar classes={classItems} />
            <SidebarInset>
              <main>
                <SidebarTrigger />
                {children}
              </main>
            </SidebarInset>
          </SidebarProvider>
        </body>
      </html>
    )
  }
  