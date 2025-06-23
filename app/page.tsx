"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Progress } from "@/components/ui/progress"
import * as XLSX from "xlsx"
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
  Menu,
  FileText,
  Users,
  ArrowRight,
  User,
  LogOut,
  ChevronDown,
  Sparkles,
} from "lucide-react"
import { auth, provider } from "@/lib/firebase"
import { signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from "firebase/auth"

interface UserProfile {
  name: string
  email: string
  avatar: string
}

type UploadedRow = {
  name: string
  email: string
  company: string
  jobTitle: string
}

const sampleData: UploadedRow[] = [
  { name: "John Smith", company: "TechCorp", jobTitle: "Software Engineer", email: "john@techcorp.com" },
  { name: "Sarah Johnson", company: "DataFlow", jobTitle: "Product Manager", email: "sarah@dataflow.com" },
  { name: "Mike Chen", company: "StartupXYZ", jobTitle: "Frontend Developer", email: "mike@startupxyz.com" },
  { name: "Emily Davis", company: "CloudSoft", jobTitle: "UX Designer", email: "emily@cloudsoft.com" },
  { name: "Alex Rodriguez", company: "InnovateLab", jobTitle: "Data Scientist", email: "alex@innovatelab.com" },
  { name: "Lisa Wang", company: "FinTech Pro", jobTitle: "Backend Developer", email: "lisa@fintechpro.com" },
  { name: "David Brown", company: "AI Solutions", jobTitle: "ML Engineer", email: "david@aisolutions.com" },
]

export default function ApplyPilotDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadedData, setUploadedData] = useState<UploadedRow[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeFileName, setResumeFileName] = useState<string>("")
  const [resumeText, setResumeText] = useState<string>("")

  // Listen for authentication state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      console.log("Auth state changed:", user ? "User logged in" : "User logged out")
      if (user) {
        console.log("User data:", {
          displayName: user.displayName,
          email: user.email,
          photoURL: user.photoURL
        })
        setIsLoggedIn(true)
        setUserProfile({
          name: user.displayName || "User",
          email: user.email || "",
          avatar: user.photoURL || "/placeholder.svg?height=32&width=32",
        })
      } else {
        setIsLoggedIn(false)
        setUserProfile(null)
      }
    })

    return () => unsubscribe()
  }, [])

  const handleGoogleSignIn = async () => {
    try {
      setIsSigningIn(true)
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      
      // Send user data to backend
      try {
        const response = await fetch("http://localhost:5000/api/auth/google-login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            name: user.displayName,
            email: user.email,
            uid: user.uid,
          }),
        })

        if (!response.ok) {
          throw new Error(`Backend error: ${response.status}`)
        }

        const backendData = await response.json()
        console.log("Backend response:", backendData)
        
        toast({
          title: "Welcome to ApplyPilot!",
          description: `Successfully signed in as ${user.displayName}`,
        })

        // Redirect to Gmail OAuth after successful login
        window.location.href = "http://localhost:5000/auth/google"
      } catch (backendError) {
        console.error("Backend communication error:", backendError)
        // Still show success toast even if backend fails
        toast({
          title: "Welcome to ApplyPilot!",
          description: `Successfully signed in as ${user.displayName}`,
        })
        // Optionally show a warning about backend sync
        toast({
          title: "Note",
          description: "Signed in successfully, but there was an issue syncing with the server.",
          variant: "default",
        })
        
        // Still redirect to Gmail OAuth even if backend fails
        window.location.href = "http://localhost:5000/auth/google"
      }
    } catch (error: any) {
      console.error("Sign-in error:", error)
      toast({
        title: "Sign-in failed",
        description: error.message || "An error occurred during sign-in",
        variant: "destructive",
      })
    } finally {
      setIsSigningIn(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut(auth)
      setUploadedData([])
      toast({
        title: "Signed out successfully",
        description: "See you next time!",
      })
    } catch (error: any) {
      console.error("Sign-out error:", error)
      toast({
        title: "Sign-out failed",
        description: error.message || "An error occurred during sign-out",
        variant: "destructive",
      })
    }
  }

  const handleMultiFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length < 2) return;

    const excelFile = Array.from(files).find(file => file.name.endsWith(".xlsx") || file.name.endsWith(".csv"));
    const resumeFile = Array.from(files).find(file => file.name.endsWith(".pdf") || file.name.endsWith(".docx"));

    if (!excelFile || !resumeFile) {
      toast({
        title: "Missing Files",
        description: "Please upload both Excel and Resume files.",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("excel", excelFile);
    formData.append("resume", resumeFile);

    setIsUploading(true);

    try {
      const response = await fetch("http://localhost:5000/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();
      setUploadedData(result.results); // optionally display success/failure info per contact
      toast({
        title: "Upload & Send Successful",
        description: `Processed and emailed ${result.results.length} contacts.`,
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Upload failed",
        description: "An error occurred during file upload.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleExcelUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      toast({
        title: "No file selected",
        description: "Please upload a valid Excel or CSV file.",
        variant: "destructive",
      });
      return;
    }

    // Check if it's an Excel or CSV file
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel (.xlsx) or CSV file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

          const parsedData: UploadedRow[] = (json as any[]).map((row, index) => {
            const name = row["Name"]?.trim();
            const email = row["Email"]?.trim();
            const company = row["Company"]?.trim();
            const jobTitle = row["JobTitle"]?.trim();

            if (!name || !email || !company || !jobTitle) {
              throw new Error(`Missing fields in row ${index + 2}`);
            }

            return { name, email, company, jobTitle };
          });

          setUploadedData(parsedData);
          toast({
            title: "Excel file uploaded successfully! ✅",
            description: `Parsed ${parsedData.length} candidate entries.`,
          });
        } catch (err: any) {
          console.error("Excel Parse Error:", err);
          toast({
            title: "Failed to parse Excel file",
            description: err.message || "Make sure all columns are present: Name, Email, Company, JobTitle.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error("File reading error:", error);
      toast({
        title: "File reading failed",
        description: "Could not read the Excel file.",
        variant: "destructive",
      });
      setIsUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'text/plain'
    ]
    
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOC, DOCX, or TXT file.",
        variant: "destructive",
      })
      return
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB.",
        variant: "destructive",
      })
      return
    }

    setResumeFile(file)
    setResumeFileName(file.name)

    // Extract text from PDF if it's a PDF file
    if (file.type === 'application/pdf') {
      // For now, just set the file without text extraction to avoid SSR issues
      setResumeText("");
      toast({
        title: "Resume uploaded ✅",
        description: `${file.name} has been uploaded successfully.`,
      });
    } else {
      // For non-PDF files, just set the file
      setResumeText("");
      toast({
        title: "Resume uploaded ✅",
        description: `${file.name} has been uploaded successfully.`,
      });
    }
  }

  const generatePrompt = (recipient: UploadedRow, resumeText: string) => {
    return `Generate a personalized, professional cover letter for a job application. Use the information below. Do NOT use any placeholders like [Your Name], [Your Address], [Date], etc. Only use the information provided. If information is missing, omit that part. Write the letter as if it is ready to send.

Resume:
${resumeText}

Recipient:
- Name: ${recipient.name}
- Company: ${recipient.company}
- Job Title: ${recipient.jobTitle}

The tone should be enthusiastic and concise, tailored to the company and job role.`;
  };

  const handleGenerateAndSend = async () => {
    if (!resumeFile) {
      toast({
        title: "Upload resume first",
        description: "Please upload a resume before sending emails.",
        variant: "destructive",
      });
      return;
    }

    const geminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!geminiKey) {
      toast({
        title: "Gemini API key missing",
        description: "Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    let successCount = 0;
    let failCount = 0;

    for (const recipient of uploadedData) {
      const prompt = generatePrompt(recipient, resumeText);
      try {
        const aiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [{ text: prompt }],
                },
              ],
            }),
          }
        );

        const data = await aiResponse.json();
        console.log("📩 Gemini API raw response:", data);

        const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!generatedText) {
          failCount++;
          toast({
            title: `Failed to generate cover letter for ${recipient.name}`,
            description: "Gemini did not return a valid cover letter.",
            variant: "destructive",
          });
          continue;
        }

        const formData = new FormData();
        formData.append("resume", resumeFile);
        formData.append("recipient", JSON.stringify(recipient));
        formData.append("generatedText", generatedText);

        const backendRes = await fetch("http://localhost:5000/send-email", {
          method: "POST",
          credentials: "include",
          body: formData,
        });

        const result = await backendRes.text();
        console.log("✅ Email backend response:", result);
        successCount++;
      } catch (err) {
        failCount++;
        console.error("❌ Error generating/sending email for", recipient.name, err);
        toast({
          title: `Error for ${recipient.name}`,
          description: err instanceof Error ? err.message : String(err),
          variant: "destructive",
        });
      }
    }
    setIsGenerating(false);
    if (successCount > 0) {
      toast({
        title: "Cover letters sent!",
        description: `Successfully sent ${successCount} cover letter${successCount > 1 ? "s" : ""}. ${failCount > 0 ? failCount + " failed." : ""}`,
        variant: "default",
      });
    } else {
      toast({
        title: "No cover letters sent",
        description: "All attempts failed. Please check your data and try again.",
        variant: "destructive",
      });
    }
  };
  
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

  const DashboardContent = () => {
    if (!isLoggedIn) {
      return (
        <div className="min-h-screen w-full bg-gradient-to-br from-white to-[#D5D5D5]/20 flex flex-col">
          {/* Top Left Logo */}
          <div className="absolute top-8 left-8 flex items-center space-x-3">
            <PremiumLogo />
            <div>
              <span className="font-bold text-2xl text-[#173744]">ApplyPilot</span>
              <div className="text-xs text-[#173744]/60 font-medium">Premium Suite</div>
            </div>
          </div>

          {/* Centered Sign-in */}
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-8 text-[#173744]">Welcome to ApplyPilot</h1>
              <p className="text-xl text-[#173744]/70 mb-12 max-w-2xl mx-auto">
                Generate personalized cover letters and send them via Gmail — instantly.
              </p>

              <Button
                onClick={handleGoogleSignIn}
                disabled={isSigningIn}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 rounded-2xl px-12 py-6 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                size="lg"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6 mr-3" viewBox="0 0 24 24">
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
                  </>
                )}
              </Button>
            </div>
          </div>
          <footer>
            <div className="px-6 py-6 text-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D5D5D5]/50 to-transparent mb-4"></div>
              <p className="text-sm text-[#173744]/60">
                Made with <span className="text-red-500 animate-pulse">❤️</span> by{" "}
                <span className="font-semibold text-[#173744]">Vilansh Sharma</span>
              </p>
            </div>
          </footer>
        </div>
        
      )
    }

    // Rest of the logged-in dashboard content remains the same...

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
                    onChange={handleExcelUpload}
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

        <Card className="bg-white/80 backdrop-blur-xl border border-[#D5D5D5]/30 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3 text-[#173744]">
              <FileText className="w-6 h-6" />
              <span>Upload Your Resume</span>
            </CardTitle>
            <CardDescription className="text-[#173744]/70">
              Upload your resume to personalize cover letters (PDF, DOC, DOCX, TXT)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="relative group">
                <div className="border-2 border-dashed border-[#D5D5D5] rounded-3xl p-12 text-center hover:border-[#173744]/30 transition-all duration-300 bg-[#D5D5D5]/10 group-hover:bg-[#D5D5D5]/20">
                  <div className="w-20 h-20 mx-auto mb-6 bg-[#D5D5D5]/30 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-[#D5D5D5]/50">
                    <FileText className="w-10 h-10 text-[#173744]" />
                  </div>
                  <Label htmlFor="resume-upload" className="cursor-pointer">
                    <span className="text-xl font-semibold text-[#173744] block mb-3">
                      Click to upload or drag and drop
                    </span>
                    <span className="text-sm text-[#173744]/60">PDF, DOC, DOCX, or TXT files only • Max 5MB</span>
                  </Label>
                  <Input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {resumeFileName && (
                <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">{resumeFileName}</p>
                      <p className="text-sm text-green-600">Resume uploaded successfully</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setResumeFile(null)
                      setResumeFileName("")
                    }}
                    className="text-green-600 hover:text-green-800 hover:bg-green-100"
                  >
                    Remove
                  </Button>
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
                      <TableHead className="font-semibold text-[#173744]">Job Title</TableHead>
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
                        <TableCell className="text-[#173744]/70">{row.jobTitle}</TableCell>
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

  // If not logged in, show full-screen landing page
  if (!isLoggedIn) {
    return (
      <>
        <DashboardContent />
        <Toaster />
      </>
    )
  }

  // If logged in, show sidebar layout
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
