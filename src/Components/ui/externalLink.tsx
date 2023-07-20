import { OpenNewWindow } from "iconoir-react";
import { type PropsWithChildren } from "react";

interface Props {
    link: string;
    size?: number;
    children?: JSX.Element | string;
    className?: string;
}

export const ExternalLink = (
    { link, size = 20, children, className = "" }: PropsWithChildren<Props>,
    { ...props },
) => {
    const key = new Date().getTime().toString();
    const clicked = () => {
        console.log(key, new Date().getTime());
    };

    return (
        <a
            key={key}
            onClick={clicked}
            className={`flex-center inline ${className}`}
            target="_blank"
            href={link}
            {...props}
        >
            {children}
            <OpenNewWindow width={size} height={size} />
        </a>
    );
};
