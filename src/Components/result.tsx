import { PasteClipboard } from "iconoir-react"
import React, { useState } from "react"

import copyToClipboard from "../Api/copyToClipboard"

import "../styles/Result.css"

export default function Result(props: {
    finalPassword: string
    copyText: string
}) {
    const { finalPassword, copyText } = props
    const copy = () => {
        setCopied(true)
        setTimeout(() => {
            setCopied(false)
        }, 1100)
    }

    const [isCopied, setCopied] = useState(false)

    const handleClick = async (word: string) => {
        await copyToClipboard(word)
        copy()
    }

    return (
        <>
            {finalPassword.length > 0 ? (
                <div
                    title={copyText}
                    className="card interact resultCard relative"
                    itemType="button"
                    tabIndex={0}
                    onClick={() => handleClick(finalPassword)}
                    onKeyDown={async (e) => {
                        if (e.key === "Enter") {
                            await handleClick(finalPassword)
                        }
                    }}
                >
                    <span>
                        <span
                            className={
                                isCopied ? "copiedSpanText" : "notCopiedSpan"
                            }
                        >
                            {finalPassword.length !== 0
                                ? finalPassword
                                : "Jotain meni vikaan... Salasanaa ei luotu."}
                        </span>
                    </span>
                    <span className="absoluteCopiedIcon">
                        {isCopied ? <PasteClipboard /> : null}
                    </span>
                </div>
            ) : (
                <div className="card">
                    Jotain meni vikaan... Salasanaa ei luotu. Koeta päivittää
                    sivu.
                </div>
            )}
        </>
    )
}
