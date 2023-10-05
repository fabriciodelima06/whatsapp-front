import axios from "axios"
import { useEffect, useState } from "react"
import styled from "styled-components"

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

const Content = styled.div`
    width: 100%;
    max-width: 720px;
    background-color: aliceblue;
    display: flex;
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
    const [numero, setNumero] = useState()
    const [message, setMessage] = useState()

    const user = localStorage.getItem("user")

    useEffect(() => {
        axios.post('http://localhost:3333/status', {
            sessionName: user
        })
            .then(resp => setStatus(resp.data))
            .catch(error => console.log(error))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Container>

            <Header className="mb-5">
                <h2 className="font-semibold text-indigo-600">
                    Olá {user}
                </h2>
            </Header>

            <Content>
                {!status ? <h2>Conectando...</h2>
                    :
                    status.qr_code ? <img src="status.qr_code" /> :
                    <>
                        <Left>
                            <div>
                                <label htmlFor="user" className="block text-sm font-medium leading-6 text-gray-900">
                                    Número
                                </label>
                                <div className="mt-2">
                                    <input
                                        required
                                        type="number"
                                        placeholder="5599999999"
                                        onChange={e => setNumero(Number(e.target.value))}
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
                            <button
                                // onClick={handleClick}
                                className="flex mt-8 w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Enviar
                            </button>
                        </Left>
                        <Right>

                        </Right>
                    </>}
            </Content>
        </Container>
    )
}