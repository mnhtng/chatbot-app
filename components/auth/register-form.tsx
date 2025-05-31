"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import { AlertCircle, Eye, EyeClosed, X } from "lucide-react";
import { PasswordVisibleProps } from "./login-form";
import { Validation } from "@/app/page";
import { loginWithCredentials, loginWithGithub, loginWithGoogle } from "@/app/api/auth";
import { AutoCloseAlert } from "@/utils/alertUtil";
import { GitHub, Google } from "@/components/icon/brand"
import { LoadingSpin } from "@/components/icon/animate";

const RegisterForm = ({
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
            if (e.key === 'Enter' && e.target instanceof HTMLInputElement && e.target.form?.id === 'register') {
                const submitBtn = document.querySelector('form#register button[name="credentials"]') as HTMLButtonElement | null

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

        setValidation({ error: "", loading: true })

        const submitBtn = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement
        const provider = submitBtn.value

        if (provider === 'google') {
            // Google Registration
            try {
                await loginWithGoogle()
            } catch {
                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: 'Failed to sign up with Google',
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
            // Github Registration
            try {
                await loginWithGithub()
            } catch {
                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: 'Failed to sign up with Github',
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

        // Credentials Signup
        const formData = new FormData(e.target as HTMLFormElement)
        const name = formData.get('name') as string
        const email = formData.get('email') as string
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (!name || !email || !password || !confirmPassword) {
            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: 'Please fill in all fields',
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

        if (name.length < 2) {
            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: 'Name must be at least 2 characters long',
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
                        error: 'Please enter a valid email address',
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

        if (password !== confirmPassword) {
            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: 'Passwords do not match',
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

        const user = await fetch('/api/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        })

        if (!user || !user.ok) {
            const errorResponse = await user.json()

            AutoCloseAlert({
                onStart: () => {
                    setValidation({
                        error: errorResponse?.error,
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
        } else {
            const login = await loginWithCredentials(email, password)

            if (!login) {
                AutoCloseAlert({
                    onStart: () => {
                        setValidation({
                            error: 'Failed to sign up',
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
        }
    }

    return (
        <div className={className} {...props}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-center text-xl">Create an Account</CardTitle>

                    <CardDescription>
                        Please register to continue using our service.

                        <p className="text-sm text-muted-foreground">
                            By signing up, you agree to our{" "}
                            <Link
                                href="#"
                                className="underline underline-offset-4"
                            >
                                Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                                href="#"
                                className="underline underline-offset-4"
                            >
                                Privacy Policy
                            </Link>
                        </p>
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form id="register" onSubmit={onSubmit}>
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
                                <div className="flex flex-col gap-4">
                                    <Button
                                        type="submit"
                                        value="google"
                                        variant="outline"
                                        className="w-full border-current"
                                        disabled={validation.loading}
                                    >
                                        <Google />
                                        Signup with Google
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
                                        Signup with Github
                                    </Button>
                                </div>
                            </div>

                            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                                <span className="relative z-10 bg-background px-2 text-muted-foreground">
                                    Or continue with
                                </span>
                            </div>

                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="Your Name"
                                    />
                                </div>

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
                                    <Label htmlFor="password">Password</Label>
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

                                <div className="grid gap-2 relative">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type={passwordVisible.find(pv => pv.element === 'confirmPassword')?.isVisible ? 'text' : 'password'}
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
                                        {passwordVisible.find(pv => pv.element === 'confirmPassword')?.isVisible ?
                                            <Eye size={20} />
                                            :
                                            <EyeClosed size={20} />
                                        }
                                    </Button>
                                </div>

                                <Button
                                    type="submit"
                                    name="credentials"
                                    value={"credentials"}
                                    className="w-full"
                                    disabled={validation.loading}
                                >
                                    {validation.loading ? (
                                        <LoadingSpin title="Loading..." />
                                    ) : "Register"}
                                </Button>
                            </div>

                            <div className="text-center text-sm mb-5">
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="underline underline-offset-4"
                                >
                                    Login
                                </Link>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default RegisterForm;