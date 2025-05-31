"use client"

import { cn } from "@/_lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AlertCircle, Eye, EyeClosed, X } from "lucide-react"
import { Validation } from "@/app/page"
import { loginWithCredentials, loginWithGithub, loginWithGoogle } from "@/app/api/auth/auth"
import { AutoCloseAlert } from "@/utils/alertUtil"
import { GitHub, Google } from "@/components/icon/brand"
import { LoadingSpin } from "@/components/icon/animate"

export interface PasswordVisibleProps {
    element: string;
    isVisible: boolean;
}

const LoginForm = ({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) => {
    const [validation, setValidation] = useState<Validation>({
        error: "",
        loading: false
    })
    const [passwordVisible, setPasswordVisible] = useState<PasswordVisibleProps[]>([])

    const handleTogglePassword = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const passwordInput = e.currentTarget.parentElement?.querySelector('input')?.name

        const currentPasswordVisible = passwordVisible.find(pv => pv.element === passwordInput)

        if (!(currentPasswordVisible?.element === passwordInput)) {
            setPasswordVisible(prevState => [
                ...prevState.filter(pv => pv.element !== passwordInput),
                { element: passwordInput || "", isVisible: true }
            ])
            return
        }

        if (currentPasswordVisible?.isVisible === false) {
            setPasswordVisible(prevState => [
                ...prevState.filter(pv => pv.element !== passwordInput),
                { element: passwordInput || "", isVisible: true }
            ])
            return
        }

        setPasswordVisible(prevState => [
            ...prevState.filter(pv => pv.element !== passwordInput),
            { element: passwordInput || "", isVisible: false }
        ])
    }

    // Show alert if login failed
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search)
            const error = urlParams.get('error')

            if (error) {
                urlParams.delete('error')
                const newUrl = `${window.location.pathname}${urlParams.toString() ? '?' + urlParams.toString() : ''}`
                window.history.replaceState({}, document.title, newUrl)

                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: "Email is used by another account!",
                            loading: false
                        })
                    },
                    onClose: () => {
                        setValidation({
                            error: '',
                            loading: false
                        })
                    }
                })
            }
        }
    }, [])

    useEffect(() => {
        const submitForm = (e: KeyboardEvent) => {
            if (e.key === 'Enter') {
                const submitBtn = document.querySelector('form#login button[type="submit"]') as HTMLButtonElement

                if (submitBtn) {
                    submitBtn.click()
                }
            }
        }

        document.addEventListener('keydown', submitForm)

        return () => {
            document.removeEventListener('keydown', submitForm)
        }
    })

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        setValidation({ ...validation, loading: true })

        const submitBtn = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
        const provider = submitBtn.value

        if (provider === 'google') {
            // Google Login
            try {
                await loginWithGoogle()
            } catch {
                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: 'Failed to log in with Google',
                            loading: false
                        })
                    },
                    onClose: () => {
                        setValidation({
                            error: '',
                            loading: false
                        })
                    }
                })
            }
            return
        } else if (provider === 'github') {
            // Github Login
            try {
                await loginWithGithub()
            } catch {
                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: 'Failed to log in with Github',
                            loading: false
                        })
                    },
                    onClose: () => {
                        setValidation({
                            error: '',
                            loading: false
                        })
                    }
                })
            }
            return
        }

        // Credentials Login
        const formData = new FormData(e.target as HTMLFormElement)
        const email = formData.get('email') as string
        const password = formData.get('password') as string

        if (!email || !password) {
            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: 'Email and password are required',
                        loading: false
                    })
                },
                onClose: () => {
                    setValidation({
                        error: '',
                        loading: false
                    })
                }
            })
            return
        }

        if (!/\S+@gmail\.com/.test(email)) {
            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: 'Email must be a valid Gmail address',
                        loading: false
                    })
                },
                onClose: () => {
                    setValidation({
                        error: '',
                        loading: false
                    })
                }
            })

            return
        }

        try {
            const login = await loginWithCredentials(email, password)

            if (!login) {
                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: 'Invalid email or password',
                            loading: false
                        })
                    },
                    onClose: () => {
                        setValidation({
                            error: '',
                            loading: false
                        })
                    }
                })
                return
            }

            window.location.href = '/'
        } catch {
            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: 'Invalid email or password',
                        loading: false
                    })
                },
                onClose: () => {
                    setValidation({
                        error: '',
                        loading: false
                    })
                }
            })
        }
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Welcome back</CardTitle>

                    <CardDescription>
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form id="login" onSubmit={onSubmit}>
                        {validation.error && (
                            <>
                                <Alert variant="destructive" className="fixed top-[12.5%] right-0 z-50 w-[90vw] max-w-sm">
                                    <AlertCircle className="h-4 w-4" />

                                    <AlertTitle>Error</AlertTitle>

                                    <AlertDescription>
                                        {validation.error}

                                        <Button
                                            variant="link"
                                            className="absolute top-0 right-2 rounded-sm p-0 opacity-70 hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-muted"
                                            onClick={() => setValidation({ ...validation, error: "" })}
                                        >
                                            <X size={16} className="text-red-400" />
                                        </Button>
                                    </AlertDescription>
                                </Alert>
                            </>
                        )}

                        <div className="grid gap-6">
                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    value="google"
                                    variant="outline"
                                    className="w-full border-current"
                                    disabled={validation.loading}
                                >
                                    <Google />
                                    Login with Google
                                </Button>
                            </div>

                            <div className="flex flex-col gap-4">
                                <Button
                                    type="submit"
                                    value="github"
                                    variant="outline"
                                    className="w-full border-current"
                                    disabled={validation.loading}
                                >
                                    <GitHub />
                                    Login with Github
                                </Button>
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>

                            <div className="grid gap-6">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                    />
                                </div>

                                <div className="grid gap-2 relative">
                                    <div className="flex items-center">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="#"
                                            className="ml-auto text-sm underline-offset-4 hover:underline"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        name="password"
                                        type={passwordVisible.find(pv => pv.element === 'password')?.isVisible ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        className="pr-10"
                                    />
                                    <Button
                                        variant='ghost'
                                        size='icon'
                                        type='button'
                                        className='absolute top-[50%] right-0 -translate-y-1 cursor-pointer'
                                        onClick={(e) => handleTogglePassword(e)}
                                    >
                                        {passwordVisible.find(pv => pv.element === 'password')?.isVisible ?
                                            <Eye size={20} />
                                            :
                                            <EyeClosed size={20} />
                                        }
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={validation.loading}
                                >
                                    {validation.loading ? (
                                        <LoadingSpin title="Loading..." />
                                    ) : "Login"}
                                </Button>
                            </div>

                            <div className="text-center text-sm">
                                Don&apos;t have an account?{" "}
                                <Link
                                    href="/register"
                                    className="underline underline-offset-4"
                                >
                                    Sign up
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <Link href="#">Privacy Policy</Link>.
            </div>
        </div>
    )
}

export default LoginForm