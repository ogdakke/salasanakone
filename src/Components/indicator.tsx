import { Suspense, useCallback, useEffect, useState } from "react";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";

// import { FormType } from "./form";
import "../styles/Indicator.css";

import { InfoEmpty, OpenSelectHandGesture } from "iconoir-react";
import { ErrorBoundary } from "react-error-boundary";

import { ErrorComponent } from "./errorComponent";
import { type InputValueTypes } from "./form";
import { Divider } from "./ui/divider";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

// console.time("checkingTime")
const checker = async (password: string) => {
    const check = await import("../Api/checkStrength").then(
        (r) => r.checkStrength,
    );
    // const now = performance.now()
    // console.log("🚀 ~ file: indicator.tsx:8 ~ checker ~ now:", now-then, "ms")

    return await check(password.toString());
};
// console.timeEnd("checkingTime")

/**
 * returns a substring of desired length {length} if str is longer than {length}
 * @param length desired length
 * @param str string to check
 * @returns string, mutated or not
 */
const validateLength = (str: string, length: number) => {
    let final = str;
    console.log(`Checked string of length ${str.length}`);
    if (str.length > length) {
        final = str.substring(0, length);
    }
    return final;
};

const parseValue = (value: number) => {
    let mutatedValue = value;
    if (value.toString().length > 10) {
        return "Miljardeja vuosia";
    }
    if (value.toString().length > 7) {
        mutatedValue = Math.floor(value / 1000000);
        return `${mutatedValue} milj. vuotta`;
    }
    return mutatedValue + " vuotta";
};

let didInit = false;
let didCheckTime = false;
/**
 * Calculates the strength of a given password and returns a element
 * @param props {object} {formValues: object, password: string, sliderValue: number}
 * @returns JSX element
 */
export function StrengthIndicator(props: {
    formValues: InputValueTypes;
    password: string;
    sliderValue: number;
}): JSX.Element {
    const { formValues, password, sliderValue } = props;

    const validateString = useCallback(() => {
        if (!formValues.words.selected && sliderValue > 15) {
            // a rndm string needs not be checked if its longer than 15
            return false;
        } else if (formValues.words.selected && sliderValue > 3) {
            return false;
        }
        return true;
    }, [formValues, sliderValue]);

    const [output, setOutput] = useState("Loistava");

    const [score, setScore] = useState(4);
    const [time, setTime] = useState<string[]>([""]);

    const timeToCheck = async () => {
        // didCheckTime prevents unneccessary computation. eg. user clicks again, even if password has not changed
        if (!didCheckTime) {
            console.time("timeToCheck");
            didCheckTime = true;
            await checker(validateLength(password, 70)).then((r) => {
                let timeToDo =
                    r.crackTimesDisplay.offlineSlowHashing1e4PerSecond.toString();

                const timeInSecs =
                    r.crackTimesSeconds.offlineSlowHashing1e4PerSecond;
                const years = Math.floor(timeInSecs / 31556952);

                if (
                    timeToDo.includes("vuotta") ||
                    timeToDo.includes("vuosikymmeniä")
                ) {
                    timeToDo = parseValue(years);
                }

                setTime([timeToDo]);
            });
            console.timeEnd("timeToCheck");
        }
    };

    // runs excactly once when mounting/initializing. -- so runs on page load.
    /**
     * 4.4.2023
     * Not sure how this actually works, it does not seem to get used, since I've tried to make it wait for a non null password
     */
    useEffect(() => {
        if (!didInit) {
            if (password.length > 0) {
                didInit = true;
                checker(password)
                    .then((r) => {
                        // console.log("🚀 ~ file: indicator.tsx:106 ~ checker ~ password:", password)
                        console.log("Mounted and checking...");
                        setScore(r.score);
                        setOutput(numberToString(r.score));
                    })
                    .catch((err) => {
                        console.error("Error in checking", ...err);
                    })
                    .finally(() => {
                        console.log("Mounted and checked successfully.");
                    });
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // THis is run each time the dep array gets a hit, so set time check to false.
        didCheckTime = false;
        // kikkailua, jotta ei tarvis laskea aina scorea, koska se on kallista.
        if (!validateString()) {
            setScore(4);
            setOutput(numberToString(4));
        } else {
            if (password.length > 0) {
                checker(password)
                    .then((r) => {
                        setScore(r.score);
                        setOutput(numberToString(r.score));
                        console.log("Checked strength succesfully");
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        }
        return () => {
            didCheckTime = true;
        };
    }, [password]);

    // const [op, setOp] = useState(false)

    return (
        <ErrorBoundary
            fallbackRender={({ error, resetErrorBoundary }) => {
                return (
                    <ErrorComponent
                        error={error}
                        resetErrorBoundary={resetErrorBoundary}
                    />
                );
            }}
        >
            <Suspense
                fallback={
                    <div className="strengthIndicator case5">
                        <span>Arvio</span>
                    </div>
                }
            >
                <Popover modal={true}>
                    <PopoverTrigger
                        onClick={async () => {
                            await timeToCheck();
                        }}
                    >
                        <div>
                            <TooltipProvider delayDuration={600}>
                                <Tooltip>
                                    <TooltipTrigger type="button" asChild>
                                        <div
                                            className={`interact strengthIndicator case${score.toString()}`}
                                        >
                                            <span>{output}</span>
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        sideOffset={4}
                                        className="TooltipContent"
                                    >
                                        <div className="flex-center">
                                            <OpenSelectHandGesture
                                                width={20}
                                                height={20}
                                            />
                                            Lisätietoja
                                        </div>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    </PopoverTrigger>
                    <PopoverContent
                        align="center"
                        side="top"
                        className="PopoverContent"
                        onOpenAutoFocus={(e) => {
                            e.preventDefault();
                        }}
                    >
                        <div className="popCard">
                            <p className="resultHelperText">
                                Murtamiseen vaadittu aika
                            </p>
                            <div className="">
                                <Divider margin="0.25rem 0rem" />
                                <div className="flex-center space-between">
                                    <p className="fadeIn">{time[0]}</p>
                                    <TooltipProvider delayDuration={600}>
                                        <Tooltip>
                                            <TooltipTrigger>
                                                <a
                                                    className="flex-center"
                                                    aria-label="Info"
                                                    href="#miten-vahvuus-arvioidaan"
                                                >
                                                    <InfoEmpty
                                                        className="hover interact"
                                                        width={20}
                                                        height={20}
                                                        strokeWidth={1.75}
                                                        opacity={0.75}
                                                    />
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent
                                                sideOffset={6}
                                                className="TooltipContent"
                                            >
                                                <div className="flex-center">
                                                    <OpenSelectHandGesture
                                                        width={20}
                                                        height={20}
                                                    />
                                                    Miten vahvuus arvioidaan?
                                                </div>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </div>
                            </div>
                        </div>
                    </PopoverContent>
                </Popover>
            </Suspense>
        </ErrorBoundary>
    );
}

function numberToString(value: number) {
    switch (value) {
        case 0:
            return "Surkea";
        case 1:
            return "Huono";
        case 2:
            return "Ok";
        case 3:
            return "Hyvä";
        case 4:
            return "Loistava";
        default:
            return "Arvio";
    }
}
