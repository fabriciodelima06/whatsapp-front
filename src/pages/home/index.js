import { useEffect, useState } from "react"
import styled from "styled-components"
import CircularProgress from '@mui/material/CircularProgress'
import axios from "axios"

const Container = styled.div`
    display: flex;
    padding: 36px;
    flex-direction: column;
    align-items: center;
`

const Header = styled.div`
    width: 100%;
    max-width: 720px;
`

const ContentForm = styled.form`
    width: 100%;
    padding: 16px;
    max-width: 720px;
    min-height: 50vh;
    background-color: aliceblue;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Left = styled.div`
    width: 100%;
    padding: 16px;
`

const Right = styled.div`
    width: 100%;
    padding: 16px;
`

export const Home = () => {

    const [status, setStatus] = useState()
    const [update, setUpdate] = useState(false)
    const [sendStatus, setSendStatus] = useState()
    const [sending, setSending] = useState(false)
    const [error, setError] = useState()
    const [number, setNumber] = useState()
    const [message, setMessage] = useState()

    const user = localStorage.getItem("user")

    const urlApi = 'https://whatsapp-api-qcel.onrender.com'//'http://localhost:3333'

    useEffect(() => {
        setUpdate(false)
        setStatus(undefined)
        setError(undefined)
        let checkStatus = setInterval(function () {
            axios.post(`${urlApi}/status`, { sessionName: user })
                .then(resp => {
                    setStatus(resp.data)
                    if (resp?.data?.connected) clearInterval(checkStatus)
                })
                .catch(error => {
                    console.log(error)
                    setError(error)
                    clearInterval(checkStatus)
                })
        }, 5000)

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [update])

    const sendMessage = e => {
        e.preventDefault()
        setSending(true)
        setError(undefined)

        axios.post(`${urlApi}/status`, { sessionName: user })
            .then(resp => {
                setStatus(resp.data)
                if (!resp?.data?.connected) {
                    setUpdate(true)
                } else {
                    axios.post(`${urlApi}/send`, { sessionName: user, number: Number(number), message })
                        .then(resp => setSendStatus({ error: false, success: true }))
                        .catch(error => {
                            console.log(error)
                            setSendStatus({ error: error.message, success: false })
                        })
                        .finally(() => setSending(false))
                }
            })
            .catch(error => {
                console.log(error)
                setSendStatus({ error: error.message, success: false })
            })
            .finally(() => setSending(false))
    }

    const MuiButton = props => {
        const { className, children, onClick, ...p } = props
        return (
            <button
                onClick={onClick}
                className={`flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 ${className}`}
                {...p}
            >
                {children}
            </button>
        )
    }

    return (
        <Container>

            <Header className="mb-5 flex justify-between">
                <h1 className="font-semibold text-indigo-600 text-xl">
                    Olá {user[0].toUpperCase() + user.substring(1)}
                </h1>
                <h1 className="font-semibold text-indigo-600 text-xl">
                    Status: {!status?.connected ? 'Conectando... Aguarde!' : sending ? 'Enviando Mensagem...' : 'Conectado'}
                </h1>
            </Header>

            <ContentForm onSubmit={sendMessage}>
                {!status
                    ? <div className="flex flex-col items-center gap-3">
                        {error
                            ? <>
                                <h1 className="font-semibold text-indigo-600 text-xl">Erro no Servidor</h1>
                                <MuiButton onClick={() => setUpdate(true)}>Atualizar</MuiButton>
                            </>
                            : <><h1 className="font-semibold text-indigo-600 text-xl">Conectando...</h1><CircularProgress /></>}
                    </div>
                    : status.qr_code && !status.connected
                        ? <div className="flex flex-col items-center w-full">
                            <h1 className="text-xl mb-2 font-semibold text-indigo-600 text-center">
                                Conecte-se ao Whatsapp web
                            </h1>
                            <img src={status.qr_code} alt="qr code" />
                        </div>
                        : <>
                            <Left>

                                {sendStatus?.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">{sendStatus.error}</span>
                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                        <svg onClick={() => setSendStatus(undefined)} className="fill-current h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                    </span>
                                </div>}

                                {sendStatus?.success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                                    <span className="block sm:inline">Mensagem enviada com sucesso!</span>
                                    <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
                                        <svg onClick={() => setSendStatus(undefined)} className="fill-current h-6 w-6 text-green-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" /></svg>
                                    </span>
                                </div>}

                                <div>
                                    <label htmlFor="user" className="block text-sm font-medium leading-6 text-gray-900">
                                        Número
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            required
                                            type="number"
                                            placeholder="5599999999"
                                            onChange={e => setNumber(e.target.value)}
                                            className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <div className="mt-8">
                                    <label htmlFor="user" className="block text-sm font-medium leading-6 text-gray-900">
                                        Mensagem
                                    </label>
                                    <div className="mt-2">
                                        <textarea
                                            required
                                            rows="10"
                                            onChange={e => setMessage(e.target.value)}
                                            className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        />
                                    </div>
                                </div>
                                <MuiButton type="submit" className='mt-5' >
                                    Enviar
                                </MuiButton>
                            </Left>
                            <Right>

                            </Right>
                        </>}
            </ContentForm>
        </Container>
    )
}