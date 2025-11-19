"use client";

import React from "react";
import JsBarcode from 'jsbarcode';
import { Switch } from "./Switch"; 
import { MdContentCopy } from "react-icons/md";
import { generateBarcodeFromName } from "@/utils/generateBarcodeFromName"; 

export const BarcodeGenerator = () => {
    const [isNumeroDeBarra, setNumeroDeBarra] = React.useState(false);
    const [nombreProducto, setNombreProducto] = React.useState("");
    const barcodeRef = React.useRef(null);
    const [nuevoCodigoBarra, setNuevoCodigoBarra] = React.useState("");
    const [warningMessage, setWarningMessage] = React.useState("");
    const [isCopied, setCopied] = React.useState(false);

    React.useEffect(() => {
        if (barcodeRef.current) {
            JsBarcode(barcodeRef.current, nuevoCodigoBarra, {
                format: "CODE128",
                lineColor: "#000",
                width: 2,
                height: 40,
                displayValue: true,
            });
        }
    }, [nuevoCodigoBarra]);

    React.useEffect(() => {
        if (isCopied) {
            const timer = setTimeout(() => {
                setCopied(false);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isCopied]);

    const onGenerateBarcode = (e) => {
        e.preventDefault();
        if (!isNumeroDeBarra) {
            if (nombreProducto !== "") {
                setWarningMessage("");
                setNuevoCodigoBarra(generateBarcodeFromName(nombreProducto));
            } else {
                setWarningMessage("Debes ingresar el nombre del producto para generar su codigo de barra");
            }
        } else {
            setNuevoCodigoBarra(nombreProducto);
        }
    };

    const copiarAlPortapapeles = (nuevoCodigoBarra) => {
        navigator.clipboard.writeText(nuevoCodigoBarra)
            .then(() => {
                setCopied(true);
            })
            .catch((err) => {
                setCopied(false);
            });
    };

    return (
        <form
            onSubmit={e => onGenerateBarcode(e)}
            className="p-4 flex flex-col space-y-10 items-center justify-center w-full h-[85vh] xl:flex-row xl:space-x-20"
        >
            <div className="space-y-3 w-full md:w-[30rem]">
                <section className="flex flex-col-reverse lg:flex-row lg:items-center justify-between space-y-1">
                    <div>
                        <h1 className="font-bold text-xl text-left">
                            Generador de Codigos de Barra
                        </h1>
                    </div>
                    <div className="flex items-center self-start space-x-1 py-1 lg:py-0">
                        <div>
                            <p className="font-light text-xs">
                                Codigo existente
                            </p>
                        </div>
                        <Switch
                            width="w-[3.5rem]"
                            height="h-[1.8rem]"
                            activeColor="bg-green-500"
                            circleClassName="w-5 h-5"
                            inActiveColor="bg-gray-300"
                            isSwitchTrue={isNumeroDeBarra}
                            setSwitchTrue={() => setNumeroDeBarra(!isNumeroDeBarra)}
                        />
                    </div>
                </section>
                <input
                    type="text"
                    id="nombreProducto"
                    name="nombreProducto"
                    value={nombreProducto}
                    className="border-2 border-gray-300 px-3 py-2 rounded w-full"
                    placeholder={`Ingrese el ${isNumeroDeBarra ? "numero del codigo de barra existente" : "nombre del producto"}`}
                    onChange={e => setNombreProducto(e.target.value)}
                />
                <p className="text-sm text-red-500 font-light">
                    {warningMessage}
                </p>
                <button
                    type="submit"
                    className="px-3 py-2 rounded-md w-full bg-black border-2 border-black text-white font-bold duration-300 ease-in-out transition-all hover:bg-white hover:text-black"
                >
                    Generar
                </button>
            </div>
            {(nuevoCodigoBarra !== "") &&
                (<div className="py-5 space-y-2 w-full md:w-[30rem]">
                    <p className="text-lg font-light text-center">
                        Nuevo Codigo de Barras Generado
                    </p>
                    <div className="border-2 border-gray-500 px-3 py-2 rounded flex items-center justify-between">
                        <p>
                            {nuevoCodigoBarra}
                        </p>
                        <button
                            type="button"
                            className="flex"
                            onClick={() => copiarAlPortapapeles(nuevoCodigoBarra)}
                        >
                            <span className="px-3">
                                {isCopied ? "¡Copiado!" : ""}
                            </span>
                            <MdContentCopy size={20} />
                        </button>
                    </div>
                    <div className="flex items-center justify-center">
                        <svg ref={barcodeRef}></svg>
                    </div>
                </div>)}
        </form>
    );
};