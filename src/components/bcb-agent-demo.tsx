'use client'

import * as React from 'react'
import { Clock, Command, Cpu, AlertTriangle, ChevronRight, ThumbsUp, ThumbsDown, CheckCircle2, Search, Upload, User, Home, FileText } from 'lucide-react'
import { format, differenceInDays } from 'date-fns'
import { motion, AnimatePresence } from 'framer-motion'
import OpenAI from 'openai'

// Update import paths for UI components
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const client = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,  dangerouslyAllowBrowser: true });

async function generateCompletion(prompt: string) {
  try {
    const chatCompletion = await client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-4o',
    });
    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating completion:', error);
    return 'An error occurred while generating the completion.';
  }
}

type Phase = {
  id: string
  title: string
  icon: React.ReactNode
  targetDate: Date
  description: string
  status: 'completed' | 'in-progress' | 'upcoming'
}

const phases: Phase[] = [
  {
    id: 'phase1',
    title: 'Command Line Suggestion & Timeline',
    icon: <Command className="h-5 w-5" />,
    targetDate: new Date('2024-06-30'),
    description: 'Suggest command line and terminal fixes for identified vulnerabilities.',
    status: 'completed'
  },
  {
    id: 'phase2',
    title: 'RAG-Based Personalized Remediation',
    icon: <Clock className="h-5 w-5" />,
    targetDate: new Date('2024-09-30'),
    description: 'Provide personalized remediation steps based on system information and context.',
    status: 'in-progress'
  },
  {
    id: 'phase3',
    title: 'Automated Agent-Based Remediation',
    icon: <Cpu className="h-5 w-5" />,
    targetDate: new Date('2024-12-30'),
    description: 'Fully automated vulnerability remediation with minimal user intervention.',
    status: 'upcoming'
  },
]

const ParticleBackground = () => {
  React.useEffect(() => {
    const canvas = document.getElementById('particle-canvas') as HTMLCanvasElement
    const ctx = canvas.getContext('2d')
    
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: { x: number; y: number; radius: number; dx: number; dy: number }[] = []

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 2,
        dy: (Math.random() - 0.5) * 2
      })
    }

    function animate() {
      requestAnimationFrame(animate)
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        particles.forEach(particle => {
          ctx.beginPath()
          ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'
          ctx.fill()

          particle.x += particle.dx
          particle.y += particle.dy

          if (particle.x < 0 || particle.x > canvas.width) particle.dx = -particle.dx
          if (particle.y < 0 || particle.y > canvas.height) particle.dy = -particle.dy
        })
      }
    }

    animate()

    return () => {
      cancelAnimationFrame(animate as any)
    }
  }, [])

  return <canvas id="particle-canvas" className="absolute inset-0 z-0" />
}

const SplashScreen = () => (
  <div className="fixed inset-0 bg-blue-600 flex items-center justify-center z-50">
    <ParticleBackground />
    <div className="text-white text-center w-64 z-10">
      <h2 className="text-4xl font-bold mb-4">BCB Agent</h2>
      <p className="text-xl mb-4">Preparing your personalized remediation...</p>
      <div className="w-full bg-blue-800 rounded-full h-2.5">
        <div className="bg-white h-2.5 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
      </div>
      <p className="text-sm mt-4 italic">
        "Still faster than waiting for LIV cloud IT to respond to your ticket!"
      </p>
    </div>
  </div>
)

const Phase1Demo = ({ bugDescription, pdfText }: { bugDescription: string, pdfText: string }) => {
  const [suggestion, setSuggestion] = React.useState('')

  React.useEffect(() => {
    const generateSuggestion = async () => {
      const prompt = `Based on the following bug description and PDF content, suggest some command line fixes:
      
      Bug Description: ${bugDescription}
      
      PDF Content: ${pdfText}
      
      Please provide a list of command line instructions to address this issue.`;
      
      const result = await generateCompletion(prompt);
      setSuggestion(result || 'Unable to generate suggestion.');
    }

    if (bugDescription) {
      generateSuggestion()
    }
  }, [bugDescription, pdfText])

  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Suggested Command Line Fixes</CardTitle>
      </CardHeader>
      <CardContent>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-gray-600">
          <code>
            {suggestion || 'Generating suggestion...'}
          </code>
        </pre>
      </CardContent>
    </Card>
  )
}

const Phase2Demo = ({ bugDescription, systemInfo, pdfText }: { bugDescription: string, systemInfo: string, pdfText: string }) => {
  const [suggestion, setSuggestion] = React.useState('')

  React.useEffect(() => {
    const generateSuggestion = async () => {
      const prompt = `Based on the following bug description, system information, and PDF content, provide personalized remediation steps:
      
      Bug Description: ${bugDescription}
      
      System Information: ${systemInfo}
      
      PDF Content: ${pdfText}
      
      Please provide a detailed list of steps to remediate this issue, taking into account the specific system information and PDF content provided.`;
      
      const result = await generateCompletion(prompt);
      setSuggestion(result || 'Unable to generate personalized suggestion.');
    }

    if (bugDescription && systemInfo) {
      generateSuggestion()
    }
  }, [bugDescription, systemInfo, pdfText])

  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Personalized Remediation Steps</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600">
        <h3 className="font-semibold mb-2">Suggested Fixes:</h3>
        <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-gray-600">
          <code>
            {suggestion || 'Generating personalized suggestion...'}
          </code>
        </pre>
      </CardContent>
    </Card>
  )
}

const Phase3Demo = ({ bugDescription, pdfText }: { bugDescription: string, pdfText: string }) => {
  const [progress, setProgress] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)
  const [remediationSteps, setRemediationSteps] = React.useState<string[]>([])

  React.useEffect(() => {
    const timer = setInterval(() => {
      setProgress(oldProgress => {
        if (oldProgress === 100) {
          clearInterval(timer)
          setTimeout(() => setIsComplete(true), 500)
          return 100
        }
        const diff = Math.random() * 10
        return Math.min(oldProgress + diff, 100)
      })
    }, 500)

    const generateRemediationSteps = async () => {
      const prompt = `Based on the following bug description and PDF content, generate a list of automated remediation steps:
      
      Bug Description: ${bugDescription}
      
      PDF Content: ${pdfText}
      
      Please provide a detailed list of steps that an automated system would take to remediate this issue with minimal user intervention.`;
      
      const result = await generateCompletion(prompt);
      const steps = result?.split('\n').filter(step => step.trim() !== '') || [];
      setRemediationSteps(steps);
    }

    generateRemediationSteps()

    return () => {
      clearInterval(timer)
    }
  }, [bugDescription, pdfText])

  return (
    <Card className="bg-white shadow-md border border-gray-200">
      <CardHeader>
        <CardTitle className="text-gray-900">Automated Remediation Process</CardTitle>
      </CardHeader>
      <CardContent className="text-gray-600">
        <h3 className="font-semibold mb-2">Remediation Progress:</h3>
        <ul className="list-disc list-inside mb-4">
          {remediationSteps.map((step, index) => (
            <li key={index} className={progress > (index / remediationSteps.length) * 100 ? 'text-green-600' : ''}>{step}</li>
          ))}
        </ul>
        <Progress value={progress} className="w-full h-2 mb-2 bg-gray-200" />
        <p className="text-sm text-gray-600 mb-4">{progress.toFixed(0)}% Complete</p>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center text-green-600 font-bold text-lg"
          >
            Remediation Complete!
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

export default function BcbAgentDemo() {
  const [activePhase, setActivePhase] = React.useState<string>(phases[0].id)
  const [bugDescription, setBugDescription] = React.useState('')
  const [systemInfo, setSystemInfo] = React.useState('')
  const [pdfText, setPdfText] = React.useState('')
  const [remediationStartTime, setRemediationStartTime] = React.useState<Date | null>(null)
  const [remediationEndTime, setRemediationEndTime] = React.useState<Date | null>(null)
  const [ttrWithSystem, setTtrWithSystem] = React.useState<number | null>(null)
  const [ttrWithoutSystem, setTtrWithoutSystem] = React.useState<number | null>(null)
  const [showDemo, setShowDemo] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [currentView, setCurrentView] = React.useState<'home' | 'remediation'>('home')

  const startRemediation = () => {
    if (!bugDescription) {
      alert('Please enter a bug description before starting remediation.')
      return
    }
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setRemediationStartTime(new Date())
      setShowDemo(true)
      setCurrentView('remediation')
    }, 2000)
  }

  const endRemediation = () => {
    if (remediationStartTime) {
      const endTime = new Date()
      setRemediationEndTime(endTime)
      const ttr = (endTime.getTime() - remediationStartTime.getTime()) / 1000
      setTtrWithSystem(ttr)
      setTtrWithoutSystem(ttr * (Math.random() * 1.5 + 1.5))
    }
  }

  const handleFeedback = (isPositive: boolean) => {
    alert(`Feedback received: ${isPositive ? 'Positive' : 'Negative'}`)
    setShowDemo(false)
    endRemediation()
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        setSystemInfo(content)
      }
      reader.readAsText(file)
    }
  }

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === 'application/pdf') {
      const formData = new FormData()
      formData.append('file', file)

      try {
        const response = await fetch('/api/parse-pdf', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          const data = await response.json()
          setPdfText(data.text)
        } else {
          throw new Error('Failed to parse PDF')
        }
      } catch (error) {
        console.error('Error parsing PDF:', error)
        alert('Error parsing PDF. Please try again.')
      }
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  const renderPhaseDemo = () => {
    if (!showDemo) return null

    switch (activePhase) {
      case 'phase1':
        return <Phase1Demo bugDescription={bugDescription} pdfText={pdfText} />
      case 'phase2':
        return <Phase2Demo bugDescription={bugDescription} systemInfo={systemInfo} pdfText={pdfText} />
      case 'phase3':
        return <Phase3Demo bugDescription={bugDescription} pdfText={pdfText} />
      default:
        return null
    }
  }

  const renderTTRComparison = () => {
    if (ttrWithSystem === null || ttrWithoutSystem === null) return null

    const improvement = ((ttrWithoutSystem - ttrWithSystem) / ttrWithSystem) * 100
    return (
      <Card className="bg-white shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-900">TTR Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-gray-600">
            <p>TTR with system: <span className="font-semibold">{ttrWithSystem.toFixed(2)} seconds</span></p>
            <p>Estimated TTR without system: <span className="font-semibold">{ttrWithoutSystem.toFixed(2)} seconds</span></p>
            <p className="font-bold text-green-600">
              Improvement: {improvement.toFixed(2)}%
            </p>
            <Progress value={improvement} className="h-2 bg-gray-200" />
          </div>
        </CardContent>
      </Card>
    )
  }

  const getStatusColor = (status: Phase['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'upcoming':
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <SidebarProvider>
      <AnimatePresence>
        {isLoading && <SplashScreen />}
      </AnimatePresence>
      <div className="flex h-screen bg-white text-gray-900">
        <Sidebar className="w-64 border-r border-gray-200 bg-gray-50">
          
          <SidebarHeader>
            <h2 className="text-xl font-bold px-4 py-2 text-blue-600">BCB Agent Demo</h2>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-gray-600">Phases</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {phases.map((phase) => (
                    <SidebarMenuItem key={phase.id}>
                      <SidebarMenuButton
                        onClick={() => setActivePhase(phase.id)}
                        isActive={activePhase === phase.id}
                        className="flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
                      >
                        <span className="flex items-center">
                          {phase.icon}
                          <span className="ml-2">{phase.title}</span>
                        </span>
                        {activePhase === phase.id && <ChevronRight className="h-4 w-4" />}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">BCB Agent Remediation</h1>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center" onClick={() => setCurrentView('home')}>
                  <Home className="mr-2 h-4 w-4" />
                  Home
                </Button>
                <Button variant="outline" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Button>
              </div>
            </div>

            {currentView === 'home' && (
              <Card className="bg-white shadow-md border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-gray-900">Welcome to BCB Agent</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    BCB Agent is an advanced system for identifying and remediating vulnerabilities in your software infrastructure. 
                    Our three-phase approach ensures comprehensive protection and efficient problem-solving.
                  </p>
                  <Button onClick={() => setCurrentView('remediation')} className="flex items-center">
                    <Search className="mr-2 h-4 w-4" />
                    Start Remediation
                  </Button>
                </CardContent>
              </Card>
            )}

            {currentView === 'remediation' && (
              <>
                <Card className="bg-white shadow-md border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-gray-900">Bug Description</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      placeholder="Describe the bug you're experiencing..."
                      value={bugDescription}
                      onChange={(e) => setBugDescription(e.target.value)}
                      className="w-full mb-4"
                    />
                    <div className="flex justify-between items-center">
                      <Button onClick={startRemediation} className="flex items-center">
                        <Search className="mr-2 h-4 w-4" />
                        Start Remediation
                      </Button>
                      <div className="flex items-center space-x-2">
                        {activePhase === 'phase2' && (
                          <div className="flex items-center">
                            <Input
                              type="file"
                              onChange={handleFileUpload}
                              className="hidden"
                              id="system-info-upload"
                            />
                            <label
                              htmlFor="system-info-upload"
                              className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center"
                            >
                              <Upload className="mr-2 h-4 w-4" />
                              Upload System Info
                            </label>
                          </div>
                        )}
                        <div className="flex items-center">
                          <Input
                            type="file"
                            onChange={handlePdfUpload}
                            className="hidden"
                            id="pdf-upload"
                            accept=".pdf"
                          />
                          <label
                            htmlFor="pdf-upload"
                            className="cursor-pointer bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center"
                          >
                            <FileText className="mr-2 h-4 w-4" />
                            Upload PDF
                          </label>
                        </div>
                      </div>
                    </div>
                    {pdfText && (
                      <p className="mt-2 text-sm text-gray-600">PDF uploaded and processed successfully.</p>
                    )}
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {phases.map((phase, index) => (
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className={`bg-white shadow-md border border-gray-200 ${activePhase === phase.id ? 'ring-2 ring-blue-500' : ''} transition-all duration-300 hover:shadow-lg`}>
                        <CardHeader>
                          <div className="flex justify-between items-center">
                            <div className="p-2 rounded-full bg-gray-100">
                              {phase.icon}
                            </div>
                            <Badge className={`${getStatusColor(phase.status)} text-xs`}>
                              {phase.status === 'completed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                              {phase.status.charAt(0).toUpperCase() + phase.status.slice(1)}
                            </Badge>
                          </div>
                          <CardTitle className="mt-4 text-gray-900">Phase {index + 1}: {phase.title}</CardTitle>
                          <CardDescription className="text-gray-600">{phase.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Target: {format(phase.targetDate, 'MMM d, yyyy')}</span>
                            <span>{differenceInDays(phase.targetDate, new Date())} days left</span>
                          </div>
                          <Progress 
                            value={((new Date().getTime() - new Date('2024-01-01').getTime()) / (phase.targetDate.getTime() - new Date('2024-01-01').getTime())) * 100} 
                            className="mt-2 bg-gray-200"
                          />
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {renderPhaseDemo()}

                {showDemo && 
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="bg-white shadow-md border border-gray-200">
                      <CardContent className="flex justify-center space-x-4 py-4">
                        <Button onClick={() => handleFeedback(true)} className="flex items-center bg-green-500 hover:bg-green-600 text-white">
                          <ThumbsUp className="mr-2 h-4 w-4" /> Thumbs Up
                        </Button>
                        <Button onClick={() => handleFeedback(false)} variant="outline" className="flex items-center border-red-500 text-red-500 hover:bg-red-50">
                          <ThumbsDown className="mr-2 h-4 w-4" /> Thumbs Down
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                }

                {renderTTRComparison()}
              </>
            )}
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}
