// modules
import React, { Suspense, useCallback, useEffect, useState } from "react";

// hooks
import { usePersistedState } from "../hooks/usePersistedState";

// styles
import "../styles/Form.css";
import "../styles/ui/Checkbox.css";

// Icons
import { Refresh } from "iconoir-react";

// components
import { createCrypto } from "../main";
import { StrengthIndicator } from "./indicator";
import { Checkbox } from "./ui/checkbox";
import { InputComponent } from "./ui/input";
// ui
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radioGroup";
import { Slider } from "./ui/slider";

const Result = React.lazy(async () => await import("./result"));
// passgen module
const createCryptoKey = await createCrypto;

type InputType = "checkbox" | "input" | "radio";
type KeyType = "words" | "uppercase" | "numbers" | "randomChars";

interface InputValue {
    inputType: InputType;
    value?: string;
    selected: boolean;
    info: string;
}

export type InputValueTypes = {
    [key in KeyType]: InputValue;
};

const inputValues: InputValueTypes = {
    words: {
        inputType: "radio",
        selected: true,
        info: "Luodaanko salasana sanoista?",
    },
    uppercase: {
        inputType: "checkbox",
        selected: true,
        info: "Sisältääkö Salasana isoja kirjaimia.",
    },
    numbers: {
        inputType: "checkbox",
        selected: false,
        info: "Sisältääkö Salasana numeroita satunnaisissa paikoissa.",
    },
    randomChars: {
        inputType: "input",
        value: "-1-",
        selected: false,
        info: "Välimerkki, joka yhdistää sanat.",
    },
};

const lang = {
    Finnish: true,
    English: false,
};

// const initialKeys: string[] = Object.keys(initialFormValues)
const initialInputKeys = Object.entries(inputValues);

const correctType = (arg: unknown, desiredType: unknown): boolean => {
    const isType = typeof arg;
    if (isType === desiredType) {
        // console.log("Type does match", isType, " is ", desiredType);
        return true;
    } else {
        console.error("Type does not match", isType, " is not ", desiredType);
        return false;
    }
};

export default function FormComponent(): JSX.Element {
    const [finalPassword, setFinalPassword] = useState<string>("");
    const [formValuesTyped, setFormValuesTyped] = usePersistedState(
        "formValues",
        inputValues,
    );
    const [sliderValue, setSliderValue] = usePersistedState("sliderValue", 4);
    const formValues = formValuesTyped;
    // as FormType // explicitly type formValues as FormType
    const setFormValues = setFormValuesTyped;
    // as Dispatch<SetStateAction<FormType>> // explicitly type setFormValues as Dispatch<SetStateAction<FormType>>
    const [isDisabled, setDisabled] = useState(false);

    const minLengthForChars = 4;
    const minLengthForWords = 1;
    const maxLengthForChars = 64;
    const maxLengthForWords = 12;

    const validate = useCallback(
        (sliderValue: number): number => {
            if (
                formValues.words.selected &&
                (sliderValue > maxLengthForWords ||
                    sliderValue < 1 ||
                    !correctType(sliderValue, "number")) // should return false
            ) {
                setSliderValue(maxLengthForWords);
                return maxLengthForWords;
            } else if (
                !formValues.words.selected &&
                sliderValue < minLengthForChars
            ) {
                setSliderValue(minLengthForChars);
                return minLengthForChars;
            }
            return sliderValue;
        },
        [formValues, setSliderValue],
    );

    const generate = useCallback(async () => {
        formValues.words.selected && sliderValue < 2
            ? setDisabled(true)
            : setDisabled(false);
        try {
            setFinalPassword(
                await createCryptoKey(sliderValue.toString(), formValues),
            );
            // .then((r) => {
            //     setFinalPassword(r);
            // })
            // .catch(() => {
            //     throw new Error("Error generating key");
            // });
        } catch (err) {
            console.error(err);
            throw new Error("Error setting password");
        }
    }, [formValues, sliderValue]);

    useEffect(() => {
        let didCheck = false;
        if (!didCheck) {
            didCheck = true;
            validate(sliderValue);
            generate();
        }
        return () => {
            didCheck = false;
        };
    }, [generate, sliderValue, validate]);

    const valuesToForm = (option: KeyType, event: any, value: string): void => {
        setFormValues((formValues) => {
            const updatedFormValues = { ...formValues };
            if (value === "selected") {
                const updatedFormValue = {
                    ...updatedFormValues[option],
                    selected: event,
                };
                updatedFormValues[option] = updatedFormValue;
            } else {
                const updatedFormValue = {
                    ...updatedFormValues[option],
                    value: event,
                };
                updatedFormValues[option] = updatedFormValue;
            }
            return updatedFormValues;
        });
    };

    const labelForCheckbox = (
        option: string,
    ):
        | "Isot Kirjaimet"
        | "Välimerkit"
        | "Numerot"
        | "Salalause"
        | "Käytä sanoja" => {
        if (option === "uppercase") {
            return "Isot Kirjaimet";
        } else if (option === "randomChars") {
            return "Välimerkit";
        } else if (option === "numbers") {
            return "Numerot";
        } else if (option === "passphrase") {
            return "Salalause";
        }
        return "Käytä sanoja";
    };

    const sliderVal = (value: number): number => {
        setSliderValue(validate(value));
        return value;
    };

    return (
        <>
            <form
                className="form fadeIn"
                action="submit"
                aria-busy="false"
                style={{ opacity: "1" }}
            >
                <div className="resultWrapper">
                    <p className="resultHelperText">
                        Kopioi Salasana napauttamalla:
                    </p>
                    <Suspense
                        fallback={
                            <div aria-busy="true" className="card">
                                <span className="notCopied">Ladataan...</span>
                            </div>
                        }
                    >
                        <Result
                            aria-busy="false"
                            aria-label="Salasana, jonka voi kopioida napauttamalla"
                            finalPassword={finalPassword}
                            copyText={copyText}
                        />
                    </Suspense>
                </div>

                <div className="inputGrid">
                    {initialInputKeys.map(([item, objEntries]) => {
                        const option = item as KeyType;
                        const values = objEntries;
                        // formValues[option].selected
                        if (values.inputType === "checkbox") {
                            return (
                                <div
                                    key={option}
                                    className="checkboxParent flex-center"
                                    style={{ gridArea: `${option}` }}
                                >
                                    <Checkbox
                                        aria-label={labelForCheckbox(option)}
                                        checked={formValues[option].selected}
                                        onCheckedChange={(event) => {
                                            values.selected = !values.selected;
                                            valuesToForm(
                                                option,
                                                event,
                                                "selected",
                                            );
                                        }}
                                        id={option}
                                        value={values.selected.toString()}
                                    ></Checkbox>
                                    <Label title={values.info} htmlFor={option}>
                                        {labelForCheckbox(option)}
                                    </Label>
                                </div>
                            );
                        } else if (values.inputType === "radio") {
                            return (
                                <div key={option} className="flex-center radio">
                                    <RadioGroup
                                        defaultValue={formValues[
                                            option
                                        ].selected.toString()}
                                        onValueChange={(event) => {
                                            const asBool = JSON.parse(
                                                event.toLowerCase(),
                                            ) as unknown; // JSON.parse is a handy way to get boolean value, since we know it is either given "true" of "false"

                                            values.selected = !values.selected;
                                            valuesToForm(
                                                option,
                                                asBool,
                                                "selected",
                                            );
                                        }}
                                    >
                                        <div className="flex-center">
                                            <RadioGroupItem
                                                value="true"
                                                id="r1"
                                                key="r1"
                                            />
                                            <Label htmlFor="r1">
                                                Käytä sanoja
                                            </Label>
                                        </div>
                                        <div className="flex-center">
                                            <RadioGroupItem
                                                value="false"
                                                id="r2"
                                                key="r2"
                                            />
                                            <Label htmlFor="r2">
                                                Käytä merkkejä
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            );
                        } else {
                            // if values.inputType === "input"
                            return (
                                <div key={option} className="textInputBox">
                                    {formValues.words.selected ? (
                                        <div className="fadeIn labelOnTop">
                                            <Label
                                                className="flex-bottom"
                                                title={values.info}
                                                htmlFor={option}
                                            >
                                                {labelForCheckbox(option)}
                                                {isDisabled ? (
                                                    <span className="resultHelperText">
                                                        Lisää sanoja
                                                    </span>
                                                ) : (
                                                    <span></span>
                                                )}
                                            </Label>
                                            <InputComponent
                                                disabled={isDisabled}
                                                maxLength={32}
                                                defaultValue={
                                                    formValues[option].value
                                                }
                                                placeholder={inputPlaceholder}
                                                onChange={(event) => {
                                                    valuesToForm(
                                                        option,
                                                        event.target.value,
                                                        "value",
                                                    );
                                                }}
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            key={option}
                                            className="flex-center fadeIn"
                                        >
                                            <Checkbox
                                                aria-label={labelForCheckbox(
                                                    option,
                                                )}
                                                className="checkboxRoot"
                                                checked={
                                                    formValues[option].selected
                                                }
                                                onCheckedChange={(event) => {
                                                    values.selected =
                                                        !values.selected;
                                                    valuesToForm(
                                                        option,
                                                        event,
                                                        "selected",
                                                    );
                                                }}
                                                id={option}
                                                value={values.selected.toString()}
                                            ></Checkbox>
                                            <Label htmlFor={option}>
                                                Erikoismerkit
                                            </Label>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                    })}
                    <div className="sliderWrapper">
                        <Label htmlFor="slider">
                            {formValues.words.selected
                                ? `Pituus: ${validate(sliderValue)} Sanaa`
                                : `Pituus: ${validate(sliderValue)} Merkkiä`}
                        </Label>
                        <Slider
                            id="slider"
                            name="slider"
                            aria-label="Salasanan pituus"
                            value={[validate(sliderValue)]}
                            onValueChange={(val) => sliderVal(val[0])} // makes sure val is not a "number[]"
                            max={
                                formValues.words.selected
                                    ? maxLengthForWords
                                    : maxLengthForChars
                            }
                            min={
                                formValues.words.selected
                                    ? minLengthForWords
                                    : minLengthForChars
                            }
                            step={1}
                        />
                    </div>
                </div>

                <div className="buttonWrapper">
                    <StrengthIndicator
                        password={finalPassword}
                        sliderValue={sliderValue}
                        formValues={formValues}
                    />
                    <button
                        className="inputButton"
                        aria-label="Luo Uusi Salasana"
                        type="submit"
                        onClick={(e) => {
                            e.preventDefault();
                            generate();
                        }}
                    >
                        Uusi Salasana
                        <Refresh
                            className="refresh icon spin"
                            width={20}
                            height={20}
                        />
                    </button>
                </div>
            </form>
        </>
    );
}

const copyText = lang.Finnish
    ? "Kopioi Salasana Klikkaamalla"
    : "Click to Copy";
const inputPlaceholder = 'Esim. "-" tai "?" tai "3!"';
