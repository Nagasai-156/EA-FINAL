'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  Play, Pause, ChevronLeft, ChevronRight, BookOpen, Clock, 
  CheckCircle, Circle, Download, Share, Star, Users, Code,
  Monitor, Headphones, FileText, Lightbulb, Target, Award,
  ArrowLeft, Volume2, VolumeX, Maximize, Settings
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/contexts/AuthContext'

// Mock tutorial data - in real app, this would come from API
const tutorialData = {
  1: {
    id: 1,
    title: 'Complete VLSI Design Bootcamp',
    description: 'Master digital circuit design from basic logic gates to complex processor architectures',
    category: 'VLSI',
    instructor: 'Dr. Sarah Chen',
    duration: '2.5 hours',
    rating: 4.9,
    students: 2340,
    level: 'Beginner',
    free: true,
    chapters: [
      {
        id: 1,
        title: 'Introduction to Digital Logic',
        duration: '15 min',
        type: 'video',
        completed: false,
        content: {
          videoUrl: '/tutorials/vlsi/chapter1.mp4',
          transcript: 'Welcome to VLSI Design! In this chapter, we\'ll explore the fundamentals of digital logic...',
          resources: [
            { name: 'Logic Gates Reference', type: 'pdf', url: '/resources/logic-gates.pdf' },
            { name: 'Practice Problems', type: 'interactive', url: '/practice/logic-gates' }
          ]
        }
      },
      {
        id: 2,
        title: 'Boolean Algebra Fundamentals',
        duration: '20 min',
        type: 'interactive',
        completed: false,
        content: {
          interactiveUrl: '/tutorials/vlsi/boolean-algebra',
          description: 'Interactive exercises to master Boolean algebra operations and simplification techniques.'
        }
      },
      {
        id: 3,
        title: 'Combinational Circuit Design',
        duration: '25 min',
        type: 'video',
        completed: false,
        content: {
          videoUrl: '/tutorials/vlsi/chapter3.mp4',
          transcript: 'Now let\'s dive into combinational circuits...',
          codeExamples: [
            {
              language: 'verilog',
              code: `module full_adder(
  input a, b, cin,
  output sum, cout
);
  assign sum = a ^ b ^ cin;
  assign cout = (a & b) | (cin & (a ^ b));
endmodule`
            }
          ]
        }
      },
      {
        id: 4,
        title: 'Sequential Circuit Basics',
        duration: '30 min',
        type: 'hands-on',
        completed: false,
        content: {
          labUrl: '/tutorials/vlsi/sequential-lab',
          description: 'Build and test flip-flops and latches in our virtual lab environment.'
        }
      },
      {
        id: 5,
        title: 'Introduction to Verilog HDL',
        duration: '35 min',
        type: 'video',
        completed: false,
        content: {
          videoUrl: '/tutorials/vlsi/chapter5.mp4',
          transcript: 'Verilog is a hardware description language...',
          codeExamples: [
            {
              language: 'verilog',
              code: `module counter(
  input clk, reset,
  output reg [3:0] count
);
  always @(posedge clk or posedge reset) begin
    if (reset)
      count <= 4'b0000;
    else
      count <= count + 1;
  end
endmodule`
            }
          ]
        }
      },
      {
        id: 6,
        title: 'Final Project: 4-bit ALU',
        duration: '45 min',
        type: 'project',
        completed: false,
        content: {
          projectUrl: '/tutorials/vlsi/alu-project',
          description: 'Design and implement a complete 4-bit Arithmetic Logic Unit using everything you\'ve learned.'
        }
      }
    ]
  }
}

export default function TutorialDetailPage() {
  const { isAuthenticated } = useAuth()
  const params = useParams()
  const tutorialId = parseInt(params.id as string)
  const tutorial = tutorialData[tutorialId as keyof typeof tutorialData]
  
  const [currentChapter, setCurrentChapter] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [showTranscript, setShowTranscript] = useState(false)
  const [completedChapters, setCompletedChapters] = useState<number[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Calculate progress based on completed chapters
    const completed = completedChapters.length
    const total = tutorial?.chapters.length || 1
    setProgress((completed / total) * 100)
  }, [completedChapters, tutorial])

  const markChapterComplete = (chapterId: number) => {
    if (!completedChapters.includes(chapterId)) {
      setCompletedChapters([...completedChapters, chapterId])
    }
  }

  const nextChapter = () => {
    if (tutorial && currentChapter < tutorial.chapters.length - 1) {
      setCurrentChapter(currentChapter + 1)
    }
  }

  const prevChapter = () => {
    if (currentChapter > 0) {
      setCurrentChapter(currentChapter - 1)
    }
  }

  if (!tutorial) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Navbar />
        <div className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-black text-black mb-4">Tutorial Not Found</h1>
            <Link href="/tutorials" className="text-secondary-500 hover:text-secondary-600 font-bold">
              ← Back to Tutorials
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const currentChapterData = tutorial.chapters[currentChapter]

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <Navbar />
      
      <div className="pt-32 pb-20">
        <div className="container mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Link 
              href="/tutorials"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-black transition-colors font-bold mb-6"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tutorials
            </Link>

            <div className="bg-white rounded-3xl p-8 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mb-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-lg text-sm font-bold border-2 border-primary-300">
                      {tutorial.category}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-bold border-2 border-green-300">
                      {tutorial.free ? 'FREE' : 'PREMIUM'}
                    </span>
                  </div>

                  <h1 className="text-4xl font-display font-black text-gray-900 mb-4">
                    {tutorial.title}
                  </h1>

                  <p className="text-lg text-gray-700 font-semibold mb-6 leading-relaxed">
                    {tutorial.description}
                  </p>

                  <div className="flex flex-wrap items-center gap-6 text-sm font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>{tutorial.students.toLocaleString()} students</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{tutorial.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span>{tutorial.rating} rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span>{tutorial.level}</span>
                    </div>
                  </div>
                </div>

                <div className="lg:w-80">
                  <div className="bg-gradient-to-br from-secondary-100 to-accent-100 rounded-2xl p-6 border-3 border-black">
                    <h3 className="font-black text-gray-900 mb-4">Your Progress</h3>
                    
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-bold text-gray-600">Completed</span>
                        <span className="text-sm font-black text-gray-900">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3 border-2 border-black">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.5 }}
                          className="bg-secondary-500 h-full rounded-full"
                        />
                      </div>
                    </div>

                    <div className="text-sm font-bold text-gray-600 mb-4">
                      {completedChapters.length} of {tutorial.chapters.length} chapters completed
                    </div>

                    {!isAuthenticated && (
                      <Link
                        href="/signup"
                        className="w-full py-3 bg-secondary-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Sign Up to Track Progress
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Chapter List */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sticky top-32">
                <h3 className="text-xl font-black text-gray-900 mb-6">Course Content</h3>
                
                <div className="space-y-3">
                  {tutorial.chapters.map((chapter, index) => (
                    <button
                      key={chapter.id}
                      onClick={() => setCurrentChapter(index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        currentChapter === index
                          ? 'bg-secondary-100 border-secondary-400 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                          : 'bg-gray-50 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {completedChapters.includes(chapter.id) ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-sm mb-1 leading-tight">
                            {chapter.title}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            {chapter.type === 'video' && <Play className="w-3 h-3" />}
                            {chapter.type === 'interactive' && <Monitor className="w-3 h-3" />}
                            {chapter.type === 'hands-on' && <Code className="w-3 h-3" />}
                            {chapter.type === 'project' && <Target className="w-3 h-3" />}
                            <span className="font-semibold">{chapter.duration}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-3"
            >
              <div className="bg-white rounded-3xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                {/* Chapter Header */}
                <div className="bg-gradient-to-r from-primary-600 to-secondary-600 text-white p-6 border-b-4 border-black">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-2xl font-black mb-2">{currentChapterData.title}</h2>
                      <div className="flex items-center gap-4 text-sm font-bold text-white/90">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{currentChapterData.duration}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {currentChapterData.type === 'video' && <Play className="w-4 h-4" />}
                          {currentChapterData.type === 'interactive' && <Monitor className="w-4 h-4" />}
                          {currentChapterData.type === 'hands-on' && <Code className="w-4 h-4" />}
                          {currentChapterData.type === 'project' && <Target className="w-4 h-4" />}
                          <span className="capitalize">{currentChapterData.type}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={prevChapter}
                        disabled={currentChapter === 0}
                        className="p-2 bg-white/20 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={nextChapter}
                        disabled={currentChapter === tutorial.chapters.length - 1}
                        className="p-2 bg-white/20 rounded-xl border-2 border-white/30 hover:bg-white/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-8">
                  {currentChapterData.type === 'video' && (
                    <div className="space-y-6">
                      {/* Video Player Placeholder */}
                      <div className="aspect-video bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl border-4 border-black flex items-center justify-center relative overflow-hidden">
                        <div className="text-center text-white">
                          <div className="w-20 h-20 bg-white/20 rounded-full border-4 border-white/30 flex items-center justify-center mb-4 mx-auto">
                            {isPlaying ? (
                              <Pause className="w-10 h-10" />
                            ) : (
                              <Play className="w-10 h-10 ml-1" />
                            )}
                          </div>
                          <p className="text-lg font-bold">Video Player</p>
                          <p className="text-sm text-white/70">Click to {isPlaying ? 'pause' : 'play'}</p>
                        </div>
                        
                        {/* Video Controls */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-center gap-4">
                          <button
                            onClick={() => setIsPlaying(!isPlaying)}
                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                          >
                            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                          </button>
                          
                          <div className="flex-1 bg-white/20 rounded-full h-2">
                            <div className="bg-secondary-500 h-full rounded-full w-1/3"></div>
                          </div>
                          
                          <button
                            onClick={() => setIsMuted(!isMuted)}
                            className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </button>
                          
                          <button className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors">
                            <Maximize className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      {/* Transcript Toggle */}
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => setShowTranscript(!showTranscript)}
                          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold border-2 border-gray-300 hover:bg-gray-200 transition-colors"
                        >
                          <FileText className="w-4 h-4 inline mr-2" />
                          {showTranscript ? 'Hide' : 'Show'} Transcript
                        </button>
                        
                        <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold border-2 border-gray-300 hover:bg-gray-200 transition-colors">
                          <Download className="w-4 h-4 inline mr-2" />
                          Download Resources
                        </button>
                      </div>

                      {/* Transcript */}
                      {showTranscript && currentChapterData.content.transcript && (
                        <div className="bg-gray-50 rounded-2xl p-6 border-2 border-gray-300">
                          <h4 className="font-black text-gray-900 mb-4">Transcript</h4>
                          <p className="text-gray-700 font-semibold leading-relaxed">
                            {currentChapterData.content.transcript}
                          </p>
                        </div>
                      )}

                      {/* Code Examples */}
                      {currentChapterData.content.codeExamples && (
                        <div className="space-y-4">
                          <h4 className="font-black text-gray-900">Code Examples</h4>
                          {currentChapterData.content.codeExamples.map((example, index) => (
                            <div key={index} className="bg-gray-900 rounded-2xl border-4 border-black overflow-hidden">
                              <div className="bg-gray-800 px-4 py-2 border-b-2 border-gray-700">
                                <span className="text-gray-300 font-bold text-sm uppercase">{example.language}</span>
                              </div>
                              <pre className="p-6 text-gray-100 font-mono text-sm overflow-x-auto">
                                <code>{example.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {currentChapterData.type === 'interactive' && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-green-100 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6">
                        <Monitor className="w-12 h-12 text-green-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4">Interactive Learning</h3>
                      <p className="text-lg text-gray-700 font-semibold mb-8 max-w-2xl mx-auto">
                        {currentChapterData.content.description}
                      </p>
                      <button className="px-8 py-4 bg-green-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Launch Interactive Exercise
                      </button>
                    </div>
                  )}

                  {currentChapterData.type === 'hands-on' && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-purple-100 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6">
                        <Code className="w-12 h-12 text-purple-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4">Hands-On Lab</h3>
                      <p className="text-lg text-gray-700 font-semibold mb-8 max-w-2xl mx-auto">
                        {currentChapterData.content.description}
                      </p>
                      <button className="px-8 py-4 bg-purple-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Open Virtual Lab
                      </button>
                    </div>
                  )}

                  {currentChapterData.type === 'project' && (
                    <div className="text-center py-12">
                      <div className="w-24 h-24 bg-orange-100 rounded-full border-4 border-black flex items-center justify-center mx-auto mb-6">
                        <Target className="w-12 h-12 text-orange-600" />
                      </div>
                      <h3 className="text-2xl font-black text-gray-900 mb-4">Final Project</h3>
                      <p className="text-lg text-gray-700 font-semibold mb-8 max-w-2xl mx-auto">
                        {currentChapterData.content.description}
                      </p>
                      <button className="px-8 py-4 bg-orange-500 text-white rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
                        Start Project
                      </button>
                    </div>
                  )}

                  {/* Chapter Actions */}
                  <div className="flex items-center justify-between pt-8 border-t-2 border-gray-200 mt-8">
                    <button
                      onClick={() => markChapterComplete(currentChapterData.id)}
                      disabled={completedChapters.includes(currentChapterData.id)}
                      className={`px-6 py-3 rounded-xl font-black border-3 border-black transition-all ${
                        completedChapters.includes(currentChapterData.id)
                          ? 'bg-green-400 text-black cursor-default'
                          : 'bg-secondary-500 text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]'
                      }`}
                    >
                      {completedChapters.includes(currentChapterData.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Completed
                        </>
                      ) : (
                        'Mark as Complete'
                      )}
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={prevChapter}
                        disabled={currentChapter === 0}
                        className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold border-2 border-gray-300 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                      </button>
                      
                      <button
                        onClick={nextChapter}
                        disabled={currentChapter === tutorial.chapters.length - 1}
                        className="px-4 py-3 bg-accent-500 text-black rounded-xl font-black border-3 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}