"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Camera, Upload, MessageSquare, ChevronRight, ChevronLeft, Send, ArrowRight } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

// Sparkle component
const Sparkle = ({ size = "sm", color = "white", delay = 0, duration = 2, className = "" }) => {
  const sizeMap = {
    xs: "w-1 h-1",
    sm: "w-1.5 h-1.5",
    md: "w-2 h-2",
    lg: "w-3 h-3",
  }

  const colorMap = {
    white: "bg-white",
    purple: "bg-purple-400",
    pink: "bg-pink-400",
    blue: "bg-blue-400",
  }

  return (
    <motion.span
      className={`absolute inline-block rounded-full ${sizeMap[size]} ${colorMap[color]} ${className}`}
      style={{
        boxShadow:
          color === "white"
            ? "0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 6px rgba(255, 255, 255, 0.6)"
            : `0 0 10px 2px ${color === "purple" ? "rgba(167, 139, 250, 0.8)" : color === "pink" ? "rgba(244, 114, 182, 0.8)" : "rgba(96, 165, 250, 0.8)"}`,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
      }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 1, 0],
        rotate: [0, 180, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
      }}
    />
  )
}

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const fadeInLeft = {
  hidden: { opacity: 0, x: -60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const fadeInRight = {
  hidden: { opacity: 0, x: 60 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.8, ease: "easeOut" },
  },
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
}

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [messages, setMessages] = useState([
    { text: "Hi there! I'm your smart stylist. What's your style preference today?", sender: "bot" },
  ])
  const [messageInput, setMessageInput] = useState("")
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const featuresRef = useRef(null)
  const tryOnRef = useRef(null)
  const stylistRef = useRef(null)
  const shopRef = useRef(null)
  const contactRef = useRef(null)
  const carouselRef = useRef(null)

  const { scrollYProgress: featuresScrollProgress } = useScroll({
    target: featuresRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: tryOnScrollProgress } = useScroll({
    target: tryOnRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: stylistScrollProgress } = useScroll({
    target: stylistRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: shopScrollProgress } = useScroll({
    target: shopRef,
    offset: ["start end", "end start"],
  })

  const { scrollYProgress: contactScrollProgress } = useScroll({
    target: contactRef,
    offset: ["start end", "end start"],
  })

  const featuresOpacity = useTransform(featuresScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const featuresY = useTransform(featuresScrollProgress, [0, 0.3, 0.7, 1], [100, 0, 0, 100])

  const tryOnOpacity = useTransform(tryOnScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const tryOnY = useTransform(tryOnScrollProgress, [0, 0.3, 0.7, 1], [100, 0, 0, 100])

  const stylistOpacity = useTransform(stylistScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const stylistY = useTransform(stylistScrollProgress, [0, 0.3, 0.7, 1], [100, 0, 0, 100])

  const shopOpacity = useTransform(shopScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const shopY = useTransform(shopScrollProgress, [0, 0.3, 0.7, 1], [100, 0, 0, 100])

  const contactOpacity = useTransform(contactScrollProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0])
  const contactY = useTransform(contactScrollProgress, [0, 0.3, 0.7, 1], [100, 0, 0, 100])

  const products = [
    { id: 1, name: "Summer Dress", price: "$49.99", image: "/placeholder.svg?height=300&width=300" },
    { id: 2, name: "Casual Jeans", price: "$39.99", image: "/placeholder.svg?height=300&width=300" },
    { id: 3, name: "Elegant Blouse", price: "$29.99", image: "/placeholder.svg?height=300&width=300" },
    { id: 4, name: "Formal Suit", price: "$99.99", image: "/placeholder.svg?height=300&width=300" },
    { id: 5, name: "Winter Coat", price: "$79.99", image: "/placeholder.svg?height=300&width=300" },
  ]

  const recommendedItems = [
    { id: 1, name: "Striped T-Shirt", price: "$24.99", image: "/placeholder.svg?height=150&width=150" },
    { id: 2, name: "Denim Jacket", price: "$59.99", image: "/placeholder.svg?height=150&width=150" },
    { id: 3, name: "Black Pants", price: "$34.99", image: "/placeholder.svg?height=150&width=150" },
  ]

  // Auto-scroll carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1))
    }, 3000)

    return () => clearInterval(interval)
  }, [products.length])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev === products.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev === 0 ? products.length - 1 : prev - 1))
  }

  const sendMessage = () => {
    if (messageInput.trim()) {
      setMessages([...messages, { text: messageInput, sender: "user" }])

      // Simulate bot response
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            text: "Based on your style, I recommend checking out our new collection of casual wear. Here are some items that might interest you.",
            sender: "bot",
          },
        ])
      }, 1000)

      setMessageInput("")
    }
  }

  const scrollToSection = (ref) => {
    ref.current.scrollIntoView({ behavior: "smooth" })
  }

  const handleFileChange = useCallback((files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Create a URL for the image
    const reader = new FileReader()
    reader.onload = (e) => {
      setUploadedImage(e.target?.result as string)
      setIsUploading(false)
      toast({
        title: "Image uploaded",
        description: "Your photo has been uploaded successfully",
      })
    }
    reader.onerror = () => {
      setIsUploading(false)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your image",
        variant: "destructive",
      })
    }
    reader.readAsDataURL(file)
  }, [])

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileChange(e.dataTransfer.files)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-black">
      {/* Hero Section */}
      <section className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-purple-950/30 to-black"></div>

        {/* Sparkle effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Large sparkles */}
          {[...Array(20)].map((_, i) => (
            <Sparkle
              key={`large-sparkle-${i}`}
              size={Math.random() > 0.7 ? "lg" : Math.random() > 0.5 ? "md" : "sm"}
              color={Math.random() > 0.7 ? "white" : Math.random() > 0.5 ? "purple" : "pink"}
              delay={Math.random() * 5}
              duration={Math.random() * 2 + 1.5}
            />
          ))}

          {/* Floating light particles */}
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-px h-px bg-white rounded-full"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                boxShadow: "0 0 3px 1px rgba(255, 255, 255, 0.5)",
              }}
              animate={{
                y: [0, -Math.random() * 50 - 20, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.2, 0.8, 0.2],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: Math.random() * 5,
              }}
            />
          ))}

          {/* Glowing orbs */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={`orb-${i}`}
              className="absolute rounded-full"
              style={{
                background:
                  i % 2 === 0
                    ? "radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(0, 0, 0, 0) 70%)"
                    : "radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, rgba(0, 0, 0, 0) 70%)",
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: Math.random() * 8 + 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <motion.div
          className="z-10 text-center max-w-4xl px-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div className="relative" variants={fadeIn}>
            <motion.h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 text-transparent bg-clip-text">
              MiRRA
            </motion.h1>

            {/* Logo sparkles */}
            {[...Array(8)].map((_, i) => (
              <motion.span
                key={`logo-sparkle-${i}`}
                className="absolute inline-block w-1.5 h-1.5 bg-white rounded-full"
                style={{
                  boxShadow: "0 0 10px 2px rgba(255, 255, 255, 0.8), 0 0 20px 6px rgba(255, 255, 255, 0.6)",
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 5,
                }}
              />
            ))}
          </motion.div>
          <motion.p className="text-2xl md:text-3xl italic mb-12 text-purple-100" variants={fadeIn}>
            style in sight
          </motion.p>
          <motion.div variants={fadeIn}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-full px-8 py-6 text-lg shadow-lg shadow-purple-900/50 transition-all duration-300 hover:shadow-xl hover:shadow-purple-900/60"
              onClick={() => scrollToSection(featuresRef)}
            >
              Discover More <ArrowRight className="ml-2" />
            </Button>
          </motion.div>
        </motion.div>

        <div className="absolute bottom-10 left-0 right-0 flex justify-center">
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            className="text-purple-200"
          >
            <ArrowRight className="transform rotate-90 w-8 h-8" />
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section ref={featuresRef} className="w-full py-20 px-4 md:px-10 bg-gradient-to-b from-black to-black/95">
        <motion.div className="max-w-6xl mx-auto" style={{ opacity: featuresOpacity, y: featuresY }}>
          <motion.h2
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Welcome to MiRRA
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
              className="relative group"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
              <Image
                src="/placeholder.svg?height=500&width=500"
                alt="MiRRA Overview"
                width={500}
                height={500}
                className="rounded-lg shadow-xl relative"
              />
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
            >
              <h3 className="text-3xl font-semibold mb-6 text-purple-300">Redefining Fashion Experience</h3>
              <p className="text-lg text-gray-300 mb-6">
                MiRRA combines cutting-edge technology with fashion expertise to create a personalized shopping
                experience. Our platform offers virtual try-on capabilities and AI-powered styling recommendations to
                help you discover your perfect look without leaving your home.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-purple-200">Virtual Try-On</h4>
                    <p className="text-gray-400">See how clothes look on you before buying</p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4">
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg text-purple-200">Smart Stylist</h4>
                    <p className="text-gray-400">AI-powered fashion advice tailored to you</p>
                  </div>
                </div>
              </div>

              <Button
                className="mt-8 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/30"
                onClick={() => scrollToSection(tryOnRef)}
              >
                Try It Now
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Virtual Try-On Section */}
      <section ref={tryOnRef} className="w-full py-20 px-4 md:px-10 bg-gradient-to-b from-black/95 to-black">
        <motion.div className="max-w-6xl mx-auto" style={{ opacity: tryOnOpacity, y: tryOnY }}>
          <motion.h2
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Virtual Try-On
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              className="bg-black/80 border border-purple-800/50 p-8 rounded-xl shadow-lg shadow-purple-900/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
            >
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Upload Your Photo</h3>
              <p className="text-gray-300 mb-8">
                See how our clothes look on you by uploading your photo or using your camera. Our AI will fit the
                garments to your body shape and size.
              </p>

              <div className="flex flex-col gap-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e.target.files)}
                />

                <Button
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
                  onClick={handleButtonClick}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-5 h-5" /> Upload Photo
                    </>
                  )}
                </Button>

                <Button
                  variant="outline"
                  className="flex items-center justify-center gap-2 border-purple-600 text-purple-300 hover:bg-purple-900/30"
                >
                  <Camera className="w-5 h-5" /> Use Camera
                </Button>

                <div
                  className={`mt-4 p-4 border border-dashed rounded-lg text-center transition-all duration-300 ${
                    isDragging ? "border-pink-500 bg-pink-500/10 scale-105" : "border-purple-700 bg-purple-900/20"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  {isDragging ? (
                    <p className="text-pink-300">Drop your photo here</p>
                  ) : (
                    <p className="text-gray-400">Drag and drop your photo here or use the buttons above</p>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div
              className="bg-black/80 border border-purple-800/50 p-8 rounded-xl shadow-lg shadow-purple-900/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
            >
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Try-On Results</h3>
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-800 to-purple-900 rounded-lg flex items-center justify-center mb-4 border border-purple-700 overflow-hidden">
                {uploadedImage ? (
                  <Image
                    src={uploadedImage || "/placeholder.svg"}
                    alt="Your uploaded photo"
                    width={300}
                    height={400}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4">
                    <Image
                      src="/placeholder.svg?height=400&width=300"
                      alt="Virtual Try-On Result"
                      width={300}
                      height={400}
                      className="rounded-lg mb-4"
                    />
                    <p className="text-gray-400 text-sm">Upload a photo to see virtual try-on results</p>
                  </div>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="aspect-square bg-gradient-to-br from-gray-800 to-purple-900 rounded-md overflow-hidden border border-purple-700"
                  >
                    <Image
                      src={`/placeholder.svg?height=80&width=80&text=${item}`}
                      alt={`Outfit ${item}`}
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Smart Stylist Section */}
      <section ref={stylistRef} className="w-full py-20 px-4 md:px-10 bg-gradient-to-b from-black to-black/95">
        <motion.div className="max-w-6xl mx-auto" style={{ opacity: stylistOpacity, y: stylistY }}>
          <motion.h2
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Smart Stylist
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="md:col-span-2 bg-black/80 border border-purple-800/50 p-6 rounded-xl shadow-lg shadow-purple-900/20"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
            >
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">Chat with Your Personal Stylist</h3>

              <div className="h-80 overflow-y-auto mb-4 p-4 bg-black/50 rounded-lg border border-purple-800/30">
                {messages.map((message, index) => (
                  <div key={index} className={`mb-4 ${message.sender === "user" ? "text-right" : "text-left"}`}>
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                          : "bg-gradient-to-r from-gray-800 to-purple-800 text-gray-200"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Ask about style recommendations..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-grow bg-gray-800 border-purple-700 text-white"
                />
                <Button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
            >
              <h3 className="text-2xl font-semibold mb-4 text-purple-300">Recommended for You</h3>
              <div className="grid grid-cols-1 gap-4">
                {recommendedItems.map((item) => (
                  <Card
                    key={item.id}
                    className="p-4 flex items-center gap-4 hover:shadow-md transition-shadow bg-black/80 border border-purple-800/50"
                  >
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-md blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="rounded-md relative"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-200">{item.name}</h4>
                      <p className="text-gray-400">{item.price}</p>
                      <Button variant="link" className="p-0 h-auto text-pink-400 hover:text-pink-300">
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Shop Section */}
      <section ref={shopRef} className="w-full py-20 px-4 md:px-10 bg-gradient-to-b from-black/95 to-black">
        <motion.div className="max-w-6xl mx-auto" style={{ opacity: shopOpacity, y: shopY }}>
          <motion.h2
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Our Shop
          </motion.h2>

          <motion.div
            className="relative"
            ref={carouselRef}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <div className="overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{ transform: `translateX(-${activeSlide * 100}%)` }}
              >
                {products.map((product) => (
                  <div key={product.id} className="w-full flex-shrink-0 px-4">
                    <div className="bg-black/80 border border-purple-800/50 p-6 rounded-xl shadow-lg shadow-purple-900/20 text-center hover:shadow-purple-700/30 hover:shadow-xl transition-all duration-300">
                      <div className="mb-4 flex justify-center relative group">
                        <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="rounded-lg relative"
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-purple-200">{product.name}</h3>
                      <p className="bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text font-bold mb-4">
                        {product.price}
                      </p>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/30">
                        Add to Cart
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              variant="outline"
              className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-1/2 rounded-full w-12 h-12 p-0 border-purple-600 text-purple-300 hover:bg-purple-900/30 z-10"
              onClick={prevSlide}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            <Button
              variant="outline"
              className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-1/2 rounded-full w-12 h-12 p-0 border-purple-600 text-purple-300 hover:bg-purple-900/30 z-10"
              onClick={nextSlide}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>

            <div className="flex justify-center mt-8 gap-2">
              {products.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === activeSlide ? "bg-gradient-to-r from-purple-500 to-pink-500 w-6" : "bg-gray-600"
                  }`}
                  onClick={() => setActiveSlide(index)}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            className="text-center mt-12"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/30">
              View All Products
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="w-full py-20 px-4 md:px-10 bg-gradient-to-b from-black to-black/90">
        <motion.div className="max-w-6xl mx-auto" style={{ opacity: contactOpacity, y: contactY }}>
          <motion.h2
            className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeIn}
          >
            Contact Us
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInLeft}
            >
              <h3 className="text-2xl font-semibold mb-6 text-purple-300">Get in Touch</h3>
              <p className="mb-8 text-gray-300">
                Have questions about our products or services? We'd love to hear from you. Fill out the form and our
                team will get back to you as soon as possible.
              </p>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <span className="text-purple-200">contact@mirra.com</span>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <span className="text-purple-200">+1 (555) 123-4567</span>
                </div>

                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <span className="text-purple-200">123 Fashion Street, New York, NY 10001</span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInRight}
            >
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block mb-2 text-purple-300">
                      Name
                    </label>
                    <Input
                      id="name"
                      className="bg-black/80 border-purple-700/50 text-white placeholder:text-gray-500"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block mb-2 text-purple-300">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      className="bg-gray-800 border-purple-700 text-white placeholder:text-gray-500"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block mb-2 text-purple-300">
                    Subject
                  </label>
                  <Input
                    id="subject"
                    className="bg-gray-800 border-purple-700 text-white placeholder:text-gray-500"
                    placeholder="Subject"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block mb-2 text-purple-300">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    rows={5}
                    className="bg-black/80 border-purple-700/50 text-white placeholder:text-gray-500"
                    placeholder="Your message"
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-900/30">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 px-4 bg-gradient-to-b from-black/90 to-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
                MiRRA
              </h2>
              <p className="text-purple-400 mt-2">style in sight</p>
            </div>

            <div className="flex gap-6">
              <a href="#" className="text-purple-400 hover:text-pink-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>

              <a href="#" className="text-purple-400 hover:text-pink-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>

              <a href="#" className="text-purple-400 hover:text-pink-400 transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-purple-800 text-center text-purple-400 text-sm">
            <p>© {new Date().getFullYear()} MiRRA. All rights reserved.</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </main>
  )
}

