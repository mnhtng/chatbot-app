import * as React from "react";
import type { SVGProps } from "react";

export const LoadingSpin = ({
    title,
    titleStyle,
    props
}: {
    title?: string;
    titleStyle?: string;
    props?: SVGProps<SVGSVGElement>;
}) =>
    <span className="flex items-center justify-center">
        <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-muted-foreground"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            {...props}
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>

        {title && <span className={`text-muted-foreground ${titleStyle}`}>
            {title}
        </span>}
    </span>

export const LoadingDots = ({
    dots = 3,
    delay = 150,
    className,
    props
}: {
    dots?: number;
    delay?: number;
    className?: string;
    props?: React.HTMLAttributes<HTMLDivElement>;
}) =>
    <div className={`flex gap-2 ${className}`} {...props}>
        {dots && Array.from({ length: dots }).map((_, index) => (
            <div
                key={index}
                className="w-2 h-2 rounded-full bg-foreground animate-bounce"
                style={{ animationDelay: `${index * delay}ms` }}
            ></div>
        ))}
    </div>
