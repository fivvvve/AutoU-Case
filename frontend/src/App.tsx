import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { api } from "../lib/axios";
import { useWindowWidth } from "../hooks/WidthHook";
import toastLib, { Toaster } from 'react-hot-toast';

//Icons
import { MdDarkMode } from "react-icons/md";
import { BsFillBrightnessHighFill } from "react-icons/bs";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { FaTrash } from "react-icons/fa6";
import { FaRegClipboard } from "react-icons/fa";

//Components
import { FileInput, Label, Textarea } from "flowbite-react";

interface Response {
    original_content: string;
    classification: string;
    suggested_response: string;
}

function App() {
    const width = useWindowWidth();
    const [theme, setTheme] = useState<string>();
    const [text, setText] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const [responses, setResponses] = useState<Response[]>([]);
    const [loading, setLoading] = useState(false);

    //change between dark and light theme and save preferred theme in cookies
    function toggleTheme() {
        if(theme === "dark") {
            setTheme("light");
            document.documentElement.classList.remove("dark");
            Cookies.set("mode", "light", { expires: 5 });
        } else {
            setTheme("dark");
            document.documentElement.classList.add("dark");
            Cookies.set("mode", "dark", { expires: 5 });
        }
    }

    //get user preferred theme on load
    useEffect(() => {
        const mode = Cookies.get("mode");
        if (mode) {
            setTheme(mode);
            if(mode === "light") document.documentElement.classList.remove("dark");
            else document.documentElement.classList.add("dark");
            return;
        }

        //case preferred theme was not in cookies - get browser theme
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        const defaultTheme = prefersDark ? "dark" : "light";
        setTheme(defaultTheme);

        if (prefersDark) document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");

        Cookies.set("mode", defaultTheme, { expires: 5 });
    }, []);

    //send file to api
    async function submitFile(e: any) {
        e.preventDefault();

        if(!file) return;

        //check for correct file type
        const fileSplit = file.name.split('.');
        if(fileSplit[fileSplit.length-1].toLowerCase() !== "txt" && fileSplit[fileSplit.length-1].toLowerCase() !== "pdf") {
            toastLib.error("Extensão de arquivo inválida. Os arquivos devem ser PDF ou TXT");
            return;
        }

        setLoading(true);
        toastLib.success("Email enviado para classificação");

        const formData = new FormData();
        formData.append("email_file", file);

        await api.post("email/classify-by-file", formData, {
            headers: {"Content-Type": "multipart/form-data"}
        }).then((response) => {
            setResponses(prev => [...prev, response.data]); //append new response to responses list
            toastLib.success("Email classificado. Veja logo abaixo na lista", {
                duration: 5000
            });
        }).catch((error) => {
            if(error.response.data.detail.ok) toastLib.error(error.response.data.detail.message); //check for known api error
            else toastLib.error("Erro ao classificar email");
        }).finally(() => {
            setLoading(false);
        });
    }

    async function submitText(e: any) {
        e.preventDefault();

        setLoading(true);
        toastLib.success("Email enviado para classificação")

        await api.post("email/classify-by-text", {
            text: text
        }).then((response) => {
            setResponses(prev => [...prev, response.data]); //append new response to responses list
            toastLib.success("Email classificado. Veja logo abaixo na lista", {
                duration: 5000
            });
        }).catch((error) => {
            if(error.response.data.detail.ok) toastLib.error(error.response.data.detail.message); //check for known api error
            else toastLib.error("Erro ao classificar email");
        }).finally(() => {
            setLoading(false);
        });
    }

    //copy text to user clipboard
    async function copyToClipBoard(text: string) {
        await navigator.clipboard.writeText(text).then(() => {
            toastLib.success("Texto copiado")
        })
    }

  return (
        <>

            {/* theme button */}
            <button id="theme-toggle" type="button" className="absolute right-10 top-5 rounded-full p-2.5 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800 outline-none" onClick={toggleTheme} title="Trocar de tema">
                {theme === "dark" ? 
                    <BsFillBrightnessHighFill />
                :
                    <MdDarkMode />
                }
            </button>
            
            {/* title and logo */}
            <div className="flex justify-center items-center mt-6 gap-[10px]">
                <figure className="m-0 p-0">
                    <a href="https://www.linkedin.com/company/autou/" target="_blank">
                        <img src="./Logo.png" alt="AutoU Logo" className="w-15"/>
                    </a>
                </figure>
                <h1 className="m-0 p-0 text-[30px]">AutoU Case Prático</h1>
            </div>

            <main className="mt-[40px] mx-[20px]">
                <p className="text-[19px] text-justify mx-5">
                    Esta é uma aplicação para a classificação de emails, indicando se o email é ou não importante e fornecendo uma mensagem quando conveniente. Devido à limites estabelecidos pela API de IA utilizada, somente é possível analisar até 10 emails por minuto e 250 por dia.
                    Para usar faça upload de um arquivo de email ou digite seu texto e envie o conteúdo para o processamento, os resultados poderam ser visualizados na tela.
                </p>

                {/* forms */}
                <div className={`flex justify-center items-stretch mt-[60px] ${width < 864 ? "flex-col gap-10" : "gap-20"}`} >
                    <form className={`form ${width < 864 ? "w-[70%] self-center" : "w-[30%]"}`} onSubmit={(e) => submitFile(e)}>
                        <div className="form-div">
                            <Label className="text-[16px]" htmlFor="file-upload-helper-text">
                                Faça upload de seu arquivo (.txt ou .pdf):
                            </Label>
                            <FileInput title="Selecionar arquivo" className="file:bg-gray-300 dark:file:bg-gray-400 hover:file:bg-gray-400 dark:hover:file:bg-gray-500 file:text-black text-black dark:text-black border-darkerWhite dark:border-darkerWhite dark:bg-white focus:border-primary-500 dark:focus:border-primary-500 focus:ring-primary-500  dark:focus:ring-primary-500 text-sm"
                            id="file-upload-helper-text" required onChange={(e) => e.target.files?.length && setFile(e.target.files[0])}/>
                        </div>
                        <button type="submit" className="submit-button" title="Enviar arquivo de email">
                            Enviar arquivo
                        </button>
                    </form>
                    <form className={`form ${width < 864 ? "w-[70%] self-center" : "w-[30%]"}`} onSubmit={(e) => submitText(e)}>
                        <div className="form-div">
                            <Label className="text-[16px]" htmlFor="comment">Digite ou cole o texto de seu email:</Label>
                            <Textarea title="Texto de email" className=" bg-white dark:bg-white dark:text-text border-darkerWhite dark:border-darkerWhite dark:placeholder-gray-700 dark:focus:border-primary-500 dark:focus:ring-primary-500 text-[15px]"
                            id="comment" placeholder="Texto do email..." required rows={5} onChange={(value) => setText(value.target.value)} value={text} minLength={10}/>
                        </div>
                        <button type="submit" className="submit-button" title="Enviar texto do email">
                            Enviar texto
                        </button>
                    </form>
                </div>

                {/* classified emails lists */}
                <section className="my-20 mx-10">
                    <h2 className="text-2xl text-center border-b p-3">Emails classificados</h2>
                        <div className="flex flex-col items-center justify-center mx-auto my-2 text-justify">
                            {responses.length === 0 ? (
                                loading ? <AiOutlineLoading3Quarters size={25} className="mt-5 animate-spin"/> : <p className="py-5">Nenhum email classificado ainda</p>
                            ) : (
                                <>
                                    {/* check for best layout according to window width size */}
                                    {width >= 864 ? (
                                        <>
                                            <div className="flex gap-10 my-2 w-full">
                                                <p className=" w-[35%]">Email Original</p>
                                                <p className="text-center w-[170px]">Classificação</p>
                                                <p className=" flex-1">Resposta Sugerida</p>
                                            </div>
                                            {responses.map((response, index) => (
                                                <div className={`relative flex my-2 w-full pb-3 border-dashed ${index !== responses.length - 1 && "border-b"}`} key={index}>
                                                    <div className="flex gap-10 w-full">
                                                        <p className="w-[35%] max-h-32 overflow-y-auto overflow-x-hidden">{response.original_content}</p>
                                                        <p className="w-[170px] text-center">{response.classification}</p>
                                                        <div className="flex-1 flex gap-1.5 mr-5">
                                                            <p className="max-h-36 overflow-y-auto overflow-x-hiddenm mr-1">{response.suggested_response}</p>
                                                            <div title="Copiar resposta" className="cursor-pointer mt-1" onClick={() => copyToClipBoard(response.suggested_response)}>
                                                                <FaRegClipboard size={16} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div title="Remover email" className="trash-button absolute flex items-center justify-center self-center right-[-22px]"
                                                        onClick={() => {
                                                            setResponses(prev => prev.filter((_, rIndex) => rIndex !== index))
                                                        }}
                                                    >
                                                        <FaTrash className="text-red-700 dark:text-red-600" size={15}/>
                                                    </div>
                                                </div>
                                                
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {responses.map((response, index) => (
                                                <div className={`relative flex justify-center my-2 pb-3 border-dashed w-full ${index !== responses.length - 1 && "border-b"}`} key={index}>
                                                    <div className="flex flex-col gap-6">
                                                        <p className="text-center">Email {index+1}</p>
                                                        <p className="text-center">Classificação: {response.classification}</p>
                                                        <div className="flex gap-1 w-full">
                                                            <p className="max-h-36 overflow-y-auto overflow-x-hidden mr-2">Resposta sugerida: {response.suggested_response}</p>
                                                            <div title="Copiar resposta" className="cursor-pointer mt-1" onClick={() => copyToClipBoard(response.suggested_response)}>
                                                                <FaRegClipboard size={16} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="absolute trash-button top-[-15px] right-0 mt-2"
                                                        onClick={() => {
                                                            setResponses(prev => prev.filter((_, rIndex) => rIndex !== index))
                                                        }}
                                                    >
                                                        <FaTrash className="text-red-700" size={15}/>
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    )}
                                    {loading && <AiOutlineLoading3Quarters size={25} className="mt-5 animate-spin"/>}
                                </>
                            )}
                        </div>
                </section>
                    
            </main>
            <Toaster />
        </>
  )
}

export default App;
