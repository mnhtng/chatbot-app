"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Lock, Home, LogIn, RefreshCw, AlertTriangle } from "lucide-react"
import { useSession } from "next-auth/react"

export default function Error({ statusCode }: { statusCode?: number }) {
    const { data: session } = useSession()

    if (statusCode && statusCode === 401) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-gray-900 dark:to-orange-950/50 flex items-center justify-center p-4">
                <Card className="max-w-2xl mx-auto shadow-2xl border-0 dark:bg-gray-800/50 dark:border-gray-700">
                    <CardContent className="p-4 sm:p-8 md:p-12 text-center space-y-6 md:space-y-8">
                        <div className="relative z-1">
                            <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 leading-none">
                                401
                            </h1>
                            <div className="absolute inset-0 text-7xl sm:text-8xl md:text-9xl font-bold text-red-100 dark:text-red-900/60 -z-1 translate-x-2 translate-y-2">
                                401
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                                Unauthorized Access
                            </h2>

                            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                                You don&apos;t have permission to access this page. Please log in or contact the administrator for support.
                            </p>
                        </div>

                        <div className="flex justify-center">
                            <div className="relative">
                                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-full flex items-center justify-center">
                                    <Shield className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 dark:text-red-400" />
                                </div>

                                <div className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center">
                                    <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Button
                                asChild
                                size="lg"
                                className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-500 dark:to-orange-500 dark:hover:from-red-600 dark:hover:to-orange-600 w-full sm:w-auto"
                            >
                                <Link href={`${session ? "/" : "/login"}`}>
                                    <LogIn className="w-4 h-4 mr-2" />
                                    Log in
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild className="w-full sm:w-auto dark:border-gray-600 dark:hover:bg-gray-700">
                                <Link href="/">
                                    <Home className="w-4 h-4 mr-2" />
                                    Back to Home
                                </Link>
                            </Button>
                        </div>

                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                                <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">Why am I seeing this page?</h3>
                                <ul className="text-sm text-red-700 dark:text-red-200 space-y-1 text-left">
                                    <li>• You are not logged into the system</li>
                                    <li>• Your account doesn&apos;t have access rights</li>
                                    <li>• Your login session has expired</li>
                                    <li>• The page requires special permissions</li>
                                </ul>
                            </div>

                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Need help?{" "}
                                <Link href="#" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline">
                                    Contact us
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-red-950/50 dark:via-gray-900 dark:to-orange-950/50 flex items-center justify-center p-4">
            <Card className="max-w-2xl mx-auto shadow-2xl border-0 dark:bg-gray-800/50 dark:border-gray-700">
                <CardContent className="p-4 sm:p-8 md:p-12 text-center space-y-6 md:space-y-8">
                    <div className="relative z-1">
                        <h1 className="text-7xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600 dark:from-red-400 dark:to-orange-400 leading-none">
                            500
                        </h1>
                        <div className="absolute inset-0 text-7xl sm:text-8xl md:text-9xl font-bold text-red-100 dark:text-red-900/60 -z-1 translate-x-2 translate-y-2">
                            500
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
                            Something Went Wrong
                        </h2>

                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                            We apologize, but an unexpected error has occurred. Please try again later or contact support if the problem persists.
                        </p>
                    </div>

                    <div className="flex justify-center">
                        <div className="relative">
                            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/50 dark:to-orange-900/50 rounded-full flex items-center justify-center">
                                <AlertTriangle className="w-12 h-12 sm:w-16 sm:h-16 text-red-500 dark:text-red-400" />
                            </div>

                            <div className="absolute -top-2 -right-2 w-10 h-10 sm:w-12 sm:h-12 bg-red-500 dark:bg-red-600 rounded-full flex items-center justify-center">
                                <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 dark:from-red-500 dark:to-orange-500 dark:hover:from-red-600 dark:hover:to-orange-600 w-full sm:w-auto"
                        >
                            <Link
                                href="/"
                                className="text-accent-foreground hover:text-white"
                            >
                                <Home className="w-4 h-4 mr-2" />
                                Back to Home
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => window.location.reload()}
                            className="w-full sm:w-auto dark:border-gray-600 dark:hover:bg-gray-700"
                        >
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Try Again
                        </Button>
                    </div>

                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                            <h3 className="font-semibold text-red-800 dark:text-red-300 mb-2">What can you do?</h3>
                            <ul className="text-sm text-red-700 dark:text-red-200 space-y-1 text-left">
                                <li>• Refresh the page and try again</li>
                                <li>• Clear your browser cache and cookies</li>
                                <li>• Check your internet connection</li>
                                <li>• Contact support if the problem persists</li>
                            </ul>
                        </div>

                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Need help?{" "}
                            <Link href="#" className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:underline">
                                Contact us
                            </Link>
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}