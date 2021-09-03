import React, {FormEvent, useEffect, useState} from 'react';

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import api from '../../services/api';
import { Link, useHistory } from 'react-router-dom';
// import ToastComponent from '../../components/Toast';
import { useCookies } from 'react-cookie';
import env from 'react-dotenv';

import "./style.css";
import ToastComponent from '../../components/Toast';

const statusError = " Status de erro: ";

const Login = () => {
    const history = useHistory();
    
    const [getUser, setUser] = useState('');
    const [getPassword, setPassword] = useState('');

    const [, setCookies] = useCookies([]);

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        await api.post('/users/login', {username: getUser, password: getPassword}).then(response => {
            if(response.data.userLogin){
                var idUsuario = response.data.userData.IdUsuario;
                var usuario = response.data.userData.Usuario;
                var nomeUsuario = response.data.userData.NomeUsuario;
                var accessToken = response.data.accessToken;
                var refreshToken = response.data.refreshToken;
                setCookiesLogin(idUsuario, usuario, nomeUsuario, accessToken, refreshToken);
                history.push('/home');
            }else{
                showToast("error", "Erro", response.data.error);
            }
        }).catch(err => {
            if(!err.response.data.userLogin && err.response.status === 401){
                showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
            }else if(err.response.status === 400){
                showToast("error", "Erro!", err.response.data.error + statusError + err.response.status);
            }else{
                showToast("error", "Erro!", err.response.data.error + statusError + err.response.status);
            }
        })
    }

    async function setCookiesLogin(idUsuario: string, usuario: string, nomeUsuario: string, accessToken: string, refreshToken: string){
        let nomeArray = usuario.split(' ');
        usuario = nomeArray[0];
        // setCookies('userData', {IdUsuario: idUsuario, Usuario: usuario, Token: accessToken}, {maxAge: 60});
        const cookieName = 'userData' as never;
        setCookies(cookieName, {IdUsuario: idUsuario, Usuario: usuario, Nome: nomeUsuario, accessToken: accessToken, refreshToken: refreshToken});
    }

    function showToast(messageType: string, messageTitle: string, messageContent: string){
        setToast(false)
        setMessageType(messageType);
        setMessageTitle(messageTitle);
        setMessageContent(messageContent);
        setToast(true);
        setTimeout(() => {
            setToast(false);
        }, 4500)
    }

    return (
        <>
            <div className="content">
                <Card title="Login" className="col-sm-8 py-sm-5 px-sm-5 mx-sm-auto card-login">
                    <form onSubmit={handleSubmit}>
                        <div className="p-inputgroup inputGroup">
                            <span className="p-float-label">
                                <InputText id="user" value={getUser} onChange={(e) => setUser((e.target as HTMLInputElement).value)} autoFocus/>
                                <label htmlFor="user">Usuário</label>
                            </span>
                        </div>
                        <div className="p-inputgroup my-4 inputGroup">
                            <span className="p-float-label">
                                <Password id="password" value={getPassword} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} feedback={false}/>
                                <label htmlFor="password">Senha</label>
                            </span>
                        </div>
                        <div className="p-justify-end">
                            <Button className="bg-success text-light" type="submit" label="Login" icon="pi pi-sign-in" />
                        </div>
                        <div className="mt-3">
                            <span>Ainda não possui cadastro?</span><br/>
                            <Link to="/signup">
                                <span className="text-info">Crie já o seu</span>
                            </Link>
                        </div>
                    </form>
                </Card>
                {getToast &&
                    <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                }
            </div>
        </>
    )
}

export default Login;