"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  LayoutDashboard,
  History,
  Settings,
  Upload,
  Loader2,
  CheckCircle,
  Menu,
  Mail,
  FileText,
  Users,
  ArrowRight,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react"

interface UploadedRow {
  name: string
  company: string
  role: string
  email: string
}

interface UserProfile {
  name: string
  email: string
  avatar: string
}

const sampleData: UploadedRow[] = [
  { name: "John Smith", company: "TechCorp", role: "Software Engineer", email: "john@techcorp.com" },
  { name: "Sarah Johnson", company: "DataFlow", role: "Product Manager", email: "sarah@dataflow.com" },
  { name: "Mike Chen", company: "StartupXYZ", role: "Frontend Developer", email: "mike@startupxyz.com" },
  { name: "Emily Davis", company: "CloudSoft", role: "UX Designer", email: "emily@cloudsoft.com" },
  { name: "Alex Rodriguez", company: "InnovateLab", role: "Data Scientist", email: "alex@innovatelab.com" },
  { name: "Lisa Wang", company: "FinTech Pro", role: "Backend Developer", email: "lisa@fintechpro.com" },
  { name: "David Brown", company: "AI Solutions", role: "ML Engineer", email: "david@aisolutions.com" },
]

export default function ApplyPilotDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  // `false` is the correct initial value; using the variable name caused the
  // “can't access lexical declaration before initialization” error.
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedData, setUploadedData] = useState<UploadedRow[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)

  const handleGoogleSignIn = () => {
    setTimeout(() => {
      setIsLoggedIn(true)
      setUserProfile({
        name: "Vilansh Sharma",
        email: "vilansh@example.com",
        avatar: "/placeholder.svg?height=32&width=32",
      })
      toast({
        title: "Welcome to ApplyPilot!",
        description: "Successfully signed in with Google",
      })
    }, 1000)
  }

  const handleSignOut = () => {
    setIsLoggedIn(false)
    setUserProfile(null)
    setUploadedData([])
    toast({
      title: "Signed out successfully",
      description: "See you next time!",
    })
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setIsUploading(true)
      setUploadProgress(0)

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsUploading(false)
            setUploadedData(sampleData)
            toast({
              title: "File uploaded successfully!",
              description: `Processed ${sampleData.length} candidate entries`,
            })
            return 100
          }
          return prev + 10
        })
      }, 200)
    }
  }

  const handleGenerateAndSend = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      toast({
        title: "Emails sent successfully!",
        description: `${uploadedData.length} personalized cover letters delivered`,
      })
    }, 3000)
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const PremiumLogo = () => (
    <div className="relative">
      <div className="w-12 h-12 bg-gradient-to-br from-white via-gray-50 to-white rounded-2xl flex items-center justify-center shadow-lg border-2 border-[#D5D5D5]/30 premium-glow">
        <div className="relative">
          <div className="w-8 h-8 bg-gradient-to-br from-[#173744] to-[#173744]/80 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-br from-[#173744] to-[#173744]/90 rounded-full border border-white shadow-sm"></div>
        </div>
      </div>
    </div>
  )

  const AppSidebar = () => (
    <Sidebar className="border-r-0">
      <SidebarContent className="bg-[#173744] backdrop-blur-xl border-r border-[#173744]/20">
        <SidebarGroup>
          <div className="px-6 py-8">
            <div className="flex items-center space-x-4">
              <PremiumLogo />
              <div>
                <span className="font-bold text-xl text-white">ApplyPilot</span>
                <div className="text-xs text-white/60 font-medium">Premium Suite</div>
              </div>
            </div>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="px-4 space-y-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    onClick={() => setActiveTab(item.id)}
                    isActive={activeTab === item.id}
                    className={`w-full justify-start rounded-xl transition-all duration-300 ${
                      activeTab === item.id
                        ? "bg-white text-[#173744] shadow-lg"
                        : "hover:bg-white/10 text-white/70 hover:text-white"
                    }`}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )

  const UserProfileTab = () => {
    if (!userProfile) return null

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-[#D5D5D5]/20 transition-all duration-200"
          >
            <Avatar className="w-8 h-8 border-2 border-[#D5D5D5]/30">
              <AvatarImage src={userProfile.avatar || "/placeholder.svg"} alt={userProfile.name} />
              <AvatarFallback className="bg-[#173744] text-white text-sm font-semibold">
                {userProfile.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="hidden md:block text-left">
              <div className="text-sm font-medium text-[#173744]">{userProfile.name}</div>
              <div className="text-xs text-[#D5D5D5]">Premium User</div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#D5D5D5]" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56 bg-white border border-[#D5D5D5]/30 shadow-xl">
          <DropdownMenuLabel className="text-[#173744]">My Account</DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#D5D5D5]/30" />
          <DropdownMenuItem className="text-[#173744] hover:bg-[#D5D5D5]/20">
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem className="text-[#173744] hover:bg-[#D5D5D5]/20">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-[#D5D5D5]/30" />
          <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50">
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const HeroIllustration = () => (
    <div className="relative w-full h-80 mb-12 overflow-hidden rounded-3xl bg-gradient-to-br from-white to-[#D5D5D5]/20 border border-[#D5D5D5]/30">
      <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-[#D5D5D5]/10"></div>

      {/* Floating Elements */}
      <div className="absolute top-12 left-12 w-20 h-20 bg-[#D5D5D5]/30 rounded-3xl opacity-60 animate-pulse"></div>
      <div className="absolute top-20 right-16 w-16 h-16 bg-[#173744]/20 rounded-2xl opacity-50 animate-bounce"></div>
      <div className="absolute bottom-16 left-20 w-12 h-12 bg-[#D5D5D5]/40 rounded-xl opacity-40 animate-pulse delay-1000"></div>

      {/* Central Illustration */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative">
          <div className="w-40 h-40 bg-white rounded-3xl shadow-2xl flex items-center justify-center border border-[#D5D5D5]/30">
            <Mail className="w-20 h-20 text-[#173744]" />
          </div>
          <div className="absolute -top-6 -right-6 w-16 h-16 bg-[#173744] rounded-3xl flex items-center justify-center shadow-xl">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>
          <div className="absolute -bottom-6 -left-6 w-14 h-14 bg-[#D5D5D5] rounded-2xl flex items-center justify-center shadow-xl">
            <Sparkles className="w-7 h-7 text-[#173744]" />
          </div>
        </div>
      </div>

      {/* Subtle Pattern Overlay */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23173744' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
      </div>
    </div>
  )

  const DashboardContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="min-h-[85vh] w-full px-4 md:px-8 lg:px-12 xl:px-16">
          <div className="w-full">
            <HeroIllustration />
            <div className="max-w-4xl mx-auto">
              <Card className="bg-white/80 backdrop-blur-xl border border-[#D5D5D5]/30 shadow-2xl">
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-5xl md:text-6xl font-bold mb-6 text-[#173744]">
                    Apply Smarter.
                    <br />
                    Not Harder.
                  </CardTitle>
                  <CardDescription className="text-xl text-[#173744]/70 max-w-2xl mx-auto leading-relaxed">
                    Generate personalized cover letters and send them via Gmail — instantly.
                  </CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8">
                  <Button
                    onClick={handleGoogleSignIn}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl py-8 text-xl font-semibold"
                    size="lg"
                  >
                    <svg className="w-7 h-7 mr-4" viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="currentColor"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="currentColor"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    Sign in with Google
                    <ArrowRight className="w-6 h-6 ml-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-8 w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#173744]">Dashboard</h1>
            <p className="text-[#173744]/70 mt-2 text-lg">Upload your data and generate personalized cover letters</p>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-sm text-[#173744]/60">
            <div className="flex items-center space-x-2 bg-[#D5D5D5]/20 px-4 py-2 rounded-xl border border-[#D5D5D5]/30">
              <Users className="w-4 h-4 text-[#173744]" />
              <span>{uploadedData.length} candidates</span>
            </div>
          </div>
        </div>

        <Card className="bg-white/80 backdrop-blur-xl border border-[#D5D5D5]/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-[#173744]">
              <Upload className="w-6 h-6" />
              <span>Upload Candidate Data</span>
            </CardTitle>
            <CardDescription className="text-[#173744]/70">
              Upload Excel (.xlsx or .csv) with Name, Company, Role, Email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative group">
                <div className="border-2 border-dashed border-[#D5D5D5] rounded-3xl p-12 text-center hover:border-[#173744]/30 transition-all duration-300 bg-[#D5D5D5]/10 group-hover:bg-[#D5D5D5]/20">
                  <div className="w-20 h-20 mx-auto mb-6 bg-[#D5D5D5]/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#D5D5D5]/50">
                    <Upload className="w-10 h-10 text-[#173744]" />
                  </div>
                  <Label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-xl font-semibold text-[#173744] block mb-3">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-[#173744]/60">Excel (.xlsx) or CSV files only • Max 10MB</span>
                  </Label>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {isUploading && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-[#173744]">Processing file...</span>
                    <span className="text-[#173744]/60">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="h-3" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {uploadedData.length > 0 && (
          <Card className="bg-white/80 backdrop-blur-xl border border-[#D5D5D5]/30 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-[#173744]">
                  <FileText className="w-6 h-6" />
                  <span>Data Preview</span>
                </div>
                <div className="text-sm font-normal text-[#173744]/60 bg-[#D5D5D5]/20 px-3 py-1 rounded-lg border border-[#D5D5D5]/30">
                  {uploadedData.length} entries loaded
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-[#D5D5D5]/30 overflow-hidden shadow-sm">
                <Table>
                  <TableHeader className="bg-[#D5D5D5]/20">
                    <TableRow className="border-b border-[#D5D5D5]/30">
                      <TableHead className="font-semibold text-[#173744]">Name</TableHead>
                      <TableHead className="font-semibold text-[#173744]">Company</TableHead>
                      <TableHead className="font-semibold text-[#173744]">Role</TableHead>
                      <TableHead className="font-semibold text-[#173744]">Email</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {uploadedData.slice(0, 5).map((row, index) => (
                      <TableRow
                        key={index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-[#D5D5D5]/10"
                        } hover:bg-[#D5D5D5]/20 transition-colors border-b border-[#D5D5D5]/20`}
                      >
                        <TableCell className="font-medium text-[#173744]">{row.name}</TableCell>
                        <TableCell className="text-[#173744]/70">{row.company}</TableCell>
                        <TableCell className="text-[#173744]/70">{row.role}</TableCell>
                        <TableCell className="text-[#173744]/70">{row.email}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {uploadedData.length > 5 && (
                <p className="text-sm text-[#173744]/60 mt-6 text-center">
                  Showing 5 of {uploadedData.length} entries •
                  <span className="text-[#173744] font-medium"> {uploadedData.length - 5} more candidates ready</span>
                </p>
              )}

              <div className="mt-8">
                <Button
                  onClick={handleGenerateAndSend}
                  disabled={isGenerating}
                  className="w-full bg-[#173744] hover:bg-[#173744]/90 text-white shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 rounded-2xl py-8 text-xl font-semibold"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-4 h-6 w-6 animate-spin" />
                      Generating & Sending...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-4 h-6 w-6" />
                      Generate & Send Cover Letters
                      <ArrowRight className="ml-4 h-6 w-6" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    )
  }

  const HistoryContent = () => (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-4xl font-bold text-[#173744]">History</h1>
        <p className="text-[#173744]/70 mt-2 text-lg">View your past email campaigns and results</p>
      </div>
      <Card className="bg-white/80 backdrop-blur-xl border border-[#D5D5D5]/30 shadow-xl">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-8 bg-[#D5D5D5]/20 rounded-3xl flex items-center justify-center border border-[#D5D5D5]/30">
              <History className="w-14 h-14 text-[#173744]/60" />
            </div>
            <h3 className="text-2xl font-semibold text-[#173744] mb-3">No campaigns yet</h3>
            <p className="text-[#173744]/60 max-w-sm mx-auto text-lg">
              Your email campaigns and success metrics will appear here once you start sending cover letters.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const SettingsContent = () => (
    <div className="space-y-8 w-full">
      <div>
        <h1 className="text-4xl font-bold text-[#173744]">Settings</h1>
        <p className="text-[#173744]/70 mt-2 text-lg">Manage your account and preferences</p>
      </div>
      <Card className="bg-white/80 backdrop-blur-xl border border-[#D5D5D5]/30 shadow-xl">
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-28 h-28 mx-auto mb-8 bg-[#D5D5D5]/20 rounded-3xl flex items-center justify-center border border-[#D5D5D5]/30">
              <Settings className="w-14 h-14 text-[#173744]/60" />
            </div>
            <h3 className="text-2xl font-semibold text-[#173744] mb-3">Settings</h3>
            <p className="text-[#173744]/60 max-w-sm mx-auto text-lg">
              Customization options and account settings will be available here soon.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <DashboardContent />
      case "history":
        return <HistoryContent />
      case "settings":
        return <SettingsContent />
      default:
        return <DashboardContent />
    }
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen bg-gradient-to-br from-white to-[#D5D5D5]/20">
        {/* Desktop Sidebar */}
        <div className="hidden md:block">
          <AppSidebar />
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden fixed top-6 left-6 z-50">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="bg-white/90 backdrop-blur-xl border-[#D5D5D5]/30 hover:bg-[#D5D5D5]/20 shadow-xl rounded-xl"
          >
            <Menu className="h-4 w-4 text-[#173744]" />
          </Button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-[#173744]/20 backdrop-blur-sm">
            <div className="fixed left-0 top-0 h-full w-80 bg-[#173744] backdrop-blur-xl shadow-2xl border-r border-[#173744]/20">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center space-x-3">
                    <PremiumLogo />
                    <span className="font-bold text-lg text-white">ApplyPilot</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-white/60 hover:text-white"
                  >
                    ✕
                  </Button>
                </div>
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activeTab === item.id ? "default" : "ghost"}
                      className={`w-full justify-start rounded-xl ${
                        activeTab === item.id
                          ? "bg-white text-[#173744]"
                          : "text-white/70 hover:text-white hover:bg-white/10"
                      }`}
                      onClick={() => {
                        setActiveTab(item.id)
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      <item.icon className="mr-3 h-5 w-5" />
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col">
          {/* Top Header with User Profile */}
          {isLoggedIn && (
            <header className="flex justify-end items-center p-6 border-b border-[#D5D5D5]/30 bg-white/50 backdrop-blur-xl">
              <UserProfileTab />
            </header>
          )}

          <div className="flex-1 p-4 md:p-8 lg:p-12 xl:p-16 pt-6 md:pt-8 overflow-auto w-full">{renderContent()}</div>

          {/* Footer */}
          <footer className="border-t border-[#D5D5D5]/30 bg-white/50 backdrop-blur-xl">
            <div className="px-6 py-6 text-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D5D5D5]/50 to-transparent mb-4"></div>
              <p className="text-sm text-[#173744]/60">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
                <span className="font-semibold text-[#173744]">Vilansh Sharma</span>
              </p>
            </div>
          </footer>
        </SidebarInset>
      </div>
      <Toaster />
    </SidebarProvider>
  )
}
