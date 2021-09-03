import React, {FormEvent, useEffect, useState} from 'react';

import { Card } from 'primereact/card';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { addLocale } from 'primereact/api';
import api from '../../services/api';
import { useHistory } from 'react-router-dom';
import ToastComponent from '../../components/Toast';

import './style.css';

const Signup = () => {
    const history = useHistory();
    
    const [getName, setName] = useState('');
    const [getDate, setDate] = useState<any>();
    const [getEmail, setEmail] = useState('');
    const [getMainPhone, setMainPhone] = useState('');
    const [getSecondaryPhone, setSecondaryPhone] = useState('');
    const [getUser, setUser] = useState('');
    const [getPassword, setPassword] = useState('');
    const [getConfirmPassword, setConfirmPassword] = useState('');

    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');

    addLocale('pt', {
        firstDayOfWeek: 0,
        dayNames: ["domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
        dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        dayNamesMin: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        // dayNamesMin: ["D", "S", "T", "Q", "Q", "S", "S"],
        monthNames: ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
        monthNamesShort: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"],
        today: "Hoje",
        clear: "Limpar",
    });

    async function handleSubmit(event: FormEvent){
        event.preventDefault();
        await api.post('/users', {
            username: getUser,
            password: getPassword,
            confirmPassword: getConfirmPassword,
            name: getName,
            email: getEmail,
            dataNascimento: getDate,
            telefonePrimario: getMainPhone,
            telefoneSecundario: getSecondaryPhone
        }).then(response => {
            if(response.data.createdUser){
                showToast("success", "Sucesso", "Cadastro criado com sucesso.");
                setTimeout(() => {
                    history.push("/");
                }, 1000)
            }else{
                showToast("error", "Erro!", response.data.error);
            }
        }).catch(err => {
            if(!err.response.data.createdUser && err.response.status == 401){
                showToast("error", "Erro!", err.response.data.error + " Erro " + err.response.status);
            }else{
                showToast("error", "Erro!", err.response.data.error + " Status de erro: " + err.response.status);
            }
        })
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
                <Card title="Cadastro de Usuário" className="col-sm-8 py-sm-5 px-sm-5 mx-sm-auto card">
                    <form onSubmit={handleSubmit}>
                        <div className="p-inputgroup">
                            <span className="p-float-label">
                                <InputText id="name" value={getName} onChange={(e) => setName((e.target as HTMLInputElement).value)} autoFocus/>
                                <label htmlFor="name">Nome completo</label>
                            </span>
                        </div>
                        <div className="my-4 p-inputgroup">
                            <span className="p-float-label">
                                {/* <Calendar id="date" value={getDate} onChange={(e) => setDate((e.target as HTMLInputElement).value)} autoFocus/> */}
                                <Calendar id="buttonbar" locale="pt" mask="99/99/9999" value={getDate} onChange={(e) => setDate(e.value)} dateFormat="dd/mm/yy" showButtonBar monthNavigator yearNavigator yearRange="1900:2021"/>
                                <label htmlFor="date">Data de Nascimento</label>
                            </span>
                        </div>
                        <div className="my-4 p-inputgroup">
                            <span className="p-float-label">
                                <InputText id="email" value={getEmail} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} autoFocus/>
                                <label htmlFor="email">Email</label>
                            </span>
                        </div>
                        <div className="my-4 p-inputgroup">
                            <span className="p-float-label">
                                <InputMask id="mainPhone" mask="(99) 99999-9999" value={getMainPhone} onChange={(e) => setMainPhone((e.target as HTMLInputElement).value)} />
                                <label htmlFor="mainPhone">Telefone Principal</label>
                            </span>
                        </div>
                        <div className="my-4 p-inputgroup">
                            <span className="p-float-label">
                                <InputMask id="secondaryPhone" mask="(99) 9999-9999" value={getSecondaryPhone} onChange={(e) => setSecondaryPhone((e.target as HTMLInputElement).value)} />
                                <label htmlFor="secondaryPhone">Telefone Secundário</label>
                            </span>
                        </div>
                        <div className="my-4 p-inputgroup">
                            <span className="p-float-label">
                                <InputText id="user" value={getUser} onChange={(e) => setUser((e.target as HTMLInputElement).value)} />
                                <label htmlFor="user">Usuário</label>
                            </span>
                        </div>
                        <div className="p-inputgroup my-4">
                            <span className="p-float-label">
                                <Password id="password" value={getPassword} onChange={(e) => setPassword((e.target as HTMLInputElement).value)} toggleMask 
                                weakLabel="Fraca" mediumLabel="Média" strongLabel="Forte" promptLabel="Digite uma senha"/>
                                <label htmlFor="password">Senha</label>
                            </span>
                        </div>
                        <div className="p-inputgroup my-4">
                            <span className="p-float-label">
                                <Password id="confirmPassword" value={getConfirmPassword} onChange={(e) => setConfirmPassword((e.target as HTMLInputElement).value)} toggleMask
                                weakLabel="Fraca" mediumLabel="Média" strongLabel="Forte" promptLabel="Digite uma senha"/>
                                <label htmlFor="confirmPassword">Confirmar Senha</label>
                            </span>
                        </div>
                        <div className="p-justify-end">
                            <Button type="submit" label="Cadastrar" icon="pi pi-sign-in" className="bg-success text-light" />
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

export default Signup;