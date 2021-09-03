import React, {useEffect, useState} from 'react';
import { useHistory, Link } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import env from 'react-dotenv';

import { useCookies } from 'react-cookie';
import api from '../../services/api';
import ToastComponent from '../Toast';
import { handleLogoutService } from '../../services/middleware';

const statusError = " Status de erro: ";


const HeaderNotLogin = () => {
    const history = useHistory();
    const [getCookies, , removeCookies] = useCookies(['userData']);
    const [getShowBack, setShowBack] = useState<boolean>(true);
    const [getChecked, setChecked] = useState<boolean>(false);
    const [getSystemTheme, setSystemTheme] = useState<string>('Claro');
    const [getSidebar, setSidebar] = useState<boolean>(false);
    const [getName, setName] = useState<string>('');
    const [getAccessToken, setAccessToken] = useState<string>('');
    
    const [getToast, setToast] = useState<boolean>();
    const [getMessageType, setMessageType] = useState<string>('');
    const [getMessageTitle, setMessageTitle] = useState<string>('');
    const [getMessageContent, setMessageContent] = useState<string>('');
    
    // const config = {
    //     headers: { Authorization: `Bearer ${accessToken}` }
    // };

    useEffect(() => {
        // if(!getCookies.userData){
        //     history.push('/')
        // }else{
        //     setName(getCookies.userData.Nome)
        //     setAccessToken(getCookies.userData.accessToken)
        // }
    }, [])

    function handleSwitchTheme(){
        if(getChecked === false){
            setChecked(true);
            setSystemTheme('Escuro');
        }else{
            setChecked(false);
            setSystemTheme('Claro');
        }
    }

    function handleBackButton() {
        history.goBack();
    }

    async function handleLogout() {
        await handleLogoutService(getCookies, removeCookies).then(() => {
            removeCookies('userData');
            history.push("/");
        }).catch(err => {
            showToast("error", "Erro!", err.error.response.data.error + statusError + err.error.response.status);
        });

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
            <div className="container-fluid m-0 p-0 mb-5">
                <nav className="navbar navbar-expand-sm header-background navbar-dark">
                    <Button className="ms-2 bg-transparent" style={{color: "white"}} icon="pi pi-bars" onClick={() => setSidebar(true)}/>
                    <Link to="/" className="navbar-brand cursor-pointer text-small ps-3">
                        {env.APP_NAME}
                    </Link>
                    {/* <div className="ms-auto me-2">
                        <Button type="button" label="Messages" icon="pi pi-users" className="p-button-primary p-button-outlined text-dark" />
                    </div> */}
                </nav>
                <Sidebar visible={getSidebar} onHide={() => setSidebar(false)}>
                    <h4>Configurações do sistema</h4>
                    <div className="">
                        <h5>Bem vindo, {getName}</h5>
                        <Button type="button" label="Sair" icon="pi pi-sign-out" className="p-button-info" onClick={handleLogout}/>
                    </div>
                    <div className="mt-4 ms-auto me-2 form-check form-switch">
                        <label className="form-check-label text-auto" htmlFor="flexSwitchCheckChecked">Cor do sistema: {getSystemTheme}</label>
                        <input className="form-check-input" type="checkbox" onClick={() => {handleSwitchTheme()}} checked={getChecked}/>
                    </div>
                </Sidebar>
                {/* <div className="position-absolute arrow-left" style={{ left: '0px', top: '50px' }}> */}
                <div className="position-absolute arrow-left" style={{ left: '0px', top: '60px' }}>
                    <button className="btn" onClick={handleBackButton}>
                        <i className="pi pi-arrow-left text-white"></i>
                    </button>
                </div>
                {getToast &&
                    <ToastComponent messageType={getMessageType} messageTitle={getMessageTitle} messageContent={getMessageContent}/>
                }
            </div>
        </>
    )
}

export default HeaderNotLogin;