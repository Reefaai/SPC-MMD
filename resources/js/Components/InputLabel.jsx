export default function InputLabel({
    value,
    className = '',
    children,
    ...props
}) {
    return (
        <label
            {...props}
            className={
                `scm-label ` +
                className
            }
        >
            {value ? value : children}
        </label>
    );
}
