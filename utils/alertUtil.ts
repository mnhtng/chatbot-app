let timer: NodeJS.Timeout | null = null;

export const AutoCloseAlert = ({
    onStart,
    onClose,
    duration = 5000,
}: {
    onStart: () => void
    onClose: () => void
    duration?: number
}) => {
    if (timer) {
        clearTimeout(timer)
    }

    onStart()

    timer = setTimeout(() => {
        onClose();
    }, duration)

    return () => {
        if (timer) {
            clearTimeout(timer);
            timer = null;
        }
    }
}
